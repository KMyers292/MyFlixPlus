import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Container} from 'react-bootstrap';
import { getDirectoryFiles } from '../context/directory/DirectoryActions';
import DirectoryContext from '../context/directory/DirectoryContext';
import '../assets/css/App.css';

const LaunchPage = () => {

    const navigate = useNavigate();
    const {dispatch} = useContext(DirectoryContext);

    const handleClick = async () => {

        const savedDirectory = sessionStorage.getItem('savedDirectory', savedDirectory) || '';

        if(savedDirectory) {
            dispatch({
                type: 'SET_LOADING'
            });

            const directories = await getDirectoryFiles(savedDirectory);

            dispatch({
                type: 'GET_DIRECTORIES',
                payload: directories
            });

            navigate('/results');
        }
        else {
            navigate('/getStarted');
        }
    };

    return (
        <Container className="launch-container">
            <Button className="form-btn-submit" onClick={handleClick}>Get Started</Button>
        </Container>
    )
};

export default LaunchPage;