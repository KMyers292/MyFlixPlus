import React, { useState, useEffect, useContext } from 'react';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getOtherFoldersList, getMediaObjectFromList } from '../context/directory/DirectoryActions';
import EditModal from '../components/layout/EditModal.jsx';
import OtherFilesList from '../components/OtherFilesList.jsx';
import EpisodeCard from '../components/EpisodeCard.jsx';
import { IoPlaySharp } from 'react-icons/io5';
import { BsPlusCircle } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';

const UnknownFile = () => {

    const params = useParams();
    const {loading, dispatch} = useContext(DirectoryContext);
    const [active, setActive] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [otherFoldersList, setOtherFoldersList] = useState([]);
    const [otherFilesList, setOtherFilesList] = useState([]);
    const [directory, setDirectory] = useState({});

    useEffect(() => {
        dispatch({ type: 'SET_LOADING' });

        const directoryItem = getMediaObjectFromList(params.id);
        setDirectory(directoryItem);

        if (directoryItem.directory) {
            const list = getOtherFoldersList(directoryItem.directory.path);

            if (list) {
                setOtherFilesList(list.filter((item) => !item.is_directory));
                setOtherFoldersList(list.filter((item) => item.is_directory));
            }
        }

        dispatch({ type: 'SET_LOADING_FALSE' });

        return () => {
            setOtherFilesList([]);
            setOtherFoldersList([]);
            setDirectory({});
        }
    }, [dispatch, params.id]);

    const handlePlayBtnClick = () => {
        if (Object.keys(otherFilesList).length !== 0) {
            if (fs.existsSync(otherFilesList[0].path)) {
                ipcRenderer.send('vlc:open', otherFilesList[0].path);
            }
            else {
                console.log('No File Found');
            }
        }
    }

    if (Object.keys(directory).length !== 0 && !loading) {
        return (
            <div>
                <EditModal open={openModal} directoryItem={directory} onClose={() => setOpenModal(false)} />
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
                            {directory.release ? <p>{directory.release.substring(0,4)}</p> : null}
                            {directory.runtime ? <p>{minutesToHours(directory.runtime)}</p> : null}
                            {directory.rating ? <p className='rating'>{directory.rating}</p> : null}
                        </div>
                        <p className='overview'>{directory.overview}</p>
                        <div className='info-list-container'>
                            {directory.credits && directory.credits.length > 0 && directory.credits[0] ? (
                                <p>Starring:
                                    <span className='info-list'>
                                        {directory.credits[0] ? directory.credits[0] : null}
                                        {directory.credits[1] ? ", " + directory.credits[1] : null}
                                        {directory.credits[2] ? ", " + directory.credits[2] : null}
                                    </span>
                                </p>
                            ) : null}
                            {directory.genres && directory.genres.length > 0 && directory.genres[0] ? (
                                <p>Genres: 
                                    <span className='info-list'>
                                        {directory.genres[0] ? directory.genres[0].name : null}
                                        {directory.genres[1] ? ", " + directory.genres[1].name : null}
                                        {directory.genres[2] ? ", " + directory.genres[2].name : null}
                                    </span>
                                </p>
                            ) : null}
                            {directory.status ? <p>Status: <span className='info-list'>{directory.status}</span></p> : null}
                        </div>
                        {Object.keys(otherFilesList).length !== 0 ? <button className='play-btn' onClick={handlePlayBtnClick}><IoPlaySharp />Play</button> : null}
                        <button className='add-btn' title='Add to Watch List'><BsPlusCircle/></button>
                        {directory.directory && directory.directory.path ? <button className='edit-btn' title='Edit Entry' onClick={() => setOpenModal(true)}><MdEdit /></button> : null}
                    </div>
                </div>
                <div className='tabs tabs-seasons'>
                    {otherFoldersList.length > 0 ? <a className={active === 0 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(0)}>Other Folders</a> : null}
                    {otherFilesList.length > 0 ? <a className={active === 1 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(1)}>Other Files</a> : null}
                </div>
                {active === 0 && (
                    <div className='season-container'>
                        <OtherFilesList otherFiles={otherFoldersList} />
                    </div>
                )}
                {active === 1 && (
                    <div className='season-container'>
                        <EpisodeCard episodes={otherFilesList} type='folders' />
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

export default UnknownFile;