import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addDetailedDataToList, saveNewDirectoryItemInfo } from '../context/directory/DirectoryActions';

const SearchCard = ({result, directoryItem, onClose}) => {

    const navigate = useNavigate();
    const {directories, dispatch} = useContext(DirectoryContext);

    const handleClick = async () => {
        const id = directoryItem.id;
        const media_type = directoryItem.media_type;
        const newItem = directoryItem;
        newItem.media_type = result.media_type;
        newItem.title = result.media_type === 'movie' ? result.title : result.media_type === 'tv' ? result.name : "No Title Found";
        newItem.id = result.id;
        newItem.poster_path = result.poster_path;
        newItem.backdrop_path = result.backdrop_path;
        newItem.release = result.media_type === 'movie' ? result.release_date : result.media_type === 'tv' ? result.first_air_date : null;
        newItem.overview = result.overview;
        newItem.popularity = result.popularity;
        newItem.detailed_info = false;

        await addDetailedDataToList(newItem);

        dispatch({ type: 'SET_LOADING' });

        if (media_type === 'tv' && newItem.media_type === 'movie') {
            newItem.seasons ? delete newItem.seasons : null;
            newItem.number_of_seasons ? delete newItem.number_of_seasons : null;
            newItem.number_of_seasons ? delete newItem.number_of_seasons : null;
            newItem.number_of_episodes ? delete newItem.number_of_episodes : null;
            newItem.last_air_date ? delete newItem.last_air_date : null;
            newItem.networks ? delete newItem.networks : null;
            newItem.next_episode ? delete newItem.next_episode : null;
        }

        saveNewDirectoryItemInfo(newItem, directories, id);

        dispatch({ 
            type: 'GET_DIRECTORY',
            payload: newItem
        });

        onClose();
        navigate(`/${newItem.id}`, {replace: true});
    }

    return (
        <div className="search-card">
            {result.poster_path ? <img className='search-card-image' loading="lazy" src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`}/> : <img className='' src="D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png" />}
            <div className="search-card-info">
                {result.title ? <p className='search-card-title'>{result.title} ({result.release_date ? result.release_date.substring(0,4) : null}) - Movie</p> : result.name ? <p className='search-card-title'>{result.name} ({result.first_air_date ? result.first_air_date.substring(0,4) : null}) - Series</p> : <p className='search-card-title'>No Title Found</p>}
                {result.overview ? <p className='search-card-text'>{result.overview}</p> : null}
            </div>
            <button onClick={handleClick}>Replace</button>
        </div>
    )
};

export default SearchCard;