import React, { useState } from 'react';
import { fetchBasicData } from '../context/directory/DirectoryActions';
import EditSearchResults from './EditSearchResults.jsx';
import { IoSearchSharp } from 'react-icons/io5';

const EditSearch = ({directoryItem, onClose, getResults, searchResults, savedTitle}) => {

    const [title, setTitle] = useState(savedTitle || '');
    const [results, setResults] = useState(searchResults || []);
    
    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (title) {
            const results = await fetchBasicData(title);
            setResults(results);
            getResults(results, title);
        }
    }

    return (
        <div>
            <h2 className='edit-search-title'>Not The Results You Were Expecting? Search For What You Want Below:</h2>
            <form onSubmit={submitHandler} className='edit-search-form'>
                <div className='search-form-group'>
                    <div>
                        <input
                            className='modal-search-input'
                            type='text' 
                            id='newMedia' 
                            name='newMedia' 
                            placeholder='Search...'
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            required 
                        />
                        <button type='submit' className='search-submit-btn' >
                            <IoSearchSharp className='submit-icon' />
                        </button>
                    </div>
                </div>
            </form>
            {results.length > 0 && <EditSearchResults onClose={onClose} results={results} directoryItem={directoryItem} />}
        </div>
    )
};

export default EditSearch;