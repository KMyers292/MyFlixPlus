import React, {useState} from 'react';
import EditForm from '../EditForm.jsx';
import EditSearch from '../EditSearch.jsx';

const EditModal = ({open, onClose, directoryItem}) => {

    const [active, setActive] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [title, setTitle] = useState('');

    const getResults = (results, title) => {
        setSearchResults(results);
        setTitle(title);
    }

    const closeModal = () => {
        setSearchResults([]);
        setTitle('');
        onClose();
    }

    if (!open) {
        return null;
    }
    return (
        <div onClick={closeModal} className='overlay'>
            <div onClick={(e) => {e.stopPropagation()}} className='modal-container'>
                <div className='edit-modal-header'>
                    <h1 className='modal-title'>Edit Info For "{directoryItem.directory.file_name}"</h1>
                    <p className='modal-close-btn' onClick={closeModal}>X</p>
                </div>
                <div className='modal-tabs'>
                    <a className={active === 0 ? 'tabs-header active-episodes' : 'tabs-header'} onClick={() => setActive(0)}>Search</a>
                    <a className={active === 1 ? 'tabs-header active-episodes' : 'tabs-header'} onClick={() => setActive(1)}>Edit</a>
                </div>
                {active === 0 && (
                    <div className='modal-info-container'>
                        <EditSearch onClose={closeModal} directoryItem={directoryItem} getResults={getResults} searchResults={searchResults} savedTitle={title} />
                    </div>
                )}
                {active === 1 && (
                    <div className='modal-info-container'>
                        <EditForm onClose={closeModal} directoryItem={directoryItem} />
                    </div>
                )}
            </div>
        </div>
    )
};

export default EditModal;