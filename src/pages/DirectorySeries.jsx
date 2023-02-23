import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getMediaObjectFromList, addSeasonsInDirectoryToList, addEpisodesToList, getOtherFilesInDirectory } from '../context/directory/DirectoryActions';
import Slider from '../components/Slider.jsx';
import SeasonsList from '../components/SeasonsList.jsx';
import OtherFilesList from '../components/OtherFilesList.jsx';
import EditModal from '../components/layout/EditModal.jsx';
import { BsPlusCircle } from "react-icons/bs";
import { MdEdit } from "react-icons/md";

const DirectorySeries = () => {

    const params = useParams();
    const {directory, directories, dispatch, loading} = useContext(DirectoryContext);
    const [active, setActive] = useState(0);
    const [seasonNum, setSeasonNum] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [seasonObject, setSeasonObject] = useState({});
    const [seasonsOptions, setSeasonsOptions] = useState([]);
    const [otherFilesList, setOtherFilesList] = useState([]);

    useEffect(() => {
        dispatch({ type: 'SET_LOADING' });
        const directoryItem = getMediaObjectFromList(params.id);

        dispatch({ 
            type: 'GET_DIRECTORY',
            payload: directoryItem
        });

        let seasons = [];

        for (let i = 1; i <= directoryItem.number_of_seasons; i++) {
            seasons.push(<option value={i} key={i}>Season {i}</option>);
        }

        setSeasonsOptions(seasons);
        setSeasonObject(directoryItem.seasons[seasonNum - 1]);

        if (directoryItem.directory && directoryItem.media_type === 'tv') {
            const seasonsList = addSeasonsInDirectoryToList(directoryItem, directories, params.id);
            const otherFiles = getOtherFilesInDirectory(directoryItem, seasonsList);

            if(otherFiles) {
                const otherFilesFiltered = otherFiles.filter((file) => file.is_directory);
                setOtherFilesList(otherFilesFiltered);
            }
        }

        return () => {
            setSeasonsOptions([]);
            setSeasonObject({});
            setOtherFilesList([]);
        }
    }, [dispatch, params.id]);

    const handleChange = async (e) => {
        setSeasonNum(e.target.value);
        const seasonObject = await addEpisodesToList(e.target.value, directory, directories);
        if (seasonObject) {
            setSeasonObject(seasonObject);
        }
    }

    if (directory.media_type === 'tv' && !loading && Object.keys(seasonObject).length !== 0) {
        return (
            <div>
                <EditModal open={openModal} onClose={() => setOpenModal(false)} directoryItem={directory} />
                <div className='media-container'>
                    {directory.custom_backdrop_path ? (
                        <div className='bg-img' style={{backgroundImage: 'linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url('+`${directory.custom_backdrop_path}`+')'}}></div>
                    ) : (
                        directory.backdrop_path ? <div className='bg-img' style={{backgroundImage: 'linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url('+`${directory.backdrop_path}`+')'}}></div> : null
                    )}
                    <div className='media-info'>
                        <h1 className='title'>{directory.title}</h1>
                        <div className='info-bar'>
                            {directory.vote_average ? <p>{Math.round(directory.vote_average * 10)+ '%'}</p> : null}
                            {directory.release && directory.last_air_date ? <p>{directory.release.substring(0,4)} - {directory.last_air_date.substring(0,4)}</p> : null}
                            {directory.rating ? <p className='rating'>{directory.rating}</p> : null}
                            {directory.number_of_seasons ? <p>{directory.number_of_seasons}{directory.number_of_seasons > 1 ? ' Seasons' : ' Season'}</p> : null}
                        </div>
                        <p className='overview'>{directory.overview}</p>
                        <div className="info-list-container">
                            <p>Starring:
                                <span className='info-list'>
                                    {directory.credits[0] ? directory.credits[0] : null}
                                    {directory.credits[1] ? ", " + directory.credits[1] : null}
                                    {directory.credits[2] ? ", " + directory.credits[2] : null}
                                </span>
                            </p>
                            <p>Genres: 
                                <span className='info-list'>
                                    {directory.genres[0] ? directory.genres[0].name : null}
                                    {directory.genres[1] ? ", " + directory.genres[1].name : null}
                                    {directory.genres[2] ? ", " + directory.genres[2].name : null}
                                </span>
                            </p>
                            <p>Status: <span className='info-list'>{directory.status}</span></p>
                            {directory.providers ? (
                                <p>Watch On: 
                                    <img className='provider_logo' loading='lazy' title={directory.providers.provider_name} src={directory.providers.logo_path} />
                                </p>
                            ) : null}
                        </div>
                        <button className='add-btn' title='Add to Watch List'><BsPlusCircle /></button>
                        {directory.directory && directory.directory.path ? <button className='edit-btn' title='Edit Entry' onClick={() => setOpenModal(true)}><MdEdit /></button> : null}
                    </div>
                </div>
                <div className='tabs tabs-seasons'>
                    <a className={active === 0 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(0)}>Seasons</a>
                    {directory.recommendations ? <a className={active === 1 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(1)}>Recommendations</a> : null}
                    {otherFilesList.length > 0 ? <a className={active === 2 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(2)}>Other Folders</a> : null}
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
                            <Slider directoryList={directory.recommendations} type='static' />
                        </div>
                    </div> 
                )}
                {active === 2 && (
                    <div className='season-container'>
                        <OtherFilesList otherFiles={otherFilesList} />
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

export default DirectorySeries;