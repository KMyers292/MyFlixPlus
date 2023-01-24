import React, {useEffect, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getDetailedTmdbData } from '../context/directory/DirectoryActions';
import Slider from '../components/Slider.jsx';
import { BsPlusCircle } from "react-icons/bs";

const SearchedItem = () => {
    const params = useParams();
    const navigate = useNavigate();
    const {searchedItem, dispatch, loading} = useContext(DirectoryContext);

    useEffect(() => {

        dispatch({ type: 'SET_LOADING' });

        const getData = async () => {
            const data = await getDetailedTmdbData(params.mediaType, params.id);
            data.media_type = params.mediaType;
            data.rating = data.release_dates.results ? data.release_dates.results.find(item => item.iso_3166_1 === "US") : null;
            data.providers = data["watch/providers"].results ? data["watch/providers"].results.CA.flatrate : null;
            data.recommendations = data.recommendations ? [data.recommendations.results[0], data.recommendations.results[1], data.recommendations.results[2], data.recommendations.results[3], data.recommendations.results[4]] : null;

            dispatch({ 
                type: 'GET_SEARCHED_ITEM',
                payload: data
            });

            console.log(data);
        }

        getData();

    }, [dispatch, params.id, params.mediaType]);

    if(loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if(searchedItem.media_type === 'tv') {
        return (
            <div>
                hi
            </div>
            // <Container className="directory-container">
            //     <Row>
            //         <Col className="directory-col">
            //             <h3 className="directory-name">{searchedItem.title}</h3>
            //             <Row>
            //                 <p>{searchedItem.release ? searchedItem.release.substring(0,4) : "N/A"}</p>
            //                 <p>{searchedItem.genres ? searchedItem.genres[0].name : "N/A"}</p>
            //             </Row>
            //         </Col>
            //         <Col><img src={`http://image.tmdb.org/t/p/w500/${searchedItem.backdrop_path}`}/></Col>
            //     </Row>
            //     <p>{searchedItem.overview}</p>
            // </Container>
        )
    }
    else if (searchedItem.media_type === 'movie'){
        return (
            <div>
                <div className="media-container">
                    {searchedItem.backdrop_path ? <div className='bg-image' style={{backgroundImage: "linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url("+`https://image.tmdb.org/t/p/w500/${searchedItem.backdrop_path}`+")"}}></div> : null}
                    <div className="media-info">
                        <h1 className="title">{searchedItem.title}</h1>
                        <div className="info-bar">
                            <p>{searchedItem.vote_average ? Math.round(searchedItem.vote_average * 10)+ '%' : null}</p>
                            <p>{searchedItem.release_date ? searchedItem.release_date.substring(0,4) : null}</p>
                            <p>{searchedItem.runtime ? searchedItem.runtime + 'min' : null}</p>
                            <p className='rating'>{searchedItem.rating.release_dates[1] ? searchedItem.rating.release_dates[1].certification : null}</p>
                        </div>
                        <p className="overview">{searchedItem.overview}</p>
                        <div className="info-list">
                            <p>Starring:
                                <span className="genres">
                                    {searchedItem.credits.cast[0] ? searchedItem.credits.cast[0].name : null}
                                    {searchedItem.credits.cast[1] ? ", " + searchedItem.credits.cast[1].name : null}
                                    {searchedItem.credits.cast[2] ? ", " + searchedItem.credits.cast[2].name : null}
                                </span>
                            </p>
                            <p>Genres: 
                                <span className="genres">
                                    {searchedItem.genres[0] ? searchedItem.genres[0].name : null}
                                    {searchedItem.genres[1] ? ", " + searchedItem.genres[1].name : null}
                                    {searchedItem.genres[2] ? ", " + searchedItem.genres[2].name : null}
                                </span>
                            </p>
                            <div className='provider-container'>
                                {searchedItem.providers[0] ? <img className='provider_logo-searched' title={searchedItem.providers[0].provider_name} src={`https://image.tmdb.org/t/p/w200/${searchedItem.providers[0].logo_path}`}/> : null}
                                <p>
                                    Stream It Now <br/>
                                    On {searchedItem.providers[0].provider_name}
                                </p>
                                <button className="add-btn" title='Add to Watch List'><BsPlusCircle/></button>
                            </div>
                        </div>
                    </div>
                    {searchedItem.recommendations ? 
                        <div className="recommendations-searched">
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
                {searchedItem.title}
            </div>
        )
    }
};

export default SearchedItem;