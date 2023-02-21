import React, { useState, useContext } from 'react';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import DirectoryContext from '../../context/directory/DirectoryContext';
import { minutesToHours } from '../../context/directory/DirectoryActions';
import Slider from '../Slider.jsx';
import EditModal from './EditModal.jsx';
import { IoPlaySharp } from "react-icons/io5";
import { BsPlusCircle } from "react-icons/bs";
import { MdEdit } from "react-icons/md";

const MovieItemView = ({directoryItem}) => {

    const {loading} = useContext(DirectoryContext);
    const [openModal, setOpenModal] = useState(false);

    const handlePlayBtnClick = () => {
        const files = fs.readdirSync(directoryItem.directory.path);
        const name = directoryItem.directory.path + "\\" + files[0];
        ipcRenderer.send('vlc:open', name);
    }

    if (directoryItem.media_type === 'movie' && !loading) {
        return (
            <div>
                <EditModal open={openModal} directoryItem={directoryItem} onClose={() => setOpenModal(false)} />
                <div className="media-container">
                    {directoryItem.backdrop_path ? <div className='bg-img' style={{backgroundImage: "linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url("+`${directoryItem.backdrop_path}`+")"}}></div> : null}
                    <div className="media-info">
                        <h1 className="title">{directoryItem.title}</h1>
                        <div className="info-bar">
                            {directoryItem.vote_average ? <p>{Math.round(directoryItem.vote_average * 10)+ '%'}</p> : null}
                            {directoryItem.release ? <p>{directoryItem.release.substring(0,4)}</p> : null}
                            {directoryItem.runtime ? <p>{minutesToHours(directoryItem.runtime)}</p> : null}
                            {directoryItem.rating ? <p className='rating'>{directoryItem.rating}</p> : null}
                        </div>
                        <p className="overview">{directoryItem.overview}</p>
                        <div className="info-list-container">
                            <p>Starring:
                                <span className="info-list">
                                    {directoryItem.credits[0] ? directoryItem.credits[0] : null}
                                    {directoryItem.credits[1] ? ", " + directoryItem.credits[1] : null}
                                    {directoryItem.credits[2] ? ", " + directoryItem.credits[2] : null}
                                </span>
                            </p>
                            <p>Genres: 
                                <span className="info-list">
                                    {directoryItem.genres[0] ? directoryItem.genres[0].name : null}
                                    {directoryItem.genres[1] ? ", " + directoryItem.genres[1].name : null}
                                    {directoryItem.genres[2] ? ", " + directoryItem.genres[2].name : null}
                                </span>
                            </p>
                            <p>Status: <span className="info-list">{directoryItem.status}</span></p>
                            {directoryItem.providers ? (
                                <p>Watch On: 
                                    <img className='provider_logo' title={directoryItem.providers.provider_name} src={directoryItem.providers.logo_path} />
                                </p>
                            ) : null}
                        </div>
                        {directoryItem.directory && directoryItem.directory.path ? <button className="play-btn" onClick={handlePlayBtnClick}><IoPlaySharp />Play</button> : null}
                        <button className="add-btn" title='Add to Watch List'><BsPlusCircle/></button>
                        {directoryItem.directory && directoryItem.directory.path ? <button className="edit-btn" title="Edit Entry" onClick={() => setOpenModal(true)}><MdEdit /></button> : null}
                    </div>
                    {directoryItem.recommendations ? 
                        <div className="recommendations">
                            <h3 className="recommendations-title">Recommendations</h3>
                            <div className='slider-container'>
                                <Slider directoryList={directoryItem.recommendations} type="static" />
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
                <span className="loader"></span>
            </div>
        )
    }
};

export default MovieItemView;