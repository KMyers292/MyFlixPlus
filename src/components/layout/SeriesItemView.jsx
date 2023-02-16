import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../../context/directory/DirectoryContext';
import { addSeasonsInDirectoryToList, addEpisodesToList, getOtherFilesInDirectory } from '../../context/directory/DirectoryActions';
import Slider from '../Slider.jsx';
import SeasonsList from '../SeasonsList.jsx';
import OtherFilesList from '../OtherFilesList.jsx';
import EditModal from './EditModal.jsx';
import { BsPlusCircle } from "react-icons/bs";
import { MdEdit } from "react-icons/md";

const SeriesItemView = ({directoryItem}) => {
    const params = useParams();
    const {directories, loading} = useContext(DirectoryContext);
    const [active, setActive] = useState(0);
    const [seasonNum, setSeasonNum] = useState(1);
    const [seasonsOptions, setSeasonsOptions] = useState([]);
    const [episodesList, setEpisodesList] = useState({});
    const [otherFilesList, setOtherFilesList] = useState({});
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        let seasons = [];

        for (let i = 1; i <= directoryItem.number_of_seasons; i++) {
            seasons.push(<option value={i} key={i}>Season {i}</option>);
        }

        setSeasonsOptions(seasons);
        setEpisodesList(directoryItem.seasons[seasonNum - 1]);

        if (directoryItem.directory) {
            const seasonsList = addSeasonsInDirectoryToList(directoryItem, directories, params.id);
            const otherFiles = getOtherFilesInDirectory(directoryItem, seasonsList);
            if(otherFiles) {
                const otherFilesFiltered = otherFiles.filter((file) => file.is_directory);
                setOtherFilesList(otherFilesFiltered);
            }
        }

        return () => {
            setSeasonsOptions([]);
            setEpisodesList({})
            setOtherFilesList({});
        }

    }, [directoryItem]);

    const handleChange = async (e) => {
        setSeasonNum(e.target.value);
        const episodesList = await addEpisodesToList(e.target.value, directoryItem, directories);
        if (episodesList) {
            setEpisodesList(episodesList);
        }
    }

    if (directoryItem.media_type === 'tv' && !loading && Object.keys(episodesList).length !== 0) {
        return (
            <div>
                <EditModal open={openModal} onClose={() => setOpenModal(false)} directoryItem={directoryItem} />
                <div className='media-container'>
                    {directoryItem.backdrop_path ? <div className='bg-image' style={{backgroundImage: "linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url("+`https://image.tmdb.org/t/p/w500/${directoryItem.backdrop_path}`+")"}}></div> : null}
                    <div className="media-info">
                        <h1 className="title">{directoryItem.title}</h1>
                        <div className="info-bar">
                            {directoryItem.vote_average ? <p>{Math.round(directoryItem.vote_average * 10)+ '%'}</p> : null}
                            {directoryItem.release && directoryItem.last_air_date ? <p>{directoryItem.release.substring(0,4)} - {directoryItem.last_air_date.substring(0,4)}</p> : null}
                            {directoryItem.rating ? <p className='rating'>{directoryItem.rating}</p> : null}
                            {directoryItem.number_of_seasons ? <p>{directoryItem.number_of_seasons}{directoryItem.number_of_seasons > 1 ? ' Seasons' : ' Season'}</p> : null}
                        </div>
                        <p className="overview">{directoryItem.overview}</p>
                        <div className="info-list">
                            <p>Starring:
                                <span className="genres">
                                    {directoryItem.credits[0] ? directoryItem.credits[0] : null}
                                    {directoryItem.credits[1] ? ", " + directoryItem.credits[1] : null}
                                    {directoryItem.credits[2] ? ", " + directoryItem.credits[2] : null}
                                </span>
                            </p>
                            <p>Genres: 
                                <span className="genres">
                                    {directoryItem.genres[0] ? directoryItem.genres[0].name : null}
                                    {directoryItem.genres[1] ? ", " + directoryItem.genres[1].name : null}
                                    {directoryItem.genres[2] ? ", " + directoryItem.genres[2].name : null}
                                </span>
                            </p>
                            <p>Status: <span className="genres">{directoryItem.status}</span></p>
                            {directoryItem.providers ? (
                                <p>Watch On: 
                                    <img className='provider_logo' title={directoryItem.providers.provider_name} src={`https://image.tmdb.org/t/p/w200/${directoryItem.providers.logo_path}`}/>
                                </p>
                            ) : null}
                        </div>
                        <button className="add-btn" title='Add to Watch List'><BsPlusCircle/></button>
                        {directoryItem.directory && directoryItem.directory.path ? <button className="edit-btn" title="Edit Entry" onClick={() => setOpenModal(true)}><MdEdit /></button> : null}
                    </div>
                </div>
                <div className='tabs tabs-seasons'>
                    <a className={active === 0 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(0)}>Seasons</a>
                    {directoryItem.recommendations ? <a className={active === 1 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(1)}>Recommendations</a> : null}
                    {Object.keys(otherFilesList).length !== 0 ? <a className={active === 2 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(2)}>Other Folders</a> : null}
                </div>
                {active === 0 && (
                    <div className="season-container">
                        <select className='seasons-select' value={seasonNum} onChange={handleChange}>
                            {seasonsOptions}
                        </select>
                        <SeasonsList episodesList={episodesList} id={params.id} />
                    </div>
                )}
                {active === 1 && (
                    <div className="recommendations">
                        <div className='slider-container'>
                            <Slider directoryList={directoryItem.recommendations} type="static" />
                        </div>
                    </div> 
                )}
                {active === 2 && (
                    <div className="season-container">
                        <OtherFilesList otherFiles={otherFilesList}/>
                    </div>
                )}
            </div>
        )
    }
    else {
        return (
            <div>
                <span className="loader"></span>
            </div>
        )
    }
};

export default SeriesItemView;