import React from 'react';
import {ipcRenderer} from 'electron';
import { minutesToHours, dateNumbersToWords } from '../context/directory/DirectoryActions';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { BiPlayCircle } from "react-icons/bi";
import '../assets/css/App.css';

const EpisodeCard = ({episodes}) => {

    const handleClick = (i) => {
        ipcRenderer.send('vlc:open', episodes[i].directory.path);
    }

    return (
        <>
            {Object.values(episodes).map((episode, i) => (
                <div key={i} className={episode.hasOwnProperty('directory') ? 'card-container hasDirectory' : 'card-container'} onClick={episode.hasOwnProperty('directory') ? (e) => handleClick(i) : undefined}>
                    <div className="episode-image-container">
                        {episode.still_path ? <img className='episode-image' loading="lazy" src={`https://image.tmdb.org/t/p/w200/${episode.still_path}`}/> : <img className='image-still no-image' src="D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png" />}
                        {episode.hasOwnProperty('directory') ? <BiPlayCircle className='episode-play-icon' /> : null}
                    </div>
                    <div className='episode-info-container'>
                        <div className='episode-main-info'>
                            <div className='episode-title-container'>
                                {episode.name && episode.episode_number ? <h5 className='episode-title'>{episode.episode_number}. {episode.name}</h5> : null}
                                {episode.hasOwnProperty('directory') ? <IoIosCheckmarkCircle className='episode-checkmark-icon' title='Ready To Play'/> : null}
                            </div>
                            {episode.overview ? <p>{episode.overview}</p> : null}
                        </div>
                        <div className='episode-extra-info'>
                            {episode.air_date ? <p>{dateNumbersToWords(episode.air_date)}</p> : null}
                            {episode.runtime ? <p>{minutesToHours(episode.runtime)}</p> : null}
                            {episode.vote_average ? <p>{Math.round(episode.vote_average * 10)+ '%'}</p> : null}
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
};

export default EpisodeCard;