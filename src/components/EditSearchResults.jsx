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
            <p className='search-text'>Still Can't Find What You're Looking For? Try A More Exact Title. <br></br>Or Head Over To The Edit Tab And Enter Exactly What You Want!</p>
        </div>
    )
};

export default EditSearchResults;