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
export const getTimeDifference = (date, timeLength) => {
    try {
        const todaysDate = Date.now();

        if (timeLength === 'month') {
            const monthInMillis = 2629746000;
            return todaysDate - date >= monthInMillis;
        }
        else if (timeLength === 'week') {
            const weekInMillis = 604800000;
            return todaysDate - date >= weekInMillis;
        }
        else {
            return null;
        }
    } 
    catch (error) {
        console.log('getTimeDifference Error: ' + error);
        return null;
    }
};

//===================================================================================================================================================================//

// Converts a number of minutes into hours and remaining minutes.
export const minutesToHours = (totalMinutes) => {
    try {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
    
        if (hours === 0) {
            return `${minutes}min`;
        }
        else {
            return`${hours}hr ${minutes}min`;
        }
    } 
    catch (error) {
        console.log('minutesToHours Error: ' + error);
        return null;
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
        console.log('dateNumbersToWords Error: ' + error.message);
        return null;
    }
};

//===================================================================================================================================================================//


export const addEpisodesInDirectoryToList = (directory, directories) => {
    try {
        let needSave = false;
        console.log(directory);
        console.log(directories);
        const regex = /\d+/; // regex for getting the first group of digits in a string.
        const index = directories.findIndex(element => element.seasons[directory.season_number - 1].directory.file_name === directory.directory.file_name);
        const episodesInDirectory = fs.readdirSync(directory.directory.path)
        .map((file) => {
            return {
                file_name: file.toLowerCase(),
                path: path.join(directory.directory.path, file),
                episode_number: file.match(regex)[0]
            }
        });

        for (let i = 0; i < directory.episodes.length; i++) {
            for (let j = 0; j < episodesInDirectory.length; j++) {
                if (directory.episodes[i].episode_number === Number(episodesInDirectory[j].episode_number)) {
                    if (!directory.episodes[i].directory){
                        needSave = true;
                        directory.episodes[i].directory = {...episodesInDirectory[j]};
                    }
                }
            }

            // Checks if a season directory object exists in json file but has been deleted in directory and if so, deletes that object property.
            const index = episodesInDirectory.findIndex(element => Number(element.episode_number) === directory.episodes[i].episode_number);
            if (index === -1 && directory.episodes[i].hasOwnProperty('directory')) {
                needSave = true;
                delete directory.episodes[i].directory;
            }
        }

        if (needSave) {
            const mediaListPath = sessionStorage.getItem('mediaListPath');

            if(index !== -1) {
                directories[index].seasons[directory.season_number - 1] = directory;
            }

            fs.writeFileSync(mediaListPath, JSON.stringify(directories));
            sessionStorage.setItem('directories', JSON.stringify(directories));
        }

        return directories[index].seasons[directory.season_number - 1].episodes;
    } 
    catch (error) {
        console.log('addEpisodesInDirectoryToList Error: ' + error);
        return null;
    }
};


// Compares all seasons of a tv show to the seasons stored in the directory.
// If a season is in the directory, create an object with the file name and path and add it to the directory json file.
export const addSeasonsInDirectoryToList = (directory, directories) => {
    try {
        let needSave = false;
        const regex = /\d+/; // regex for getting the first group of digits in a string.
        const seasonsInDirectory = fs.readdirSync(directory.path)
        .map((file) => {
            return {
                file_name: file.toLowerCase(),
                path: path.join(directory.path, file),
                season_number: file.match(regex)[0]
            }
        });

        for (let i = 0; i < directory.seasons.length; i++) {
            for (let j = 0; j < seasonsInDirectory.length; j++) {
                if (directory.seasons[i].season_number === Number(seasonsInDirectory[j].season_number)) {
                    if (!directory.seasons[i].directory){
                        needSave = true;
                        directory.seasons[i].directory = {...seasonsInDirectory[j]};
                    }
                }
            }

            // Checks if a season directory object exists in json file but has been deleted in directory and if so, deletes that object property.
            const index = seasonsInDirectory.findIndex(element => Number(element.season_number) === directory.seasons[i].season_number);
            if (index === -1 && directory.seasons[i].hasOwnProperty('directory')) {
                needSave = true;
                delete directory.seasons[i].directory;
            }
        }

        if (needSave) {
            const mediaListPath = sessionStorage.getItem('mediaListPath');
            const index = directories.findIndex(element => element.file_name === directory.file_name);

            if(index !== -1) {
                directories[index] = directory;
            }

            fs.writeFileSync(mediaListPath, JSON.stringify(directories));
            sessionStorage.setItem('directories', JSON.stringify(directories));
        }

        return directories;
    } 
    catch (error) {
        console.log('addSeasonsInDirectoryToList Error: ' + error);
        return null;
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
                    air_date: seasonObject.episodes[i].air_date,
                    episode_number: seasonObject.episodes[i].episode_number,
                    name: seasonObject.episodes[i].name,
                    overview: seasonObject.episodes[i].overview,
                    runtime: seasonObject.episodes[i].runtime,
                    still_path: seasonObject.episodes[i].still_path,
                    vote_average: seasonObject.episodes[i].vote_average
                }
            }
        }
        return episodes;
    } 
    catch (error) {
        console.log('createEpisodesList Error: ' + error);
        return null;
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
        console.log('fetchEpisodesData Error: ' + error);
        return null;
    }
};

