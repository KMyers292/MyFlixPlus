import React from 'react';
import SearchCard from './SearchCard.jsx';

const EditSearchResults = ({results, directoryItem, onClose}) => {
    return (
        <div className='search-results'>
            {results.map((result, i) => (
                result ? (
                    <SearchCard key={i} onClose={onClose} result={result} directoryItem={directoryItem} />
                ) : null
            ))}
        </div>
    )
};

export default EditSearchResults;