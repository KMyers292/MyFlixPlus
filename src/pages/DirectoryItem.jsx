import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {ipcRenderer} from 'electron';
import fs from 'fs';
import {Button, Container, Row, Col} from 'react-bootstrap';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getMediaObject } from '../context/directory/DirectoryActions';
import Slider from '../components/Slider.jsx';
import { IoPlaySharp } from "react-icons/io5";
import { BsPlusCircle } from "react-icons/bs";
import { MdEdit } from "react-icons/md";

const DirectoryItem = () => {
    const params = useParams();
    const {directory, dispatch, loading} = useContext(DirectoryContext);

    useEffect(() => {

        dispatch({ type: 'SET_LOADING' });

        const directoryItem = getMediaObject(params.id);

        dispatch({ 
            type: 'GET_DIRECTORY',
            payload: directoryItem
        });

        console.log(directoryItem);

    }, [dispatch, params.id]);

    const handlePlayBtnClick = () => {
        const files = fs.readdirSync(directory.path);
        const name = directory.path + "\\" + files[0];
        ipcRenderer.send('vlc:open', name);
    }

    if(loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (directory.media_type === 'movie' || directory.media_type === 'tv') {
        return (
            <div>
                <div className="media-container">
                    {directory.backdrop_path ? <div className='bg-image' style={{backgroundImage: "linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url("+`https://image.tmdb.org/t/p/w500/${directory.backdrop_path}`+")"}}></div> : null}
                    <div className="media-info">
                        <h1 className="title">{directory.title} <button className="edit-btn" title="Edit Entry"><MdEdit /></button></h1>
                        <div className="info-bar">
                            <p>{Math.round(directory.vote_average * 10)+ '%'}</p>
                            <p>{directory.release.substring(0,4)}</p>
                            <p>{directory.runtime + 'min'}</p>
                            {directory.rating ? <p className='rating'>{directory.rating}</p> : null}
                        </div>
                        <p className="overview">{directory.overview}</p>
                        <div className="info-list">
                            <p>Starring:
                                <span className="genres">
                                    {directory.credits[0] ? directory.credits[0] : null}
                                    {directory.credits[1] ? ", " + directory.credits[1] : null}
                                    {directory.credits[2] ? ", " + directory.credits[2] : null}
                                </span>
                            </p>
                            <p>Genres: 
                                <span className="genres">
                                    {directory.genres[0] ? directory.genres[0].name : null}
                                    {directory.genres[1] ? ", " + directory.genres[1].name : null}
                                    {directory.genres[2] ? ", " + directory.genres[2].name : null}
                                </span>
                            </p>
                            {directory.providers ? (
                                <p>Watch On: 
                                    <img className='provider_logo' title={directory.providers.provider_name} src={`https://image.tmdb.org/t/p/w200/${directory.providers.logo_path}`}/>
                                </p>
                            ) : null}
                        </div>
                        <button className="play-btn" onClick={handlePlayBtnClick}><IoPlaySharp/>Play</button>
                        <button className="add-btn" title='Add to Watch List'><BsPlusCircle/></button>
                    </div>
                    {directory.recommendations ? 
                        <div className="recommendations">
                            <h3 className="recommendations-title">Recommendations</h3>
                            <div className='slider-container'>
                                <Slider directoryList={directory.recommendations} type="static" />
                            </div>
                        </div> 
                    : null}
                </div>
            </div>
        )
    }
    else {
        return (
            <Container>
                <Row>
                    <Col><h3>{directory.title}</h3></Col>
                    <Col><img src='D:\Projects\Electron\MyFlix_javascript\assets\no_image.jpg'/></Col>
                </Row>
                <Button onClick={handlePlayBtnClick}>Play</Button>
            </Container>
        )
    }
};

export default DirectoryItem;