//===================================================================================================================================================================//

// Fetches data for episodes and adds the created episodes array to the directory list based on the passed in season.
// Also fetches for new episode data once every month based on when the last episodes array was added to the directory list.
export const addEpisodesToList = async (season, directoryItem, directoryList) => {
    try {
        const hasEpisodes = directoryItem.seasons[Number(season) - 1].hasOwnProperty('episodes');

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
    } 
    catch (error) {
        console.log('addEpisodesToList Error: ' + error);
        return null;
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
        console.log('fetchBasicData Error: ' + error);
        return null;
    }
};

//===================================================================================================================================================================//

// Fetches basic info and adds it to array for each file in the directory that doesn't already have it.
export const addBasicDataToList = async (list, index) => {
    try {
        if (list.tmdb_data === 'No') {
            let data = await fetchBasicData(list.file_name);
            data = data[0];
    
            if (data) {
                list.tmdb_data = 'Yes';
                list.media_type = data.media_type ? data.media_type : null;
                list.title = data.media_type === 'movie' ? data.title : data.media_type === 'tv' ? data.name : "No Title Found";
                list.id = data.id ? data.id : index;
                list.poster_path = data.poster_path ? data.poster_path : null;
                list.backdrop_path = data.backdrop_path ? data.backdrop_path : null;
                list.release = data.media_type === 'movie' ? data.release_date : data.media_type === 'tv' ? data.first_air_date : null;
                list.overview = data.overview ? data.overview : null;
                list.popularity = data.popularity ? data.popularity : null;
            }
            else {
                list.tmdb_data = 'No Data';
                list.media_type = null;
                list.title = list.file_name ? list.file_name : 'No Title Found';
                list.id = index;
                list.poster_path = null;
                list.backdrop_path = null;
                list.release = null;
                list.overview = null;
                list.popularity = null;
            }
        }
    }
    catch (error) {
        console.log('addBasicDataToList Error: ' + error);
        return null;
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
        console.log('fetchDetailedData Error: ' + error);
        return null;
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
                    list.title = list.media_type === 'movie' ? info.title : list.media_type === 'tv' ? info.name : "No Title Found";
                    list.backdrop_path = info.backdrop_path ? info.backdrop_path : null;
                    list.release = list.media_type === 'movie' ? info.release_date : list.media_type === 'tv' ? info.first_air_date : null;
                    list.overview = info.overview ? info.overview : null;
                }

                list.detailed_info = true;
                list.genres = info.genres? [...info.genres] : null;
                list.status = info.status ? info.status : null;
                list.vote_average = info.vote_average ? info.vote_average : null;
                list.providers = info["watch/providers"].results.CA ? info["watch/providers"].results.CA.flatrate : null;
                list.providers = list.providers ? {logo_path: list.providers[0].logo_path, provider_name: list.providers[0].provider_name} : null;
                
                list.credits = [];
                for (let i = 0; i < 3; i++) {
                    list.credits[i] = info.credits.cast[i] ? info.credits.cast[i].name : null;
                }

                list.recommendations = info.recommendations.results.length > 0 ? [info.recommendations.results[0], info.recommendations.results[1], info.recommendations.results[2], info.recommendations.results[3], info.recommendations.results[4], info.recommendations.results[5]] : null;
                if (list.recommendations) {
                    for (let i = 0; i < list.recommendations.length; i++) {
                        if (list.recommendations[i]) {
                            list.recommendations[i] = {
                                backdrop_path: list.recommendations[i].backdrop_path ? list.recommendations[i].backdrop_path : null,
                                id: list.recommendations[i].id ? list.recommendations[i].id : null,
                                media_type: list.recommendations[i].media_type ? list.recommendations[i].media_type : null,
                                vote_average: list.recommendations[i].vote_average ? list.recommendations[i].vote_average : null,
                                title: list.recommendations[i].media_type === 'movie' ? list.recommendations[i].title : list.recommendations[i].media_type === 'tv' ? list.recommendations[i].name : null
                            }
                        }
                    }
                }
        
                if (list.media_type === 'movie') {
                    list.runtime = info.runtime;
                    if (info.release_dates.results) {
                        const rating = info.release_dates.results.find(item => item.iso_3166_1 === "US");
                        list.rating = rating ? rating.release_dates[1] ? rating.release_dates[1].certification : null : null;
                    }
                }
        
                if (list.media_type === 'tv') {
                    const seasons = [];
                    if (info.seasons) {
                        for (let i = 0; i < info.seasons.length; i++) {
                            seasons[i] = {
                                name: info.seasons[i].name,
                                id: info.seasons[i].id,
                                overview: info.seasons[i].overview,
                                poster_path: info.seasons[i].poster_path,
                                season_number: info.seasons[i].season_number
                            }
                        }
                    }

                    const seasonsFiltered = seasons ? seasons.filter((season) => season.season_number > 0) : null;
                    list.seasons = seasonsFiltered ? [...seasonsFiltered] : null;

                    const episodes = createEpisodesList(info['season/1']);

                    list.seasons[0].episodes = episodes ? [...episodes] : null; 
                    list.number_of_seasons = info.number_of_seasons ? info.number_of_seasons : null;
                    list.number_of_episodes = info.number_of_episodes ? info.number_of_episodes : null;
                    list.rating = info.content_ratings.results ? info.content_ratings.results.find(item => item.iso_3166_1 === "US") : null;
                    list.rating = list.rating ? list.rating.rating : null;
                    list.last_air_date = info.last_air_date ? info.last_air_date : null;
                    list.networks = info.networks ? info.networks : null;
                    list.next_episode = info.next_episode_to_air ? info.next_episode_to_air : null;
                    }
            }
        }
    } 
    catch (error) {
        console.log('addDetailedDataToList Error: ' + error);
        return null;
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
                file_name: file.toLowerCase(),
                is_directory: stats.isDirectory(),
                path: path.join(directory, file),
                tmdb_data: 'No',
                date_added: Date.now(),
                detailed_info: false,
            }
        });
        return directoryList;

    } 
    catch (error) {
        console.log("getDirectoryData Error: " + error);
        return null;
    }
};

