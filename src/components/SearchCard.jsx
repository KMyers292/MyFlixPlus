import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addDetailedDataToList, saveNewDirectoryItemInfo } from '../context/directory/DirectoryActions';

const SearchCard = ({result, directoryItem, onClose}) => {

    const navigate = useNavigate();
    const {directories, dispatch} = useContext(DirectoryContext);

    const handleClick = async () => {
        const id = directoryItem.id;
        const media_type = directoryItem.media_type;
        const newItem = {...directoryItem};
        newItem.media_type = result.media_type;
        newItem.title = result.title;
        newItem.id = result.id;
        newItem.poster_path = result.poster_path;
        newItem.backdrop_path = result.backdrop_path;
        newItem.release = result.release;
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

        if (saveNewDirectoryItemInfo(newItem, directories, media_type, id)) {
            dispatch({ 
                type: 'GET_DIRECTORY',
                payload: newItem
            });
    
            onClose();
            navigate(`${newItem.media_type === 'movie' ? '/movie' : newItem.media_type === 'tv' ? '/series' : '/unknown'}/${newItem.id}`, {replace: true});
        }
        else {
            console.log(directoryItem);
            dispatch({ type: 'SET_LOADING_FALSE' });
            onClose();
        }
    }

    useEffect(() => {
        if (result) {
            result.title = result.media_type === 'movie' ? result.title : result.media_type === 'tv' ? result.name : 'No Title Found';
            result.overview = result.overview || 'No Overview Available';
            result.release = result.release_date || result.first_air_date || null;
            result.poster_path = result.poster_path ? `https://image.tmdb.org/t/p/w200/${result.poster_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png';
        }
    }, [result]);

    return (
        <div className='search-card'>
            <img className='search-card-image' loading='lazy' src={result.poster_path} />
            <div className='search-card-info-container'>
                <div className='search-card-info'>
                    <p className='search-card-title'>{result.title}</p>
                    <p className='search-card-text'>{result.overview}</p>
                </div>
                <div className='search-card-btn-container'>
                    <div>
                        {result.release ? <p className='search-card-other-info'>{result.release.substring(0,4)}</p> : null}
                        {result.media_type === 'movie' ? <p className='search-card-other-info'>Movie</p> : result.media_type === 'tv' ? <p className='search-card-other-info'>Series</p> : null}
                    </div>
                    <button className='search-card-btn' onClick={handleClick}>Replace</button>
                </div>
            </div>
        </div>
    )
};

export default SearchCard;