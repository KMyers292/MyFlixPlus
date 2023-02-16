import React, {useState} from 'react';
import EditSearchResults from './EditSearchResults.jsx';
import { fetchBasicData } from '../context/directory/DirectoryActions';

const EditSearch = ({directoryItem, onClose}) => {

    const [title, setTitle] = useState('');
    const [results, setResults] = useState([]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (title) {
            setResults(await fetchBasicData(title));
        }
    }

    return (
        <div>
            <h2 className='edit-search-title'>Not The Results You Were Expecting? Search For What You Want Below:</h2>
            <form onSubmit={submitHandler} className='edit-search-form'>
                <div className='modal-form-group'>
                    <div>
                        <input
                            className='modal-form-input'
                            type="text" 
                            id="newMedia" 
                            name="newMedia" 
                            placeholder="Enter A Title"
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            required 
                        />
                        <input type="submit" value="Search" />
                    </div>
                </div>
            </form>
            {results.length > 0 && <EditSearchResults onClose={onClose} results={results} directoryItem={directoryItem} />}
        </div>
    )
};

export default EditSearch;