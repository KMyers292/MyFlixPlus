import React, {useEffect, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Button, Container, Row, Col} from 'react-bootstrap';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getDirectory } from '../context/directory/DirectoryActions';
import {ipcRenderer} from 'electron';
import { IoPlaySharp } from "react-icons/io5";
import fs from 'fs';

const DirectoryItem = () => {
    const params = useParams();
    const navigate = useNavigate();
    const {directory, dispatch, loading} = useContext(DirectoryContext);

    useEffect(() => {
        dispatch({ type: 'SET_LOADING' });

        const directoryItem = getDirectory(params.id);

        dispatch({ 
            type: 'GET_DIRECTORY',
            payload: directoryItem
        });

        console.log(directoryItem);

    }, [dispatch, params.id]);

    const handleClick = () => {
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

    if(directory.media_type === 'tv') {
        return (
            <Container className="directory-container">
                <Row>
                    <Col className="directory-col">
                        <h3 className="directory-name">{directory.title}</h3>
                        <Row>
                            <p>{directory.release ? directory.release.substring(0,4) : "N/A"}</p>
                            <p>{directory.genres ? directory.genres[0].name : "N/A"}</p>
                        </Row>
                    </Col>
                    <Col><img src={`http://image.tmdb.org/t/p/w500/${directory.backdrop_path}`}/></Col>
                </Row>
                <p>{directory.overview}</p>
            </Container>
        )
    }
    else if (directory.media_type === 'movie'){
        return (
            <div>
                <div className="media-container">
                    <div className='bg-image' style={{backgroundImage: "linear-gradient(to right, rgb(11, 16, 22), rgba(0, 0, 0, 0.5)), url("+`http://image.tmdb.org/t/p/w500/${directory.backdrop_path}`+")"}}></div>
                    <div className="media-info">
                        <h1 className="title">{directory.title}</h1>
                        <div className="info-bar">
                            <p>*IMBD Rating*</p>
                            <p>{directory.release ? directory.release.substring(0,4) : "N/A"}</p>
                            <p>{directory.runtime} min</p>
                            <p>*Age Rating*</p>
                        </div>
                        <p className="overview">{directory.overview}</p>
                        <div className="info-list">
                            <p>*Directors: *</p>
                            <p>*Starring: *</p>
                            <p>Genres: 
                                <span className="genres">
                                    {directory.genres[0] ? directory.genres[0].name : null}
                                    {directory.genres[1] ? ", " + directory.genres[1].name : null}
                                    {directory.genres[2] ? ", " + directory.genres[2].name : null}
                                </span>
                            </p>
                        </div>
                        <button className="play-btn" onClick={handleClick}><IoPlaySharp/>Play</button>
                    </div>
                </div>
                <div>
                    <h2>Suggested</h2>
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
                <Button onClick={handleClick}>Play</Button>
            </Container>
        )
    }
};

export default DirectoryItem;