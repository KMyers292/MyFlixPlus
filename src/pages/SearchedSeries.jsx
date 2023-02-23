import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addDetailedDataToList, fetchEpisodesData, createEpisodesList } from '../context/directory/DirectoryActions';
import Slider from '../components/Slider.jsx';
import SeasonsList from '../components/SeasonsList.jsx';
import { BsPlusCircle } from 'react-icons/bs';

const SearchedSeries = () => {

    const params = useParams();
    const {dispatch, loading} = useContext(DirectoryContext);
    const [active, setActive] = useState(0);
    const [seasonNum, setSeasonNum] = useState(1);
    const [seasonObject, setSeasonObject] = useState({});
    const [seasonsOptions, setSeasonsOptions] = useState([]);
    const [searchedSeries, setSearchedSeries] = useState({});

    useEffect(() => {
        const getData = async () => {
            let data = {
                media_type: 'tv',
                id: params.id,
                searchedItem: true
            }
            
            await addDetailedDataToList(data);
            setSearchedSeries(data);
            return data;
        }

        dispatch({ type: 'SET_LOADING' });

        getData().then((data) => {
            let seasons = [];

            for (let i = 1; i <= data.number_of_seasons; i++) {
                seasons.push(<option value={i} key={i}>Season {i}</option>);
            }
            setSeasonsOptions(seasons);
            setSeasonObject(data.seasons[seasonNum - 1]);
        });

        dispatch({ type: 'SET_LOADING_FALSE' });

        return () => {
            setSearchedSeries({});
            setSeasonObject({});
            setSeasonsOptions([]);
        }
    }, [dispatch, params.id]);

    const handleChange = async (e) => {
        setSeasonNum(e.target.value);

        const response = await fetchEpisodesData(searchedSeries.id, e.target.value);
        const episodes = createEpisodesList(response);

        if (episodes) {
            const item = searchedSeries.seasons[e.target.value - 1];
            item.episodes = [...episodes];
            setSeasonObject(item);
        }
    }
    
    if (Object.keys(searchedSeries).length !== 0 && Object.keys(seasonObject).length !== 0 && !loading) {
        return (
            <div>
                <div className='media-container'>
                    {searchedSeries.custom_backdrop_path ? (
                        <div className='bg-img' style={{backgroundImage: 'linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url('+`${searchedSeries.custom_backdrop_path}`+')'}}></div>
                    ) : (
                        searchedSeries.backdrop_path ? <div className='bg-img' style={{backgroundImage: 'linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url('+`${searchedSeries.backdrop_path}`+')'}}></div> : null
                    )}
                    <div className='media-info'>
                        <h1 className='title'>{searchedSeries.title}</h1>
                        <div className='info-bar'>
                            {searchedSeries.vote_average ? <p>{Math.round(searchedSeries.vote_average * 10)+ '%'}</p> : null}
                            {searchedSeries.release && searchedSeries.last_air_date ? <p>{searchedSeries.release.substring(0,4)} - {searchedSeries.last_air_date.substring(0,4)}</p> : null}
                            {searchedSeries.rating ? <p className='rating'>{searchedSeries.rating}</p> : null}
                            {searchedSeries.number_of_seasons ? <p>{searchedSeries.number_of_seasons}{searchedSeries.number_of_seasons > 1 ? ' Seasons' : ' Season'}</p> : null}
                        </div>
                        <p className='overview'>{searchedSeries.overview}</p>
                        <div className='info-list-container'>
                            {searchedSeries.credits && searchedSeries.credits.length > 0 && searchedSeries.credits[0] ? (
                                <p>Starring:
                                    <span className='info-list'>
                                        {searchedSeries.credits[0] ? searchedSeries.credits[0] : null}
                                        {searchedSeries.credits[1] ? ", " + searchedSeries.credits[1] : null}
                                        {searchedSeries.credits[2] ? ", " + searchedSeries.credits[2] : null}
                                    </span>
                                </p>
                            ) : null}
                            {searchedSeries.genres && searchedSeries.genres.length > 0 && searchedSeries.genres[0] ? (
                                <p>Genres: 
                                    <span className='info-list'>
                                        {searchedSeries.genres[0] ? searchedSeries.genres[0].name : null}
                                        {searchedSeries.genres[1] ? ", " + searchedSeries.genres[1].name : null}
                                        {searchedSeries.genres[2] ? ", " + searchedSeries.genres[2].name : null}
                                    </span>
                                </p>
                            ) : null}
                            {searchedSeries.status ? <p>Status: <span className='info-list'>{searchedSeries.status}</span></p> : null}
                            {searchedSeries.providers ? (
                                <p>Watch On: 
                                    <img className='provider_logo' loading='lazy' title={searchedSeries.providers.provider_name} src={searchedSeries.providers.logo_path} />
                                </p>
                            ) : null}
                        </div>
                        <button className='add-btn' title='Add to Watch List'><BsPlusCircle /></button>
                    </div>
                </div>
                <div className='tabs tabs-seasons'>
                    <a className={active === 0 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(0)}>Seasons</a>
                    {searchedSeries.recommendations ? <a className={active === 1 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(1)}>Recommendations</a> : null}
                </div>
                {active === 0 && (
                    <div className='season-container'>
                        <select className='seasons-select' value={seasonNum} onChange={handleChange}>
                            {seasonsOptions}
                        </select>
                        <SeasonsList seasonObject={seasonObject} id={params.id} />
                    </div>
                )}
                {active === 1 && (
                    <div className='recommendations recommendations-series'>
                        <div className='slider-container'>
                            <Slider directoryList={searchedSeries.recommendations} type='static' />
                        </div>
                    </div> 
                )}
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

export default SearchedSeries;