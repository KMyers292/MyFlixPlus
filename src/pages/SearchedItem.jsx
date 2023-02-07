import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { fetchDetailedData, addDetailedDataToList } from '../context/directory/DirectoryActions';
import Slider from '../components/Slider.jsx';
import { BsPlusCircle } from "react-icons/bs";

const SearchedItem = () => {
    const params = useParams();
    const {searchedItem, dispatch} = useContext(DirectoryContext);

    useEffect(() => {

        dispatch({ type: 'SET_LOADING' });

        const getData = async () => {
            let data = {
                media_type: params.mediaType,
                id: params.id,
                searchedItem: true
            }
            
            await addDetailedTmdbData(data);

            console.log(data);

            dispatch({ 
                type: 'GET_SEARCHED_ITEM',
                payload: data
            });
        }

        getData();

    }, [dispatch, params.id, params.mediaType]);

    if (searchedItem.media_type === 'movie' || searchedItem.media_type === 'tv') {
        return (
            <div>
                <div className="media-container">
                    {searchedItem.backdrop_path ? <div className='bg-image' style={{backgroundImage: "linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url("+`https://image.tmdb.org/t/p/w500/${searchedItem.backdrop_path}`+")"}}></div> : null}
                    <div className="media-info">
                        <h1 className="title">{searchedItem.title}</h1>
                        <div className="info-bar">
                            <p>{searchedItem.vote_average ? Math.round(searchedItem.vote_average * 10)+ '%' : null}</p>
                            <p>{searchedItem.release.substring(0,4)}</p>
                            <p>{searchedItem.runtime}</p>
                            {searchedItem.rating ? <p className='rating'>{searchedItem.rating}</p> : null}
                        </div>
                        <p className="overview">{searchedItem.overview}</p>
                        <div className="info-list">
                            <p>Starring:
                                <span className="genres">
                                    {searchedItem.credits[0] ? searchedItem.credits[0] : null}
                                    {searchedItem.credits[1] ? ", " + searchedItem.credits[1] : null}
                                    {searchedItem.credits[2] ? ", " + searchedItem.credits[2] : null}
                                </span>
                            </p>
                            <p>Genres: 
                                <span className="genres">
                                    {searchedItem.genres[0] ? searchedItem.genres[0].name : null}
                                    {searchedItem.genres[1] ? ", " + searchedItem.genres[1].name : null}
                                    {searchedItem.genres[2] ? ", " + searchedItem.genres[2].name : null}
                                </span>
                            </p>
                            {searchedItem.providers ? (
                                <div className='provider-container'>
                                    <img className='provider_logo-searched' title={searchedItem.providers.provider_name} src={`https://image.tmdb.org/t/p/w200/${searchedItem.providers.logo_path}`}/>
                                    <p>
                                        Stream It Now <br/>
                                        On {searchedItem.providers.provider_name}
                                    </p>
                                    <button className="add-btn" title='Add to Watch List'><BsPlusCircle/></button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    {searchedItem.recommendations ? 
                        <div className="recommendations">
                            <h3 className="recommendations-title">Recommendations</h3>
                            <div className='slider-container'>
                                <Slider directoryList={searchedItem.recommendations} type="static" />
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
                Loading...
            </div>
        )
    }
};

export default SearchedItem;