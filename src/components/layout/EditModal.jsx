import React, {useState} from 'react';
import EditForm from '../EditForm.jsx';
import EditSearch from '../EditSearch.jsx';

const EditModal = ({open, onClose, directoryItem}) => {

    const [active, setActive] = useState(0);

    if (!open) {
        return null;
    }

    return (
        <div onClick={onClose} className='overlay'>
            <div onClick={(e) => {e.stopPropagation();}} className='modal-container'>
                <div className='edit-modal-header'>
                    <h1 className='modal-title'>Edit Info For "{directoryItem.directory.file_name}"</h1>
                    <p className='modal-close-btn' onClick={onClose}>X</p>
                </div>
                <div className='modal-tabs'>
                    <a className={active === 0 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(0)}>Search</a>
                    <a className={active === 1 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(1)}>Edit</a>
                </div>
                {active === 0 && (
                    <div>
                        <EditSearch onClose={onClose} directoryItem={directoryItem} />
                    </div>
                )}
                {active === 1 && (
                    <div>
                        <EditForm onClose={onClose} directoryItem={directoryItem} />
                    </div>
                )}
            </div>
        </div>
    )
};

export default EditModal;