import React, {useState, useEffect, useContext} from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import { saveNewDirectoryItemInfo } from '../context/directory/DirectoryActions';

const EditForm = ({directoryItem, onClose}) => {

    const {directories} = useContext(DirectoryContext);
    const [title, setTitle] = useState('');
    const [overview, setOverview] = useState('');
    const [backdrop, setBackdrop] = useState('');
    const [poster, setPoster] = useState('');

    useEffect(() => {
        if (directoryItem) {
            setTitle(directoryItem.title);
            setOverview(directoryItem.overview);
            if (directoryItem.custom_backdrop_path) {
                setBackdrop(directoryItem.custom_backdrop_path);
            }
            if (directoryItem.custom_posters_path) {
                setPoster(directoryItem.custom_poster_path);
            }
        }

        return () => {
            setTitle('');
            setOverview('');
            setBackdrop('');
            setPoster('');
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
        if (poster.length > 0) {
            item.custom_poster_path = poster;
        }

        saveNewDirectoryItemInfo(item, directories);
        onClose();
    }

    return (
        <div>
            <form onSubmit={submitHandler} className='modal-form'>
                <div className='modal-form-group'>
                    <label className='modal-form-label' htmlFor="title">Title</label>
                    <input 
                        className='modal-form-input'
                        type="text" 
                        id="title" 
                        name="title" 
                        placeholder="Enter A Title"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className='modal-form-group'>
                    <label className='modal-form-label' htmlFor="overview">Overview</label>
                    <textarea 
                        style={{resize: 'none'}}
                        className='modal-form-input form-textarea'
                        rows="8"
                        id="overview" 
                        name="overview" 
                        placeholder="Enter An Overview"
                        value={overview} 
                        onChange={(e) => setOverview(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className='modal-form-group'>
                    <label className='modal-form-label' htmlFor="backdrop">Backdrop Path</label>
                    <input 
                        className='modal-form-input'
                        type="text" 
                        id="backdrop" 
                        name="backdrop" 
                        placeholder="Enter A Path For Custom Backdrop Image"
                        value={backdrop} 
                        onChange={(e) => setBackdrop(e.target.value)}
                    />
                </div>
                <div className='modal-form-group'>
                    <label className='modal-form-label' htmlFor="poster">Poster Path</label>
                    <input 
                        className='modal-form-input'
                        type="text" 
                        id="poster" 
                        name="poster" 
                        placeholder="Enter A Path For Custom Poster Image"
                        value={poster} 
                        onChange={(e) => setPoster(e.target.value)}
                    />
                </div>
                <div className='modal-form-group'>
                    <input className='modal-form-save-btn' type="submit" value="Save Info" />
                </div>
            </form>
        </div>
    )
};

export default EditForm;