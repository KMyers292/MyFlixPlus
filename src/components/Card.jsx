import React from 'react';

const Card = ({episodes}) => {
    return (
        <div>
            {Object.values(episodes).map((episode, i) => (
                <div key={i} className='episode-container'>
                    {episode.still_path ? <img src={`https://image.tmdb.org/t/p/w200/${episode.still_path}`}/> : null}
                    <div className='episode-title'>
                        {episode.name && episode.episode_number ? <p>{episode.episode_number}. {episode.name}</p> : null}
                        {episode.overview ? <p>{episode.overview}</p> : null}
                    </div>
                    <div className='episode-info'>
                        {episode.air_date ? <p>{episode.air_date}</p> : null}
                        {episode.runtime ? <p>{episode.runtime}min</p> : null}
                        {episode.vote_average ? <p>{Math.round(episode.vote_average * 10)+ '%'}</p> : null}
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Card;