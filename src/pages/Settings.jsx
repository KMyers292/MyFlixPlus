import React, { useState, useContext } from 'react';
const { ipcRenderer } = require('electron');
import DirectoryContext from '../context/directory/DirectoryContext';
import AlertContext from '../context/alert/AlertContext';
import { getFileDataInDirectory } from '../context/directory/DirectoryActions';

const Settings = () => {

    const {setAlert} = useContext(AlertContext);
    const {dispatch} = useContext(DirectoryContext);
    const [text, setText] = useState(sessionStorage.getItem('savedDirectory') || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (text.length <= 0) {
            setAlert('Please Enter a Directory', 'error');
            return null;
        }

        try {
            const directories = await getFileDataInDirectory(text);
            
            dispatch({
                type: 'GET_DIRECTORIES',
                payload: directories
            });

            // Send new settings to main process
            ipcRenderer.send('settings:set', {
                directoryPath: text
            });

            setAlert('Successfully Saved Directory!', 'success');
        } 
        catch (error) {
            console.log('Settings Error: ' + error);
            setAlert('No Directory Found. Please Try Again.', 'error');
            return null;
        }
    };

    return (
        <div className='settings-container'>
            <h1 className='settings-header'>Settings</h1>
            <form onSubmit={handleSubmit} className='settings-form'>
                <input
                    type='text'
                    className='settings-form-input'
                    id='storageDirectory'
                    name='storageDirectory'
                    placeholder='Media Directory - Ex: C:\Folder\Media'
                    value={text}
                    onChange={(e) => setText(e.target.value)}

                />
                <button type='submit' className='settings-submit-btn'>Save</button>
            </form>
        </div>
    )
};

export default Settings;