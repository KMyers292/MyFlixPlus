import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { IoIosCheckmarkCircle } from 'react-icons/io';

const Recommendations = ({directoryList}) => {

    const {directories} = useContext(DirectoryContext);

    if (directoryList && directoryList.length > 0) {
        return (
            <div className='recommendations-container'>
                {directoryList.map((directory, i) => (
                    directory ? (
                        <div key={i} className='recommendations-card'>
                            {directories.find((file) => Number(file.id) === Number(directory.id) && file.media_type === directory.media_type) ? (
                                <Link to={directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`} className='recommendations-card-link'>
                                    <img className='recommendations-card-img' loading='lazy' src={directory.poster_path} alt={`Poster For ${directory.title}`} />
                                    {directories.find((file) => file.id === Number(directory.id) && file.media_type === directory.media_type) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
                                    <div className='recommendations-card-info'>
                                        <div className='recommendations-card-heading'>
                                            <h3 className='recommendations-card-title' title={directory.title}>{directory.title.length > 22 ? directory.title.substring(0,22) + '...' : directory.title}</h3>
                                            {directory.vote_average ? <p className='recommendations-card-rating'>{Math.round(directory.vote_average * 10)+ '%'}</p> : null}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to={directory.media_type === 'tv' ? `/searched/series/${directory.id}` : directory.media_type === 'movie' ? `/searched/movie/${directory.id}` : `/unknown/${directory.id}`} className='recommendations-card-link'>
                                    <img className='recommendations-card-img' loading='lazy' src={directory.poster_path} alt={`Poster For ${directory.title}`}/>
                                    {directories.find((file) => file.id === Number(directory.id) && file.media_type === directory.media_type) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
                                    <div className='recommendations-card-info'>
                                        <div className='recommendations-card-heading'>
                                            <h3 className='recommendations-card-title' title={directory.title}>{directory.title.length > 24 ? directory.title.substring(0,24) + '...' : directory.title}</h3>
                                            {directory.vote_average ? <p className='recommendations-card-rating'>{Math.round(directory.vote_average * 10)+ '%'}</p> : null}
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    ) : null
                ))}
            </div>
        )
    }
    else {
        return (
            <div className='recommendations-container'>
                No Recommendations Available.
            </div>
        )
    }
};

export default Recommendations;