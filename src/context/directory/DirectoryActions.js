import {ipcRenderer} from 'electron';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
const util = require('util');

dotenv.config();

const tmdbApiKey = process.env.TMDB_KEY;

ipcRenderer.invoke('getPath').then((result) => {
    const mediaListPath = path.join(result, 'MediaList' + '.json');
    const watchListPath = path.join(result, 'WatchList' + '.json');

    if (mediaListPath) {
        sessionStorage.setItem('mediaListPath', mediaListPath);
    }
    if (watchListPath) {
        sessionStorage.setItem('watchListPath', watchListPath);
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

export const getDateDifference = (date) => {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds.
    const newDate = new Date(date.replace(/-/g, '\/'));
    const todaysDate = new Date(Date.now());
    todaysDate.setHours(0,0,0,0);
    const diffInDays = Math.round(Math.abs((newDate - todaysDate) / oneDay));
    return diffInDays;
};

//===================================================================================================================================================================//

export const isDateInPast = (date) => {
    const newDate = new Date(date.replace(/-/g, '\/'));
    const todaysDate = new Date(Date.now());
    todaysDate.setHours(0,0,0,0);
    return newDate < todaysDate;
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
        return `${months[month - 1]} ${date.substring(8,10)}, ${date.substring(0,4)}`; 
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
        const index = directories.findIndex(element => element.id === Number(id) && element.media_type === 'tv');
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
        const index = directories.findIndex(element => element.id === Number(id) && element.media_type === 'tv');
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
                    still_path: seasonObject.episodes[i].still_path ? `https://image.tmdb.org/t/p/w500/${seasonObject.episodes[i].still_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png',
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
                const index = directoryList.findIndex(element => element.id === directoryItem.id && element.media_type === 'tv');
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
        const filteredResults = results.filter((result) => result.media_type !== 'person');
        return filteredResults;
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
                list.id = data.id || index;
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
        if ((list.tmdb_data === 'Yes' && !list.detailed_info) || list.searchedItem || !list.checked_episode) {
            if (list.media_type === 'movie' || list.media_type === 'tv') {
                const info = await fetchDetailedData(list.media_type, list.id);
                list.title = list.media_type === 'movie' ? info.title : list.media_type === 'tv' ? info.name : 'No Title Available';
                list.poster_path = info.poster_path ? `https://image.tmdb.org/t/p/w500/${info.poster_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png';
                list.backdrop_path = info.backdrop_path ? `https://image.tmdb.org/t/p/original/${info.backdrop_path}` : null;
                list.release = list.media_type === 'movie' ? info.release_date : list.media_type === 'tv' ? info.first_air_date : null;
                list.overview = info.overview || 'No Overview Available';
                list.popularity = info.popularity || null;

                list.checked_episode = true;
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
                                poster_path: list.recommendations[i].poster_path ? `https://image.tmdb.org/t/p/w500/${list.recommendations[i].poster_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png',
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
                    list.release = info.release_date || null;
                    if (info.release_dates.results) {
                        info.release_dates.results.find(item => {
                            if (item.iso_3166_1 === 'US') {
                                const release = item.release_dates[0] ? item.release_dates[0].release_date : item.release_dates[1] ? item.release_dates[1].release_date : null;
                                list.release = release ? release.split('T')[0] : null;
                                list.rating = item.release_dates[0] ? item.release_dates[0].certification : item.release_dates[1] ? item.release_dates[1].certification : null;  
                            }
                        });
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

                    list.release = info.first_air_date || null;
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
                custom_data : {}
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
export const getMediaObjectFromList = (id, mediaType) => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const mediaObject = mediaList.find((file) => file.id === Number(id) && file.media_type === mediaType);
    
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
        let filteredList = [];

        if (method === 'topRated') {
            sortedList.sort((a, b) => b.vote_average - a.vote_average);
            sortedList = [...sortedList];
        }
        else if (method === 'new') {
            sortedList.sort((a, b) => b.date_added - a.date_added);
            sortedList = [...sortedList];
        }
        else if (method === 'tv') {
            filteredList = sortedList.filter((item) => item.media_type === 'tv');
            filteredList.sort((a, b) => b.vote_average - a.vote_average);
            sortedList = [...filteredList];
        }
        else if (method === 'movie') {
            filteredList = sortedList.filter((item) => item.media_type === 'movie');
            filteredList.sort((a, b) => b.vote_average - a.vote_average);
            sortedList = [...filteredList];
        }
        else if (method === 'alphabetically') {
            sortedList.sort((a, b) => b.title > a.title);
            sortedList = [...sortedList];
        }

        if (sortedList.length > 30) {
            let lessResults = [];

            for (let i = 0; i < 30; i++) {
                lessResults.push(sortedList[i]);
            }
            return lessResults;
        }
    
        return sortedList;
    }
    catch (error) {
        throw new Error('sortList Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Saves new info to the specified object in the directory list based on the index.
// If used to replace an entire object, it will use the passed in id to determine what object to replace since id's will be different.
export const saveNewDirectoryItemInfo = (directoryItem, directories, mediaType = null, id = null) => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const index = directories.findIndex(element => element.id === directoryItem.id && element.media_type === directoryItem.media_type);
        if (index !== -1 && !id) {
            directories[index] = directoryItem;
            fs.writeFileSync(mediaListPath, JSON.stringify(directories));
            sessionStorage.setItem('directories', JSON.stringify(directories));
            return true;
        }
        else if (index === -1 && id) {
            const index = directories.findIndex(element => element.id === id && element.media_type === mediaType);
            if (index !== -1) {
                directories[index] = directoryItem;
                fs.writeFileSync(mediaListPath, JSON.stringify(directories));
                sessionStorage.setItem('directories', JSON.stringify(directories));
                return true;
            }
        }

        return false;
    } 
    catch (error) {
        throw new Error('saveNewDirectoryItemInfo Error: ' + error);
    }
};

//===================================================================================================================================================================//

// Fetches the top 10 trending movies/series on TMDB.
export const fetchTrendingMedia = async () => {
    try {
        if (sessionStorage.getItem('trending')) {
            return JSON.parse(sessionStorage.getItem('trending'));
        }

        const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${tmdbApiKey}`);
    
        if (!response) {
            console.log('No Response');
            return null;
        }

        const {results} = await response.json();
        let lessResults = [];

        for (let i = 0; i < 10; i++) {
            lessResults.push(results[i]);
        }
        sessionStorage.setItem('trending', JSON.stringify(lessResults));
        return lessResults;
    } 
    catch (error) {
        throw new Error('fetchTrendingMedia Error: ' + error);
    }
};

//===================================================================================================================================================================//

export const checkForNewEpisodes = async () => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const watchListPath = sessionStorage.getItem('watchListPath');
        if (!mediaListPath && !watchListPath) {
            return null;
        }

        if (sessionStorage.getItem('checkedEpisodes')) {
            return null;
        }

        const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const watchList = JSON.parse(fs.readFileSync(watchListPath));
        const filteredList = mediaList.filter((media) => media.media_type === 'tv' && media.status === 'Returning Series');
        const filteredWatchList = watchList.filter((media) => media.media_type === 'tv' && media.status === 'Returning Series');

        for (let i = 0; i < filteredList.length; i++) {
            const index = mediaList.findIndex(element => element.id === filteredList[i].id && element.media_type === filteredList[i].media_type);
            if (index !== -1) {
                mediaList[index].checked_episode = false;
                await addDetailedDataToList(mediaList[index]);
            }
        }
        for (let i = 0; i < filteredWatchList.length; i++) {
            const index = watchList.findIndex(element => element.id === filteredWatchList[i].id && element.media_type === filteredWatchList[i].media_type);
            if (index !== -1) {
                watchList[index].checked_episode = false;
                await addDetailedDataToList(watchList[index]);
            }
        }
        
        fs.writeFileSync(mediaListPath, JSON.stringify(mediaList));
        fs.writeFileSync(watchListPath, JSON.stringify(watchList));
        sessionStorage.setItem('directories', JSON.stringify(mediaList));
        sessionStorage.setItem('watchlist', JSON.stringify(watchList));
        sessionStorage.setItem('checkedEpisodes', true);
    } 
    catch (error) {
        throw new Error('checkForNewEpisodes Error: ' + error);
    }
};

