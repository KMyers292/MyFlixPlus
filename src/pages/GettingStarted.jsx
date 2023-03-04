import React, { useState, useContext } from 'react';
const { ipcRenderer } = require('electron');
import { useNavigate } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import AlertContext from '../context/alert/AlertContext';
import { getFileDataInDirectory } from '../context/directory/DirectoryActions';

const GettingStarted = () => {

    const navigate = useNavigate();
    const {dispatch} = useContext(DirectoryContext);
    const { setAlert } = useContext(AlertContext);
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(text === '') {
            setAlert('Please Enter A Directory!', 'error');
        }
        else {
            const directories = await getFileDataInDirectory(text);

            dispatch({
                type: 'GET_DIRECTORIES',
                payload: directories
            });

            if(!directories) {
                setAlert('No Directory Found. Please Try Again.', 'error');
            }
            else {
                ipcRenderer.send('settings:set', {
                    directoryPath: text
                });

                setText('');
                navigate('/results');
            }
        }
    };

    return (
        <div className='get-started-container'>
            <h1 className='get-started-header'>Enter A Directory Below To Get Started.</h1>
            <form onSubmit={handleSubmit} className='get-started-form-box'>
                <div className='get-started-text-container'>
                    <input
                        type='text'
                        className='get-started-text-input'
                        id='storageDirectory'
                        name='storageDirectory'
                        placeholder='Media Directory - Ex: C:\Folder\Media'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button type='submit' className='get-started-submit-btn'>Save</button>
                </div>
            </form>
        </div>
    )
};

export default GettingStarted;