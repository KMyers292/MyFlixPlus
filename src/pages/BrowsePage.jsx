import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';

const BrowsePage = () => {

    const {directories} = useContext(DirectoryContext);
    const [sortType, setSortType] = useState('All Media');
    const [sortedList, setSortedList] = useState([]);

    useEffect(() => {
        let list = [...directories];
        list.sort((a,b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
        setSortedList(list);
    }, []);

    const handleChange = (e) => {
        if (e.target.value === 'All Media') {
            let list = [...directories];
            list.sort((a,b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
            setSortedList(list);
            setSortType('All Media');
        }
        else if (e.target.value === 'Series') {
            const filteredList = directories.filter((item) => item.media_type === 'tv');
            filteredList.sort((a,b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
            setSortedList(filteredList);
            setSortType('Series');
        }
        else if (e.target.value === 'Movies') {
            const filteredList = directories.filter((item) => item.media_type === 'movie');
            filteredList.sort((a,b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
            setSortedList(filteredList);
            setSortType('Movies');
        }
    }

    return (
        <div className='browse-container'>
            <div className='browse-heading'>
                <h1 className='browse-title'>Browse Locally Stored Media - {sortType}</h1>
                <div>
                    <label className='browse-select-label' htmlFor="filter">Filter </label>
                    <select className='browse-select' name="filter" id="filter" onChange={handleChange}>
                        <option value='All Media'>All Media</option>
                        <option value='Series'>Series</option>
                        <option value='Movies'>Movies</option>
                    </select>
                </div>
            </div>
            <div className='browse-grid'>
                {sortedList.map((directory, i) => (
                    directory ? (
                        <div key={i} className='browse-card-container'>
                            <Link to={directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`} className='browse-card-link'>
                                <img className='browse-card-img' loading='lazy' src={directory.poster_path} />
                                <div className='browse-card-info'>
                                    <div className='browse-card-heading'>
                                        <h3 className='browse-card-title'>{directory.title}</h3>
                                        {directory.media_type ? <p className={directory.media_type === 'tv' ? 'browse-series-badge' : 'browse-movie-badge'}>{directory.media_type === 'tv' ? 'Series' : directory.media_type === 'movie' ? 'Movie' : null}</p> : null}
                                    </div>
                                    <div className='browse-card-small-info'>
                                        {directory.release ? <p className='browse-card-release'>{directory.release.substring(0,4)}</p> : null}
                                        {directory.release ? <p>|</p> : null}
                                        {directory.vote_average ? <p className='browse-card-rating'>{Math.round(directory.vote_average * 10)+ '%'}</p> : null}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ) : null
                ))}
            </div>
        </div>
    )
};

export default BrowsePage;