//===================================================================================================================================================================//

export const filterNewEpisodes = () => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const watchListPath = sessionStorage.getItem('watchListPath');
        if (!mediaListPath && !watchListPath) {
            return null;
        }
    
        const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const watchList = JSON.parse(fs.readFileSync(watchListPath));

        const filteredList = mediaList.filter((media) => {
            if (media.media_type === 'tv' && media.next_episode !== null) {
                return !isDateInPast(media.next_episode.air_date) && getDateDifference(media.next_episode.air_date) <= 7;
            }
        });
        const filteredWatchList = watchList.filter((media) => {
            if (media.media_type === 'tv' && media.next_episode !== null) {
                return !isDateInPast(media.next_episode.air_date) && getDateDifference(media.next_episode.air_date) <= 7;
            }
        });
        
        const newEpisodesList = [...filteredList, ...filteredWatchList];
        const newEpisodesListFiltered = newEpisodesList.filter((episode, index, self) => {
            return index === self.findIndex((episode2) => episode2.id === episode.id);
        });

        return newEpisodesListFiltered;
    } 
    catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw new Error('filterNewEpisodes Error: ' + error);
    }
};

//===================================================================================================================================================================//

export const filterNewMovies = () => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const watchListPath = sessionStorage.getItem('watchListPath');
        if (!mediaListPath && !watchListPath) {
            return null;
        }
    
        const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const watchList = JSON.parse(fs.readFileSync(watchListPath));

        const filteredList = mediaList.filter((media) => {
            if (media.media_type === 'movie') {
                return !isDateInPast(media.release) && getDateDifference(media.release) <= 7;
            }
        });
        const filteredWatchList = watchList.filter((media) => {
            if (media.media_type === 'movie') {
                return !isDateInPast(media.release) && getDateDifference(media.release) <= 7;
            }
        });

        const newMoviesList = [...filteredList, ...filteredWatchList];
        const newMoviesListFiltered = newMoviesList.filter((movie, index, self) => {
            return index === self.findIndex((movie2) => movie2.id === movie.id);
        });

        return newMoviesListFiltered;
    } 
    catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw new Error('filterNewMovies Error: ' + error);
    }
};

