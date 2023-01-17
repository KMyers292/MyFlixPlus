const {ipcRenderer} = require('electron');
import React, {useState, useContext} from 'react';
import {Form, Button, Container} from 'react-bootstrap';
import { getDirectoryFiles } from '../context/directory/DirectoryActions';
import DirectoryContext from '../context/directory/DirectoryContext';
import AlertContext from '../context/alert/AlertContext';
import '../assets/css/App.css';

const Settings = () => {

    const [text, setText] = useState(sessionStorage.getItem('savedDirectory') || '');
    const {setAlert} = useContext(AlertContext);
    const {dispatch} = useContext(DirectoryContext);

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!text) {
            setAlert('Please Enter a Directory', 'error');
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
                // Send new settings to main process
                ipcRenderer.send('settings:set', {
                    directoryPath: text
                });

                setAlert('Successfully Saved Directory!', 'success');
            }
        }
    };

    return (
        <Container className="settings-container">
            <div className='settings-header-box'>
                <p>Settings</p>
            </div>
            <Form onSubmit={handleSubmit} className="form-box">
                <Form.Control type="text" value={text || ''} className="form-input" onChange={handleChange} placeholder="Media Directory - Ex: C:\Folder\Media"/>
                <Button type='submit' className="form-btn-submit">Save</Button>
            </Form>
        </Container>
    )
};

export default Settings;