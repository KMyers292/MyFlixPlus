import React from 'react';
import { minutesToHours, dateNumbersToWords } from '../context/directory/DirectoryActions';

const Card = ({episodes}) => {



    return (
        <div>
            {Object.values(episodes).map((episode, i) => (
                <div key={i} className='episode-container'>
                    {episode.still_path ? <img className='img-still' loading="lazy" src={`https://image.tmdb.org/t/p/w200/${episode.still_path}`}/> : <img className='img-still no-img-still' src="D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png" />}
                    <div className='episode-title-container'>
                        {episode.name && episode.episode_number ? <p className='episode-title'>{episode.episode_number}. {episode.name}</p> : null}
                        {episode.overview ? <p>{episode.overview}</p> : null}
                    </div>
                    <div className='episode-info'>
                        {episode.air_date ? <p>{dateNumbersToWords(episode.air_date)}</p> : null}
                        {episode.runtime ? <p>{minutesToHours(episode.runtime)}</p> : null}
                        {episode.vote_average ? <p>{Math.round(episode.vote_average * 10)+ '%'}</p> : null}
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Card;