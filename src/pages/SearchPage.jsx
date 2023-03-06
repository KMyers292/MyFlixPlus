import React, { useEffect } from 'react';
import MediaCard from '../components/MediaCard.jsx';

const SearchPage = ({searchResults, searchTitle}) => {

    useEffect(() => {
        console.log(searchResults);
    }, []);

    if (searchResults.length > 0) {
        return (
            <div className='search-results-container'>
                <h1 className='search-results-header'>Results for "{searchTitle}"</h1>
                <div>
                    {searchResults.map((result, i) => (
                        result ? (
                            <MediaCard key={i} result={result} />
                        ) : null
                    ))}
                    <p className='search-text'>Still Can't Find What You're Looking For? Try A More Exact Title.</p>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='search-results-container'>
                <h1 className='search-results-header'>Results for "{searchTitle}"</h1>
                <div>
                    <p className='search-no-results'>No Results Found For That Title. Are You Sure It's Spelt Correctly? <br></br> If So, It May Not Be In The Database At This Time.</p>
                </div>
            </div>
        )
    }
};

export default SearchPage;