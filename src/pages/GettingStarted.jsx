import React, {useState, useContext} from 'react';
const {ipcRenderer} = require('electron');
import { useNavigate } from 'react-router-dom';
import {Form, Button, Container} from 'react-bootstrap';
import DirectoryContext from '../context/directory/DirectoryContext';
import AlertContext from '../context/alert/AlertContext';
import { getDirectoryFiles } from '../context/directory/DirectoryActions';
import '../assets/css/App.css';

const GettingStarted = () => {
    const [text, setText] = useState('');
    const [saveDirectory, setSaveDirectory] = useState(false);
    const navigate = useNavigate();
    const {dispatch} = useContext(DirectoryContext);
    const { setAlert } = useContext(AlertContext);

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(text === '') {
            setAlert('Please Enter A Directory!', 'error');
        }
        else {
            const directories = await getDirectoryFiles(text);

            dispatch({
                type: 'GET_DIRECTORIES',
                payload: directories
            });

            if(!directories) {
                setAlert('No Directory Found. Please Try Again.', 'error');
            }
            else {
                if(saveDirectory) {
                    ipcRenderer.send('settings:set', {
                        directoryPath: text
                    });
                }
                setText('');
                navigate('/results');
            }
        }
    };

    return (
        <Container className="get-started-container">
            <div className='get-started-text-box'>
                <p>Enter Directory Below To Get Started.</p>
            </div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="get-started-form-box" controlId="formBasicText">
                    <Form.Control className="form-input" type="text" value={text} onChange={handleChange} placeholder="Enter Directory Here - Ex: C:\Folder\Media" />
                    <Button className="form-btn-submit" type="submit">Submit</Button>
                </Form.Group>
                <Form.Group className="get-started-form-box" controlId="formBasicCheckbox">
                    <Form.Check className="get-started-checkbox" type="checkbox" value={true} label="Save Directory For Future Use?" onChange={(e) => setSaveDirectory(e.target.value)}/>
                </Form.Group>
            </Form>
        </Container>
    )
};

export default GettingStarted;