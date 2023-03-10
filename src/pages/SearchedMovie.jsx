import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addDetailedDataToList, minutesToHours, addToWatchList, removeFromWatchList, dateNumbersToWords } from '../context/directory/DirectoryActions';
import Recommendations from '../components/Recommendations.jsx';
import { MdPlaylistRemove, MdPlaylistAdd } from 'react-icons/md';

const SearchedMovie = () => {

    const params = useParams();
    const {watchlist, dispatch} = useContext(DirectoryContext);
    const [searchedMovie, setSearchedMovie] = useState({});

    useEffect(() => {
        const getData = async () => {
            let data = {
                media_type: 'movie',
                id: params.id,
                searchedItem: true
            }
            await addDetailedDataToList(data);
            console.log(data);
            setSearchedMovie(data);
        }

        getData();
    }, [dispatch, params.id]);

    const handleListAdd = () => {
        const list = addToWatchList(searchedMovie);

        dispatch({
            type: 'GET_WATCHLIST',
            payload: list
        });
    };

    const handleListRemove = () => {
        const list = removeFromWatchList(searchedMovie);

        dispatch({
            type: 'GET_WATCHLIST',
            payload: list
        });
    };
    
    if (Object.keys(searchedMovie).length !== 0) {
        return (
            <div>
                <div className='media-container'>
                    {searchedMovie.backdrop_path ? <div className='bg-img' style={{backgroundImage: 'linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url('+`${searchedMovie.backdrop_path}`+')'}}></div> : null}
                    <div className='media-info'>
                        <h1 className='title'>{searchedMovie.title}</h1>
                        <div className='info-bar'>
                            {searchedMovie.vote_average ? <p>{Math.round(searchedMovie.vote_average * 10)+ '%'}</p> : null}
                            {searchedMovie.release ? <p>{dateNumbersToWords(searchedMovie.release)}</p> : null}
                            {searchedMovie.runtime ? <p>{minutesToHours(searchedMovie.runtime)}</p> : null}
                            {searchedMovie.rating ? <p className='rating'>{searchedMovie.rating}</p> : null}
                        </div>
                        <p className='overview'>{searchedMovie.overview}</p>
                        <div className='info-list-container'>
                        {searchedMovie.credits && searchedMovie.credits.length > 0 && searchedMovie.credits[0] ? (
                                <p>Starring:
                                    <span className='info-list'>
                                        {searchedMovie.credits[0] ? searchedMovie.credits[0] : null}
                                        {searchedMovie.credits[1] ? ', ' + searchedMovie.credits[1] : null}
                                        {searchedMovie.credits[2] ? ', ' + searchedMovie.credits[2] : null}
                                    </span>
                                </p>
                            ) : null}
                            {searchedMovie.genres && searchedMovie.genres.length > 0 && searchedMovie.genres[0] ? (
                                <p>Genres: 
                                    <span className='info-list'>
                                        {searchedMovie.genres[0] ? searchedMovie.genres[0].name : null}
                                        {searchedMovie.genres[1] ? ', ' + searchedMovie.genres[1].name : null}
                                        {searchedMovie.genres[2] ? ', ' + searchedMovie.genres[2].name : null}
                                    </span>
                                </p>
                            ) : null}
                            {searchedMovie.status ? <p>Status: <span className='info-list'>{searchedMovie.status}</span></p> : null}
                            {searchedMovie.providers ? (
                                <p>Watch On: 
                                    <img className='provider_logo' loading='lazy' title={searchedMovie.providers.provider_name} src={searchedMovie.providers.logo_path} alt={`Logo For ${searchedMovie.providers.provider_name}`} />
                                </p>
                            ) : null}
                        </div>
                        {watchlist.find((file) => Number(file.id) === Number(searchedMovie.id) && file.media_type === searchedMovie.media_type) ? (
                            <button className='add-btn' title='Remove From Watch List' onClick={handleListRemove}><MdPlaylistRemove /></button>
                        ) : (
                            <button className='add-btn' title='Add to Watch List' onClick={handleListAdd}><MdPlaylistAdd /></button>
                        )}
                    </div>
                    <div className='tabs tabs-seasons'>
                        <a className='episodes-header active'>Recommendations</a>
                    </div>
                    <Recommendations directoryList={searchedMovie.recommendations} />
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='loader-container'>
                <span className='loader'></span>
            </div>
        )
    }
};

export default SearchedMovie;