//===================================================================================================================================================================//

// Creates a new json file in the specified path with data about the passed in directory.
export const createNewMediaList = async (directory) => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const directoryList = getDirectoryData(directory);
    
        for (let i = 0; i < directoryList.length; i++) {
            await addBasicDataToList(directoryList[i], i);
            await addDetailedDataToList(directoryList[i]);
        }
    
        fs.writeFileSync(mediaListPath, JSON.stringify(directoryList));
        sessionStorage.setItem('directories', JSON.stringify(directoryList));
        return directoryList;
    }
    catch (error) {
        console.log("createNewMediaList Error: " + error);
        return null;
    }
};

//===================================================================================================================================================================//

// Creates a new list of media with detailed info depending on if a list already exists or not.
// If list already exists, it will add or remove media based on the current users directory.
export const getFileDataInDirectory = async (directory) => {
    try {
        const mediaListPath = sessionStorage.getItem('mediaListPath');
        const directoryList = getDirectoryData(directory);
        let mediaList = JSON.parse(fs.readFileSync(mediaListPath));

        const mediaListNames = mediaList.map((file) => file.file_name);
        const directoryListNames = directoryList.map((file) => file.file_name);

        // Adds media object from local files array to the existing mediaList array if it doesn't already exist.
        for (let i = 0; i < directoryList.length; i++) {
            if (mediaListNames.indexOf(directoryList[i].file_name) === -1) {
                mediaList.push(directoryList[i]);
            }
        }

        // Removes media object from existing mediaList array if it is no longer in the new local files array.
        // Then fetches data for any newly added media objects.
        for (let i = 0; i < mediaList.length; i++) {
            if (directoryListNames.indexOf(mediaList[i].file_name) === -1) {
                mediaList.splice(i, 1);
            }
            await addBasicDataToList(mediaList[i], i);
            await addDetailedDataToList(mediaList[i]);
        }

        fs.writeFileSync(mediaListPath, JSON.stringify(mediaList));
        sessionStorage.setItem('directories', JSON.stringify(mediaList));
        return mediaList;
    } 
    catch (error) {   
        console.log("getFileDataInDirectory Error: " + error);
        const newList = await createNewMediaList(directory);
        return newList;
    }
};

//===================================================================================================================================================================//

// Returns the media object that is found in the media list based on the passed in id.
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
        console.log("getMediaObjectFromList Error: " + error);
        return null;
    }
};

//===================================================================================================================================================================//

// Returns an array of media objects sorted in various ways.
export const sortList = (directory, method) => {
    try {
        let sortedList = Object.values(directory);

        if (method === 'popular') {
            sortedList.sort((a, b) => b.popularity - a.popularity);
        }
        else if (method === 'new') {
            sortedList.sort((a, b) => b.date_added - a.date_added);
        }
    
        sortedList = {...sortedList};
    
        return sortedList;
    }
    catch (error) {
        console.log("sortList Error: " + error);
        return null;
    }
};

//===================================================================================================================================================================//

export const getEpisodesInDirectory = (directory) => {
    try {
        const episodesList = fs.readdirSync(directory)
        .map((episode) => {
            return {
                file_name: episode.toLowerCase(),
                path: path.join(directory, episode),
                date_added: Date.now(),
                tmdb_data: 'No',
            }
        })
        return episodesList;
    } 
    catch (error) {
        console.log('getEpisodesInDirectory Error: ' + error);
        return null;
    }
};