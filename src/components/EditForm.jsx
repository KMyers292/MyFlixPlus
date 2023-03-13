import React, { useState, useEffect, useContext } from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import { saveNewDirectoryItemInfo } from '../context/directory/DirectoryActions';

const EditForm = ({directoryItem, onClose}) => {

    const {directories} = useContext(DirectoryContext);
    const [removeBackdrop, setRemoveBackdrop] = useState(false);
    const [removePoster, setRemovePoster] = useState(false);
    const [title, setTitle] = useState('');
    const [overview, setOverview] = useState('');
    const [backdrop, setBackdrop] = useState('');
    const [poster, setPoster] = useState('');

    useEffect(() => {
        if (directoryItem) {
            setTitle(directoryItem.title);
            setOverview(directoryItem.overview);
        }

        return () => {
            setTitle('');
            setOverview('');
        }
    }, [directoryItem]);

    const submitHandler = (e) => {
        e.preventDefault();
        const item = directoryItem;
        item.title = title;
        item.overview = overview;

        if (backdrop.length > 0) {
            item.custom_backdrop_path = backdrop;
        }

        if (removeBackdrop) {
            delete item.custom_backdrop_path;
        }

        if (poster.length > 0) {
            item.custom_poster_path = poster;
        }

        if (removePoster) {
            delete item.custom_poster_path;
        }

        saveNewDirectoryItemInfo(item, directories);
        onClose();
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.id === 'backdrop') {
            const newPath = e.target.files[0].path.replace(/\\/g,'/');
            setBackdrop(newPath);
        }
        else if (e.target.files && e.target.id === 'poster') {
            const newPath = e.target.files[0].path.replace(/\\/g,'/');
            setPoster(newPath);
        }
    }

    if (Object.keys(directoryItem).length !== 0) {
        return (
            <div>
                <form onSubmit={submitHandler} className='modal-form'>
                    <div className='modal-form-group'>
                        <label className='modal-form-label' htmlFor='title'>Title</label>
                        <input 
                            className='modal-form-input'
                            type='text' 
                            id='title'
                            name='title' 
                            placeholder='Enter A Title'
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className='modal-form-group'>
                        <label className='modal-form-label' htmlFor='overview'>Overview</label>
                        <textarea 
                            style={{resize: 'none'}}
                            className='modal-form-input form-textarea'
                            rows='8'
                            id='overview' 
                            name='overview' 
                            placeholder='Enter An Overview'
                            value={overview || ''} 
                            onChange={(e) => setOverview(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='modal-form-group'>
                        <label className='modal-form-label' htmlFor='backdrop'>Backdrop Path</label>
                        <input 
                            className='modal-form-input file-input'
                            type='file' 
                            id='backdrop' 
                            name='backdrop' 
                            onChange={handleFileChange}
                        />
                    </div>
                    {Object.hasOwn(directoryItem, 'custom_backdrop_path') ? (
                        <div className='modal-checkbox-group'>
                            <input 
                                className='modal-form-checkbox'
                                type='checkbox'
                                id='remove-backdrop'
                                name='remove-backdrop'
                                onChange={(e) => {setRemoveBackdrop(e.target.checked)}}
                            />
                            <label className='modal-checkbox-label' htmlFor='remove-backdrop'>Remove Custom Backdrop?</label>
                        </div>
                    ) : null}
                    <div className='modal-form-group'>
                        <label className='modal-form-label last-label' htmlFor='poster'>Poster Path</label>
                        <input 
                            className='modal-form-input file-input'
                            type='file'
                            id='poster' 
                            name='poster' 
                            onChange={handleFileChange}
                        />
                    </div>
                    {Object.hasOwn(directoryItem, 'custom_poster_path') ? (
                        <div className='modal-checkbox-group'>
                            <input 
                                className='modal-form-checkbox'
                                type='checkbox'
                                id='remove-poster'
                                name='remove-poster'
                                onChange={(e) => {setRemovePoster(e.target.checked)}}
                            />
                            <label className='modal-checkbox-label' htmlFor='remove-poster'>Remove Custom Poster?</label>
                        </div>
                    ) : null}
                    <div className='modal-form-group'>
                        <input className='modal-form-save-btn' type='submit' value='Save Info' />
                    </div>
                </form>
            </div>
        )
    }
    else {
        return (
            <div className='loader-container'>
                <span className='loader'></span>
            </div>
        )
    }
};

export default EditForm;