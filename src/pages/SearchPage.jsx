import React, { useEffect } from 'react';
import MediaCard from '../components/MediaCard.jsx';

const SearchPage = ({searchResults, searchTitle}) => {

    useEffect(() => {
        console.log(searchResults);
    }, []);

    return (
        <div className='search-results-container'>
            <h1 className='search-results-header'>Results for "{searchTitle}"</h1>
            <div className="results">
            {searchResults.map((result, i) => (
                result ? (
                    <MediaCard key={i} result={result} />
                ) : null
            ))}
            <p className='search-text'>Still Can't Find What You're Looking For? Try A More Exact Title.</p>
            </div>
        </div>
    )
};

export default SearchPage;