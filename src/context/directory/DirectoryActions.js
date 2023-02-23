import {ipcRenderer} from 'electron';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
const util = require('util');

dotenv.config();

const tmdbApiKey = process.env.TMDB_KEY;

ipcRenderer.invoke('getPath').then((result) => {
    const mediaListPath = path.join(result, 'MediaList' + '.json');

    if (mediaListPath) {
        sessionStorage.setItem('mediaListPath', mediaListPath);
    }
})
.catch((err) => {
    console.log(err);
});

ipcRenderer.on('settings:get', (event, settings) => {
    const savedDirectory = settings.directoryPath;

    if (savedDirectory) {
        sessionStorage.setItem('savedDirectory', savedDirectory);
    }
});

//===================================================================================================================================================================//

// Gets the difference in milliseconds between today's date and the passed in date.
// Returns true or false depending on whether the difference is less or more than the passed in length of time (week or month).
export const getTimeDifference = (date, lengthOfTime) => {
    try {
        const todaysDate = Date.now();

        if (lengthOfTime === 'month') {
            const monthInMillis = 2629746000;
            return todaysDate - date >= monthInMillis;
        }
        else if (lengthOfTime === 'week') {
            const weekInMillis = 604800000;
            return todaysDate - date >= weekInMillis;
        }

        return null;
    } 
    catch (error) {
        throw new Error('getTimeDifference Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Converts a number of minutes into hours and remaining minutes.
export const minutesToHours = (totalMinutes) => {
    try {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
    
        if (hours === 0) {
            return `${minutes}m`;
        }
        else if (minutes === 0) {
            return `${hours}h`;
        }
        else {
            return`${hours}h ${minutes}m`;
        }
    } 
    catch (error) {
        throw new Error('minutesToHours Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Converts a number date (ex. 2023-01-30) to a word format (ex. January 30, 2023);
export const dateNumbersToWords = (date) => {
    try {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let month = date.substring(5,7);

        if (month.startsWith('0')) {
            month = month.substring(1);
        }
        return `${months[month - 1]} ${date.substring(8)}, ${date.substring(0,4)}`; 
    } 
    catch (error) {
        throw new Error('dateNumbersToWords Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Reads the passed in directory and creates a list of files/folders inside that directory.
export const getOtherFoldersList = (directory) => {
    try {
        const folders = fs.readdirSync(directory)
        .map((folder) => {
            const stats = fs.statSync(path.join(directory, folder));
            return {
                file_name: folder.toLowerCase(),
                path: path.join(directory, folder),
                is_directory: stats.isDirectory(),
            }
        });

        return folders;
    } 
    catch (error) {
        console.log('getOtherFoldersList Error: ' + error);
        return null;
    }
};

//===================================================================================================================================================================//

// Returns files in a directory that are not associated with a shows episode.
export const getOtherFilesInDirectory = (seasonObject, episodesList) => {
    try {
        const filesInDirectory = fs.readdirSync(seasonObject.directory.path)
        .map((file) => {
            const stats = fs.statSync(path.join(seasonObject.directory.path, file));
            return {
                file_name: file.toLowerCase(),
                path: path.join(seasonObject.directory.path, file),
                is_directory: stats.isDirectory(),
            }
        });

        // Finds episodes objects that have a 'directory' property.
        const episodesInDirectory = episodesList.filter((episode) => Object.hasOwn(episode, 'directory'));
        
        // If only episodes from the season are in the directory, there are no other files and return null.
        if (episodesInDirectory.length === filesInDirectory.length) {
            return null;
        }

        // Maps the file names of all the episodes in directory and sorts alphabetically.
        const episodeFileNames = episodesInDirectory.map((file) => file.directory.file_name);
        episodeFileNames.sort();

        // Removes indexes from list that match the file name of the episodes in the json file.
        // Leaves only files that are not connected to an episode.
        for (let i = 0; i < filesInDirectory.length; i++) {
            for (let j = 0; j < episodeFileNames.length; j++) {
                if (filesInDirectory[i].file_name === episodeFileNames[j]) {
                    filesInDirectory.splice(i, 1);
                }
            }
        }

        if (filesInDirectory.length > 0) {
            return filesInDirectory;
        }

        return null;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }

        throw new Error('getOtherFilesInDirectory Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Adds an object with directory info as a property to a matching episode in the 'MediaList.json.
export const addEpisodesInDirectoryToList = (seasonObject, directories, id) => {
    try {
        let needSave = false;
        const regex = /\d+/; // regex for getting the first group of digits in a string.
        const index = directories.findIndex(element => element.id === Number(id));
        const episodesInDirectory = fs.readdirSync(seasonObject.directory.path)
        .map((file) => {
            return {
                file_name: file.toLowerCase(),
                path: path.join(seasonObject.directory.path, file),
                episode_number: file.match(regex) ? file.match(regex)[0] : '0'
            }
        });

        // Sorts the episodes by file name size and then filters only unique episode numbers.
        // In circumstances where the regex produces multiple of the same episode number (eg. '1hello' & '1' will both have an episode number of 1),
        // I have decided to choose the shortest file name as the 'correct' file. This should only come up in cases where the users naming conventions are incorrect.
        episodesInDirectory.sort((a, b) => a.file_name.length - b.file_name.length);
        const uniqueEpisodes = episodesInDirectory.filter((set => file => !set.has(file.episode_number) && set.add(file.episode_number))(new Set));
        
        for (let i = 0; i < seasonObject.episodes.length; i++) {
            for (let j = 0; j < uniqueEpisodes.length; j++) {
                if (seasonObject.episodes[i].episode_number === Number(uniqueEpisodes[j].episode_number)) {
                    if (!seasonObject.episodes[i].directory){
                        needSave = true;
                        seasonObject.episodes[i].directory = {...uniqueEpisodes[j]};
                    }
                }
            }

            // Checks if a season directory object exists in json file but has been deleted in directory and if so, deletes that object property.
            const index = uniqueEpisodes.findIndex(element => Number(element.episode_number) === seasonObject.episodes[i].episode_number);
            if (index === -1 && Object.hasOwn(seasonObject.episodes[i], 'directory')) {
                needSave = true;
                delete seasonObject.episodes[i].directory;
            }
        }

        if (needSave) {
            const mediaListPath = sessionStorage.getItem('mediaListPath');
            if(index !== -1) {
                directories[index].seasons[seasonObject.season_number - 1] = seasonObject;
            }

            fs.writeFileSync(mediaListPath, JSON.stringify(directories));
            sessionStorage.setItem('directories', JSON.stringify(directories));
        }

        return seasonObject.episodes;
    } 
    catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }

        throw new Error('addEpisodesInDirectoryToList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Compares all seasons of a tv show to the seasons stored in the directory.
// If a season is in the directory, create an object with the file name and path and add it to the directory json file.
export const addSeasonsInDirectoryToList = (directoryObject, directories, id) => {
    try {
        let needSave = false;
        const regex = /\d+/; // regex for getting the first group of digits in a string.
        const index = directories.findIndex(element => element.id === Number(id));
        const seasonsInDirectory = fs.readdirSync(directoryObject.directory.path)
        .map((file) => {
            return {
                file_name: file.toLowerCase(),
                path: path.join(directoryObject.directory.path, file),
                season_number: file.match(regex) ? file.match(regex)[0] : '0'
            }
        });

        // Sorts the seasons by file name size and then filters only unique season numbers.
        // In circumstances where the regex produces multiple of the same season number (eg. '1hello' & '1' will both have a season number of 1),
        // I have decided to choose the shortest file name as the 'correct' file. This should only come up in cases where the users naming conventions are incorrect.
        seasonsInDirectory.sort((a, b) => a.file_name.length - b.file_name.length);
        const uniqueSeasons = seasonsInDirectory.filter((set => file => !set.has(file.season_number) && set.add(file.season_number))(new Set));

        for (let i = 0; i < directoryObject.seasons.length; i++) {
            for (let j = 0; j < uniqueSeasons.length; j++) {
                if (directoryObject.seasons[i].season_number === Number(uniqueSeasons[j].season_number)) {
                    if (!Object.hasOwn(directoryObject.seasons[i], 'directory')) {
                        needSave = true;
                        directoryObject.seasons[i].directory = {...uniqueSeasons[j]};
                    }
                }
            }

            // Checks if a season directory object exists in json file but has been deleted in directory and if so, deletes that object property.
            const index = uniqueSeasons.findIndex(element => Number(element.season_number) === directoryObject.seasons[i].season_number);
            if (index === -1 && Object.hasOwn(directoryObject.seasons[i], 'directory')) {
                needSave = true;
                delete directoryObject.seasons[i].directory;
            }
        }

        if (needSave) {
            const mediaListPath = sessionStorage.getItem('mediaListPath');
            if(index !== -1) {
                directories[index] = directoryObject;
            }

            fs.writeFileSync(mediaListPath, JSON.stringify(directories));
            sessionStorage.setItem('directories', JSON.stringify(directories));
        }

        return directories[index].seasons;
    } 
    catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }

        throw new Error('addSeasonsInDirectoryToList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Creates and returns an array of episode objects with information about an individual episode.
export const createEpisodesList = (seasonObject) => {
    try {
        const episodes = [];

        if (seasonObject) {
            for(let i = 0; i < seasonObject.episodes.length; i++) {
                episodes[i] = {
                    air_date: seasonObject.episodes[i].air_date || null,
                    episode_number: seasonObject.episodes[i].episode_number || null,
                    name: seasonObject.episodes[i].name || 'No Episode Title Available',
                    overview: seasonObject.episodes[i].overview || 'No Overview Available',
                    runtime: seasonObject.episodes[i].runtime || null,
                    still_path: seasonObject.episodes[i].still_path ? `https://image.tmdb.org/t/p/w200/${seasonObject.episodes[i].still_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png',
                    vote_average: seasonObject.episodes[i].vote_average || null
                }
            }
        }
        return episodes;
    } 
    catch (error) {
        throw new Error('createEpisodesList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Fetches data for all episodes of the passed in season number.
export const fetchEpisodesData = async (id, season) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${tmdbApiKey}`);
    
        if (!response) {
            console.log('No Response');
            return null;
        }
    
        const jsonResponse = await response.json();
        return jsonResponse;
    }
    catch (error) {
        throw new Error('fetchEpisodesData Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Fetches data for episodes and adds the created episodes array to the directory list based on the passed in season.
// Also fetches for new episode data once every month based on when the last episodes array was added to the directory list.
export const addEpisodesToList = async (season, directoryItem, directoryList) => {
    try {
        const hasEpisodes = Object.hasOwn(directoryItem.seasons[Number(season) - 1], 'episodes');

        if (!hasEpisodes || getTimeDifference(directoryItem.date_added, 'month')) {
            const response = await fetchEpisodesData(directoryItem.id, season);
            const episodes = createEpisodesList(response);
    
            if (!hasEpisodes || (hasEpisodes && !util.isDeepStrictEqual(directoryItem.seasons[Number(season) - 1].episodes, episodes))) {
                const mediaListPath = sessionStorage.getItem('mediaListPath');
                const index = directoryList.findIndex(element => element.id === directoryItem.id);
                if (index !== -1) {
                    directoryList[index].seasons[Number(season) - 1].episodes = [...episodes];
                    fs.writeFileSync(mediaListPath, JSON.stringify(directoryList));
                    sessionStorage.setItem('directories', JSON.stringify(directoryList));
                    return directoryList[index].seasons[Number(season) - 1];
                }
            }
        }
        else if (hasEpisodes) {
            return directoryItem.seasons[Number(season) - 1];
        }

        return null;
    } 
    catch (error) {
        throw new Error('addEpisodesToList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Fetches basic data from TMDB API for a movie or tv show that matches the passed in title and returns an array of 20 objects.
export const fetchBasicData = async (title) => {
    try {
        const encodedTitle = encodeURIComponent(title);
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=en-US&query=${encodedTitle}&page=1`);
    
        if (!response) {
          console.log('No Response');
          return null;
        }
    
        const {results} = await response.json();
        return results;
    }
    catch (error) {
        throw new Error('fetchBasicData Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Fetches basic info and adds it to array for each file in the directory that doesn't already have it.
export const addBasicDataToList = async (list, index) => {
    try {
        if (list.tmdb_data === 'No') {
            let data = await fetchBasicData(list.directory.file_name);
            data = data[0];
    
            if (data) {
                list.tmdb_data = 'Yes';
                list.media_type = data.media_type || null;
                list.title = data.media_type === 'movie' ? data.title : data.media_type === 'tv' ? data.name : 'No Title Available';
                list.id = data.id || index;
                list.poster_path = data.poster_path ? `https://image.tmdb.org/t/p/w200/${data.poster_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png';
                list.backdrop_path = data.backdrop_path ? `https://image.tmdb.org/t/p/w500/${data.backdrop_path}` : null;
                list.release = data.media_type === 'movie' ? data.release_date : data.media_type === 'tv' ? data.first_air_date : null;
                list.overview = data.overview || 'No Overview Available';
                list.popularity = data.popularity || null;
            }
            else {
                list.tmdb_data = 'No Data';
                list.media_type = null;
                list.title = list.directory ? list.directory.file_name : 'No Title Found';
                list.id = index;
                list.poster_path = 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png';
                list.backdrop_path = null;
                list.release = null;
                list.overview = null;
                list.popularity = null;
            }
        }
    }
    catch (error) {
        throw new Error('addBasicDataToList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Fetches and returns more detailed info for a single movie or tv show based on passed in media type and id.
export const fetchDetailedData = async (mediaType, id) => {
    try {
        let response;

        if (mediaType === 'tv') {
            response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbApiKey}&append_to_response=credits,recommendations,content_ratings,watch/providers,season/1`);
        }
        else if (mediaType === 'movie') {
            response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&append_to_response=credits,recommendations,release_dates,watch/providers`);
        }
    
        if (!response) {
            console.log('No Response');
            return null;
        }
    
        const jsonResponse = await response.json();
        return jsonResponse;
    }
    catch (error) {
        throw new Error('fetchDetailedData Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Fetches detailed info and adds it to array for each file in the directory that doesn't already have it.
export const addDetailedDataToList = async (list) => {
    try {
        if ((list.tmdb_data === 'Yes' && !list.detailed_info) || list.searchedItem) {
            if (list.media_type === 'movie' || list.media_type === 'tv') {
                const info = await fetchDetailedData(list.media_type, list.id);

                if (list.searchedItem) {
                    list.title = list.media_type === 'movie' ? info.title : list.media_type === 'tv' ? info.name : 'No Title Available';
                    list.backdrop_path = info.backdrop_path ? `https://image.tmdb.org/t/p/w500/${info.backdrop_path}` : null;
                    list.release = list.media_type === 'movie' ? info.release_date : list.media_type === 'tv' ? info.first_air_date : null;
                    list.overview = info.overview || 'No Overview Available';
                }

                list.detailed_info = true;
                list.genres = info.genres? [...info.genres] : null;
                list.status = info.status || null;
                list.vote_average = info.vote_average || null;
                list.providers = info['watch/providers'].results.CA ? info['watch/providers'].results.CA.flatrate || null : null;
                list.providers = list.providers ? {logo_path: `https://image.tmdb.org/t/p/w200/${list.providers[0].logo_path}`, provider_name: list.providers[0].provider_name} : null;
                
                list.credits = [];
                for (let i = 0; i < 3; i++) {
                    list.credits[i] = info.credits.cast[i] ? info.credits.cast[i].name : null;
                }

                list.recommendations = info.recommendations.results.length > 0 ? [info.recommendations.results[0], info.recommendations.results[1], info.recommendations.results[2], info.recommendations.results[3], info.recommendations.results[4], info.recommendations.results[5]] : null;
                if (list.recommendations) {
                    for (let i = 0; i < list.recommendations.length; i++) {
                        if (list.recommendations[i]) {
                            list.recommendations[i] = {
                                backdrop_path: list.recommendations[i].backdrop_path ? `https://image.tmdb.org/t/p/w200/${list.recommendations[i].backdrop_path}` : null,
                                id: list.recommendations[i].id || null,
                                media_type: list.recommendations[i].media_type || null,
                                vote_average: list.recommendations[i].vote_average || null,
                                title: list.recommendations[i].media_type === 'movie' ? list.recommendations[i].title : list.recommendations[i].media_type === 'tv' ? list.recommendations[i].name : null
                            }
                        }
                    }
                }
        
                if (list.media_type === 'movie') {
                    list.runtime = info.runtime;
                    if (info.release_dates.results) {
                        const rating = info.release_dates.results.find(item => item.iso_3166_1 === 'US');
                        list.rating = rating ? rating.release_dates[1] ? rating.release_dates[1].certification : null : null;
                    }
                }
        
                if (list.media_type === 'tv') {
                    const seasons = [];
                    if (info.seasons) {
                        for (let i = 0; i < info.seasons.length; i++) {
                            seasons[i] = {
                                name: info.seasons[i].name || null,
                                id: info.seasons[i].id || null,
                                overview: info.seasons[i].overview || 'No Overview Available',
                                poster_path: info.seasons[i].poster_path ? `https://image.tmdb.org/t/p/w200/${info.seasons[i].poster_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png',
                                season_number: info.seasons[i].season_number || null
                            }
                        }
                    }

                    const seasonsFiltered = seasons ? seasons.filter((season) => season.season_number > 0) : null;
                    list.seasons = seasonsFiltered ? [...seasonsFiltered] : null;

                    const episodes = createEpisodesList(info['season/1']);

                    list.seasons[0].episodes = episodes ? [...episodes] : null; 
                    list.number_of_seasons = info.number_of_seasons || null;
                    list.number_of_episodes = info.number_of_episodes || null;
                    list.rating = info.content_ratings.results ? info.content_ratings.results.find(item => item.iso_3166_1 === 'US') : null;
                    list.rating = list.rating ? list.rating.rating : null;
                    list.last_air_date = info.last_air_date || null;
                    list.networks = info.networks || null;
                    list.next_episode = info.next_episode_to_air || null;
                    }
            }
        }
    } 
    catch (error) {
        throw new Error('addDetailedDataToList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Creates an array of objects with info about folders/files in the passed in directory.
export const getDirectoryData = (directory) => {
    try {
        const directoryList = fs.readdirSync(directory)
        .map((file) => {
            const stats = fs.statSync(path.join(directory, file))
            return {
                directory: {
                    file_name: file.toLowerCase(),
                    is_directory: stats.isDirectory(),
                    path: path.join(directory, file),
                },
                tmdb_data: 'No',
                date_added: Date.now(),
                detailed_info: false,
            }
        });

        const filteredResults = directoryList.filter((directory) => directory.directory.is_directory);
        return filteredResults;
    } 
    catch (error) {
        throw new Error('getDirectoryData Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Creates a new json file called 'MediaList.json' in the specified path with data about the passed in directory.
export const createNewMediaList = async (directory) => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const directoryList = getDirectoryData(directory);
    
        // Loops through the list of media in the specified directory and adds all the necessary data to each object.
        for (let i = 0; i < directoryList.length; i++) {
            await addBasicDataToList(directoryList[i], i);
            await addDetailedDataToList(directoryList[i]);
        }
    
        // Writes the list with the newly added data to the 'MediaList.json' file. Also sets a session storage item to the list.
        fs.writeFileSync(mediaListPath, JSON.stringify(directoryList));
        sessionStorage.setItem('directories', JSON.stringify(directoryList));
        return directoryList;
    }
    catch (error) {
        throw new Error('createNewMediaList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Creates a new list of media with detailed info depending on if a list already exists or not.
// If list already exists, it will add or remove media based on the users directory.
export const getFileDataInDirectory = async (directory) => {
    let directoryList = [];

    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        directoryList = getDirectoryData(directory);

        // Read the 'MediaList.json' file. If there's an error, file doesn't exist and will need to be created.
        // Otherwise create two arrays for the file names in 'MediaList.json' and one for the passed in list.
        const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const mediaListNames = mediaList.map((file) => file.directory.file_name);
        const directoryListNames = directoryList.map((file) => file.directory.file_name);

        // Adds media object from passed in files array to the existing mediaList array if it doesn't already exist there.
        for (let i = 0; i < directoryList.length; i++) {
            if (mediaListNames.indexOf(directoryList[i].directory.file_name) === -1) {
                mediaList.push(directoryList[i]);
            }
        }

        // Removes media object from existing mediaList array if it is no longer in the passed in files array.
        // Then fetches data for any newly added media objects.
        for (let i = 0; i < mediaList.length; i++) {
            if (directoryListNames.indexOf(mediaList[i].directory.file_name) === -1) {
                mediaList.splice(i, 1);
            }
            await addBasicDataToList(mediaList[i], i);
            await addDetailedDataToList(mediaList[i]);
        }

        // Replaces the existing media list in 'MediaList.json' with newly created one. As well as updates the session storage item.
        fs.writeFileSync(mediaListPath, JSON.stringify(mediaList));
        sessionStorage.setItem('directories', JSON.stringify(mediaList));
        return mediaList;
    } 
    catch (error) {   
        if (!directoryList) {
            throw new Error('getFileDataInDirectory Error: ' + error);
        }
        // If readFileSync fails, it means the 'MediaList.json' doesn't exist, in which case it needs to be created via 'createNewMediaList'. Then returns that list.
        if (error.code === 'ENOENT') {
            const newList = await createNewMediaList(directory);
            return newList;
        }

        throw new Error('getFileDataInDirectory Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Returns the media object found in 'MediaList.json' based on the passed in id.
export const getMediaObjectFromList = (id) => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const mediaObject = mediaList.find((file) => file.id === Number(id));
    
        if (!mediaObject) {
            console.log('No File Found.');
            return null;
        }
    
        return mediaObject;
    } 
    catch (error) {
        throw new Error('getMediaObjectFromList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Returns an array of media objects sorted in various ways.
export const sortList = (directory, method) => {
    try {
        let sortedList = directory;

        if (method === 'popular') {
            sortedList.sort((a, b) => b.popularity - a.popularity);
        }
        else if (method === 'new') {
            sortedList.sort((a, b) => b.date_added - a.date_added);
        }
    
        sortedList = [...sortedList];
    
        return sortedList;
    }
    catch (error) {
        throw new Error('sortList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Saves new info to the specified object in the directory list based on the index.
// If used to replace an entire object, it will use the passed in id to determine what object to replace since id's will be different.
export const saveNewDirectoryItemInfo = (directoryItem, directories, id = null) => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const index = directories.findIndex(element => element.id === directoryItem.id);
        if (index !== -1 && !id) {
            directories[index] = directoryItem;
            fs.writeFileSync(mediaListPath, JSON.stringify(directories));
            sessionStorage.setItem('directories', JSON.stringify(directories));
        }
        else if (index === -1 && id) {
            const index = directories.findIndex(element => element.id === id);
            if (index !== -1) {
                directories[index] = directoryItem;
                fs.writeFileSync(mediaListPath, JSON.stringify(directories));
                sessionStorage.setItem('directories', JSON.stringify(directories));
            }
        }
    } 
    catch (error) {
        throw new Error('saveNewDirectoryItemInfo Error: ' + error);
    }
};

//===================================================================================================================================================================//