//===================================================================================================================================================================//

export const areThereNewEpisodesToday = () => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const watchListPath = sessionStorage.getItem('watchListPath');
        if (!mediaListPath && !watchListPath) {
            return null;
        }
    
        const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const watchList = JSON.parse(fs.readFileSync(watchListPath));

        const filteredList = mediaList.filter((media) => {
            if (media.media_type === 'tv' && media.next_episode !== null) {
                return !isDateInPast(media.next_episode.air_date) && getDateDifference(media.next_episode.air_date) === 0;
            }
        });
        const filteredWatchList = watchList.filter((media) => {
            if (media.media_type === 'tv' && media.next_episode !== null) {
                return !isDateInPast(media.next_episode.air_date) && getDateDifference(media.next_episode.air_date) === 0;
            }
        });

        const newEpisodesList = [...filteredList, ...filteredWatchList];
        if (newEpisodesList.length > 0) {
            return true;
        }

        return false;
    } 
    catch (error) {
        throw new Error('filterNewMediaToday Error: ' + error);
    }
};

//===================================================================================================================================================================//

export const areThereNewMoviesToday = () => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const watchListPath = sessionStorage.getItem('watchListPath');
        if (!mediaListPath && !watchListPath) {
            return null;
        }
    
        const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const watchList = JSON.parse(fs.readFileSync(watchListPath));

        const filteredList = mediaList.filter((media) => {
            if (media.media_type === 'movie') {
                return !isDateInPast(media.release) && getDateDifference(media.release) === 0;
            }
        });
        const filteredWatchList = watchList.filter((media) => {
            if (media.media_type === 'movie') {
                return !isDateInPast(media.release) && getDateDifference(media.release) === 0;
            }
        });

        const newMoviesList = [...filteredList, ...filteredWatchList];
        if (newMoviesList.length > 0) {
            return true;
        }

        return false;
    } 
    catch (error) {
        throw new Error('filterNewMediaToday Error: ' + error);
    }
};

//===================================================================================================================================================================//

export const getWatchList = () => {
    try {
        const watchListPath = sessionStorage.getItem('watchListPath');
        if (!watchListPath) {
            return null;
        }
    
        const watchList = JSON.parse(fs.readFileSync(watchListPath));
        sessionStorage.setItem('watchlist', JSON.stringify(watchList));
        return watchList;
    } 
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw new Error('getWatchList Error: ' + error);
    }
}

//===================================================================================================================================================================//

export const addToWatchList = (mediaItem) => {
    try {
        const watchListPath = sessionStorage.getItem('watchListPath');
        if (!watchListPath) {
            return null;
        }
    
        const watchList = JSON.parse(fs.readFileSync(watchListPath));

        if (Object.keys(mediaItem).length === 0) {
            return null;
        }

        watchList.push(mediaItem);
        fs.writeFileSync(watchListPath, JSON.stringify(watchList));
        sessionStorage.setItem('watchlist', JSON.stringify(watchList));
        return watchList;
    } 
    catch (error) {
        if (error.code === 'ENOENT') {
            const watchListPath = sessionStorage.getItem('watchListPath');
            const newList = [mediaItem];
            fs.writeFileSync(watchListPath, JSON.stringify(newList));
            sessionStorage.setItem('watchlist', JSON.stringify(newList));
            return newList;
        }

        throw new Error('addToWatchList Error: ' + error);
    }
};

//===================================================================================================================================================================//

export const removeFromWatchList = (mediaItem) => {
    try {
        const watchListPath = sessionStorage.getItem('watchListPath');
        if (!watchListPath) {
            return null;
        }
    
        const watchList = JSON.parse(fs.readFileSync(watchListPath));

        if (Object.keys(mediaItem).length === 0) {
            return null;
        } 

        const index = watchList.findIndex((file) => Number(file.id) === Number(mediaItem.id) && file.media_type === mediaItem.media_type);
        if (index !== -1) {
            watchList.splice(index, 1);
            fs.writeFileSync(watchListPath, JSON.stringify(watchList));
            sessionStorage.setItem('watchlist', JSON.stringify(watchList));
            return watchList;
        }
    } 
    catch (error) {
        throw new Error('removeFromWatchList Error: ' + error);
    }
};

//===================================================================================================================================================================//

