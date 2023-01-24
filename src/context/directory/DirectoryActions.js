import {ipcRenderer} from 'electron';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const tmdbApiKey = process.env.TMDB_KEY;

ipcRenderer.invoke('getPath').then((result) => {
    const mediaListPath = path.join(result, 'MediaList' + '.json');

    if(mediaListPath) {
        sessionStorage.setItem('mediaListPath', mediaListPath);
    }
})
.catch((err) => {
    console.log(err);
});

ipcRenderer.on('settings:get', (event, settings) => {
    const savedDirectory = settings.directoryPath;

    if(savedDirectory) {
        sessionStorage.setItem('savedDirectory', savedDirectory);
    }
});

//===================================================================================================================================================================//

// Fetches Tmdb API for a movie or tv show that matches the passed in title and returns an array of 20 objects, each with basic info.
export const getTmdbData = async (title) => {

    const encodedTitle = encodeURIComponent(title);
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&language=en-US&query=${encodedTitle}&page=1`);

    if(!response) {
      console.log('No Response');
      return null;
    }

    const {results} = await response.json();
    return results;
};

//===================================================================================================================================================================//

// Fetches basic info and adds it to array for each file in the directory that doesn't already have it.
export const addTmdbData = async (list, index) => {

    if(list.tmdb_data === 'No') {
        let data = await getTmdbData(list.file_name);
        data = data[0];

        if(data) {
            list.tmdb_data = 'Yes';
            list.media_type = data.media_type;
            list.title = data.media_type === 'movie' ? data.title : data.media_type === 'tv' ? data.name : "No Title Found";
            list.id = data.id ? data.id : index;
            list.poster_path = data.poster_path;
            list.backdrop_path = data.backdrop_path;
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
};

//===================================================================================================================================================================//

// Fetches and returns more detailed info for a single movie or tv show based on passed in media type and media id.
export const getDetailedTmdbData = async (mediaType, id) => {

    let response;

    if(mediaType === 'tv') {
        response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbApiKey}&append_to_response=credits,recommendations,content_ratings,watch/providers`);
    }
    else if (mediaType === 'movie') {
        response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&append_to_response=credits,recommendations,release_dates,watch/providers`);
    }

    if(!response) {
        console.log('No Response');
        return null;
    }

    const jsonResponse = await response.json();
    return jsonResponse;
};

//===================================================================================================================================================================//

// Fetches detailed info and adds it to array for each file in the directory that doesn't already have it.
export const addDetailedTmdbData = async (list) => {

    if(list.tmdb_data === 'Yes' && !list.detailed_info) {
        if(list.media_type === 'movie' || list.media_type === 'tv') {
            try {
                const info = await getDetailedTmdbData(list.media_type, list.id);

                list.detailed_info = true;
                list.genres = info.genres? [...info.genres] : null;
                list.runtime = list.media_type === 'movie' ? info.runtime : list.media_type === 'tv' ? info.episode_run_time[0] : null;
                list.status = info.status ? info.status : null;
                list.credits = info.credits.cast ? [info.credits.cast[0], info.credits.cast[1], info.credits.cast[2]] : null;
                list.recommendations = info.recommendations ? [info.recommendations.results[0], info.recommendations.results[1], info.recommendations.results[2], info.recommendations.results[3], info.recommendations.results[4]] : null;
                list.vote_average = info.vote_average ? info.vote_average : null;
                list.providers = info["watch/providers"].results ? info["watch/providers"].results.CA.flatrate : null;


                if(list.media_type === 'movie') {
                    list.rating = info.release_dates.results ? info.release_dates.results.find(item => item.iso_3166_1 === "US") : null;
                }

                if(list.media_type === 'tv') {
                    list.seasons = info.seasons ? [...info.seasons] : null;
                    list.number_of_seasons = info.number_of_seasons ? info.number_of_seasons : null;
                    list.number_of_episodes = info.number_of_episodes ? info.number_of_episodes : null;
                    list.rating = info.content_ratings.results ? info.content_ratings.results.find(item => item.iso_3166_1 === "US") : null;
                    list.last_air_date = info.last_air_date ? info.last_air_date : null;
                    list.networks = info.networks ? info.networks : null;
                    list.next_episode = info.next_episode_to_air ? info.next_episode_to_air : null;
                }
            } catch (error) {
                console.log('getDetailedTmdbData Error: ' + error);
            }
        }
    }
};

//===================================================================================================================================================================//

// Creates an array of objects with info about folders/files in the passed in directory.
export const createDirectoryList = (directory) => {

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

    } catch (error) {
        console.log("createDirectoryList Error: " + error);
        return null;
    }
};

//===================================================================================================================================================================//

export const createNewMediaList = async (directory) => {
    
    const mediaListPath = sessionStorage.getItem('mediaListPath');
    const directoryList = createDirectoryList(directory);

    for(let i = 0; i < directoryList.length; i++) {
        await addTmdbData(directoryList[i], i);
        await addDetailedTmdbData(directoryList[i]);
    }

    fs.writeFileSync(mediaListPath, JSON.stringify(directoryList));
    sessionStorage.setItem('directories', JSON.stringify(directoryList));
    return directoryList;
};

//===================================================================================================================================================================//

// Creates a new list of media with detailed info depending on if a list already exists or not.
// If list already exists, it will add or remove media based on the current users directory.
export const getDirectoryFiles = async (directory) => {

    const mediaListPath = sessionStorage.getItem('mediaListPath');
    const directoryList = createDirectoryList(directory);

    try {
        let mediaList = JSON.parse(fs.readFileSync(mediaListPath));
        const mediaListNames = mediaList.map((file) => file.file_name);
        const directoryListNames = directoryList.map((file) => file.file_name);

        // Adds media object from local files array to the existing mediaList array if it doesn't already exist.
        for(let i = 0; i < directoryList.length; i++) {
            if(mediaListNames.indexOf(directoryList[i].file_name) === -1) {
                mediaList.push(directoryList[i]);
            }
        }

        // Removes media object from existing mediaList array if it is no longer in the new local files array.
        for(let i = 0; i < mediaList.length; i++) {
            if(directoryListNames.indexOf(mediaList[i].file_name) === -1) {
                mediaList.splice(i, 1);
            }
            await addTmdbData(mediaList[i], i);
            await addDetailedTmdbData(mediaList[i]);
        }

        fs.writeFileSync(mediaListPath, JSON.stringify(mediaList));
        sessionStorage.setItem('directories', JSON.stringify(mediaList));
        return mediaList;
    } 
    catch (error) {   
        const newList = await createNewMediaList(directory);
        return newList;
    }
};

//===================================================================================================================================================================//

// Returns the media object that is found in the media list based on the passed in id.
export const getMediaObject = (id) => {

    const mediaListPath = sessionStorage.getItem('mediaListPath');
    const mediaList = JSON.parse(fs.readFileSync(mediaListPath));
    const mediaObject = mediaList.find((file) => file.id === Number(id));

    if(!mediaObject) {
        console.log('No File Found.');
        return null;
    }

    return mediaObject;
};

//===================================================================================================================================================================//

// Returns an array of media objects sorted in various ways.
export const sortList = (directory, method) => {

    let sortedList = Object.values(directory);

    if(method === 'popular') {
        sortedList.sort((a, b) => b.popularity - a.popularity);
    }
    else if(method === 'new') {
        sortedList.sort((a, b) => b.date_added - a.date_added);
    }

    sortedList = {...sortedList};

    return sortedList;
};

//===================================================================================================================================================================//