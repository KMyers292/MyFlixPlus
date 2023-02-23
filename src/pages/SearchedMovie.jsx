import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addDetailedDataToList, minutesToHours } from '../context/directory/DirectoryActions';
import Slider from '../components/Slider.jsx';
import { BsPlusCircle } from 'react-icons/bs';

const SearchedMovie = () => {

    const params = useParams();
    const {dispatch, loading} = useContext(DirectoryContext);
    const [searchedMovie, setSearchedMovie] = useState({});

    useEffect(() => {
        dispatch({ type: 'SET_LOADING' });

        const getData = async () => {
            let data = {
                media_type: 'movie',
                id: params.id,
                searchedItem: true
            }
            await addDetailedDataToList(data);
            setSearchedMovie(data);
        }

        getData();

        dispatch({ type: 'SET_LOADING_FALSE' });

        return () => {
            setSearchedMovie({});
        }
    }, [dispatch, params.id]);
    
    if (Object.keys(searchedMovie).length !== 0 && !loading) {
        return (
            <div>
                <div className='media-container'>
                    {searchedMovie.backdrop_path ? <div className='bg-img' style={{backgroundImage: 'linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url('+`${searchedMovie.backdrop_path}`+')'}}></div> : null}
                    <div className='media-info'>
                        <h1 className='title'>{searchedMovie.title}</h1>
                        <div className='info-bar'>
                            {searchedMovie.vote_average ? <p>{Math.round(searchedMovie.vote_average * 10)+ '%'}</p> : null}
                            {searchedMovie.release ? <p>{searchedMovie.release.substring(0,4)}</p> : null}
                            {searchedMovie.runtime ? <p>{minutesToHours(searchedMovie.runtime)}</p> : null}
                            {searchedMovie.rating ? <p className='rating'>{searchedMovie.rating}</p> : null}
                        </div>
                        <p className='overview'>{searchedMovie.overview}</p>
                        <div className='info-list-container'>
                            <p>Starring:
                                <span className='info-list'>
                                    {searchedMovie.credits[0] ? searchedMovie.credits[0] : null}
                                    {searchedMovie.credits[1] ? ", " + searchedMovie.credits[1] : null}
                                    {searchedMovie.credits[2] ? ", " + searchedMovie.credits[2] : null}
                                </span>
                            </p>
                            <p>Genres: 
                                <span className='info-list'>
                                    {searchedMovie.genres[0] ? searchedMovie.genres[0].name : null}
                                    {searchedMovie.genres[1] ? ", " + searchedMovie.genres[1].name : null}
                                    {searchedMovie.genres[2] ? ", " + searchedMovie.genres[2].name : null}
                                </span>
                            </p>
                            <p>Status: <span className='info-list'>{searchedMovie.status}</span></p>
                            {searchedMovie.providers ? (
                                <p>Watch On: 
                                    <img className='provider_logo' loading='lazy' title={searchedMovie.providers.provider_name} src={searchedMovie.providers.logo_path} />
                                </p>
                            ) : null}
                        </div>
                        <button className='add-btn' title='Add to Watch List'><BsPlusCircle/></button>
                    </div>
                    {searchedMovie.recommendations ? 
                        <div className='recommendations'>
                            <h3 className='recommendations-title'>Recommendations</h3>
                            <div className='slider-container'>
                                <Slider directoryList={searchedMovie.recommendations} type='static' />
                            </div>
                        </div> 
                    : null}
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <span className='loader'></span>
            </div>
        )
    }
};

export default SearchedMovie;