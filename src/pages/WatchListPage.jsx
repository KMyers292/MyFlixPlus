import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { dateNumbersToWords } from '../context/directory/DirectoryActions';

const WatchListPage = () => {

    const {directories, watchlist} = useContext(DirectoryContext);
    
    return (
        <div className='browse-container'>
            <div className='browse-heading'>
                <h1 className='browse-title'>Watch List</h1>
            </div>
            <div className='browse-grid'>
                {watchlist.map((directory, i) => (
                    directory ? (
                        <div key={i} className='browse-card-container'>
                            {directories.find((file) => Number(file.id) === Number(directory.id) && file.media_type === directory.media_type) ? (
                                <Link to={directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`} className='browse-card-link'>
                                    <img className='browse-card-img' loading='lazy' src={directory.poster_path} />
                                    <div className='browse-card-info'>
                                        <div className='browse-card-heading'>
                                            <h3 className='browse-card-title'>{directory.title}</h3>
                                            {directory.media_type ? <p className={directory.media_type === 'tv' ? 'browse-series-badge' : 'browse-movie-badge'}>{directory.media_type === 'tv' ? 'Series' : directory.media_type === 'movie' ? 'Movie' : null}</p> : null}
                                        </div>
                                        <div className='browse-card-small-info'>
                                            {directory.release ? <p className='browse-card-release'>{dateNumbersToWords(directory.release)}</p> : null}
                                            {directory.release && directory.vote_average ? <p>|</p> : null}
                                            {directory.vote_average ? <p className='browse-card-rating'>{Math.round(directory.vote_average * 10)+ '%'}</p> : null}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to={directory.media_type === 'tv' ? `/searched/series/${directory.id}` : directory.media_type === 'movie' ? `/searched/movie/${directory.id}` : `/unknown/${directory.id}`} className='browse-card-link'>
                                    <img className='browse-card-img' loading='lazy' src={directory.poster_path} />
                                    <div className='browse-card-info'>
                                        <div className='browse-card-heading'>
                                            <h3 className='browse-card-title'>{directory.title}</h3>
                                            {directory.media_type ? <p className={directory.media_type === 'tv' ? 'browse-series-badge' : 'browse-movie-badge'}>{directory.media_type === 'tv' ? 'Series' : directory.media_type === 'movie' ? 'Movie' : null}</p> : null}
                                        </div>
                                        <div className='browse-card-small-info'>
                                            {directory.release ? <p className='browse-card-release'>{dateNumbersToWords(directory.release)}</p> : null}
                                            {directory.release && directory.vote_average ? <p>|</p> : null}
                                            {directory.vote_average ? <p className='browse-card-rating'>{Math.round(directory.vote_average * 10)+ '%'}</p> : null}
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    ) : null
                ))}
            </div>
        </div>
    )
};

export default WatchListPage;