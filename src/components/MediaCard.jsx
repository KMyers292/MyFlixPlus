import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { dateNumbersToWords } from '../context/directory/DirectoryActions';

const MediaCard = ({result}) => {

    const navigate = useNavigate();
    const {directories} = useContext(DirectoryContext);

    const handleClick = (directory) => {
        if (directories.find((file) => file.id === Number(directory.id))) {
          navigate(directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`);
        }
        else {
          navigate(directory.media_type === 'tv' ? `/searched/series/${directory.id}` : directory.media_type === 'movie' ? `/searched/movie/${directory.id}` : `/unknown/${directory.id}`);
        }
      };

    return (
        <div className="media-card" onClick={() => handleClick(result)}>
            <img className="media-card-img" loading='lazy' src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`} alt="" />
            <div className='media-card-info'>
                <div className='media-card-heading'>
                    <h3 className='media-card-title'>{result.media_type === 'tv' ? result.name : result.media_type === 'movie' ? result.title : 'No Title Available'}</h3>
                    <div className='media-card-small-info'>
                        <p className={result.media_type === 'tv' ? 'media-card-tv' : 'media-card-movie'}>{result.media_type === 'tv' ? 'Series' : result.media_type === 'movie' ? 'Movie' : null}</p>
                        <p className='media-card-rating'>{Math.round(result.vote_average * 10)+ '%'}</p>
                    </div>
                </div>
                <p className='media-card-release'>{result.media_type === 'tv' ? dateNumbersToWords(result.first_air_date) : result.media_type === 'movie' ? dateNumbersToWords(result.release_date) : null}</p>
                <p className='media-card-overview'>{result.overview}</p>
            </div>
        </div>
    )
};

export default MediaCard;