import React, { useState, useEffect, useContext } from 'react';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getMediaObjectFromList, minutesToHours } from '../context/directory/DirectoryActions';
import Slider from '../components/Slider.jsx';
import EditModal from '../components/layout/EditModal.jsx';
import { IoPlaySharp } from 'react-icons/io5';
import { BsPlusCircle } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';

const DirectoryMovie = () => {

    const params = useParams();
    const {directory, loading, dispatch} = useContext(DirectoryContext);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        dispatch({ type: 'SET_LOADING' });
        const directoryItem = getMediaObjectFromList(params.id);

        dispatch({ 
            type: 'GET_DIRECTORY',
            payload: directoryItem
        });
    }, [dispatch, params.id]);

    const handlePlayBtnClick = () => {
        const files = fs.readdirSync(directory.directory.path);
        const name = directory.directory.path + '\\' + files[0];
        ipcRenderer.send('vlc:open', name);
    }

    if (directory.media_type === 'movie' && !loading) {
        return (
            <div>
                <EditModal open={openModal} directoryItem={directory} onClose={() => setOpenModal(false)} />
                <div className='media-container'>
                    {directory.backdrop_path ? <div className='bg-img' style={{backgroundImage: 'linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url('+`${directory.backdrop_path}`+')'}}></div> : null}
                    <div className='media-info'>
                        <h1 className='title'>{directory.title}</h1>
                        <div className='info-bar'>
                            {directory.vote_average ? <p>{Math.round(directory.vote_average * 10)+ '%'}</p> : null}
                            {directory.release ? <p>{directory.release.substring(0,4)}</p> : null}
                            {directory.runtime ? <p>{minutesToHours(directory.runtime)}</p> : null}
                            {directory.rating ? <p className='rating'>{directory.rating}</p> : null}
                        </div>
                        <p className='overview'>{directory.overview}</p>
                        <div className='info-list-container'>
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
                        {directory.directory && directory.directory.path ? <button className='play-btn' onClick={handlePlayBtnClick}><IoPlaySharp />Play</button> : null}
                        <button className='add-btn' title='Add to Watch List'><BsPlusCircle/></button>
                        {directory.directory && directory.directory.path ? <button className='edit-btn' title='Edit Entry' onClick={() => setOpenModal(true)}><MdEdit /></button> : null}
                    </div>
                    {directory.recommendations ? 
                        <div className='recommendations'>
                            <h3 className='recommendations-title'>Recommendations</h3>
                            <div className='slider-container'>
                                <Slider directoryList={directory.recommendations} type='static' />
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

export default DirectoryMovie;