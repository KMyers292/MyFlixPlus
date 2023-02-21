import React from 'react';
import {ipcRenderer} from 'electron';
import { minutesToHours, dateNumbersToWords } from '../context/directory/DirectoryActions';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { BiPlayCircle } from "react-icons/bi";

const EpisodeCard = ({episodes, type}) => {

    const handleClick = (index) => {
        if (type === 'episodes') {
            ipcRenderer.send('vlc:open', episodes[index].directory.path);
        }
        else if (type === 'files') {
            ipcRenderer.send('vlc:open', episodes[index].path);
        }
    }

    if(Object.keys(episodes).length !== 0 && type === 'episodes') {
        return (
            <>
                {Object.values(episodes).map((episode, i) => (
                    <div key={i} className={episode.hasOwnProperty('directory') ? 'card-container hasDirectory' : 'card-container'} onClick={episode.hasOwnProperty('directory') ? (e) => handleClick(i) : undefined}>
                        <div className="episode-image-container">
                            <img className='episode-image' loading="lazy" src={episode.still_path} />
                            {episode.hasOwnProperty('directory') ? <BiPlayCircle className='episode-play-icon' /> : null}
                        </div>
                        <div className='episode-info-container'>
                            <div className='episode-main-info'>
                                <div className='episode-title-container'>
                                    {episode.name && episode.episode_number ? <h6 className='episode-title'>{episode.episode_number}. {episode.name}</h6> : null}
                                    {episode.hasOwnProperty('directory') ? <IoIosCheckmarkCircle className='episode-checkmark-icon' title='Ready To Play'/> : null}
                                </div>
                                <p>{episode.overview}</p>
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
    }
    else if (Object.keys(episodes).length !== 0 && type === 'files') {
        return (
            <>
                {Object.values(episodes).map((episode, i) => (
                    <div key={i} className='files-container' onClick={!episode.is_directory ? (e) => handleClick(i) : undefined}>
                        <p className='files-title'>{episode.file_name}</p>
                    </div>
                ))}
            </>
        )
    }
    else if (Object.keys(episodes).length !== 0 && type === 'folders') {
        return (
            <>
                {Object.values(episodes).map((episode, i) => (
                    <div key={i} className='files-container folders' onClick={!episode.is_directory ? (e) => handleClick(i) : undefined}>
                        <p className='files-title'>{episode.file_name}</p>
                    </div>
                ))}
            </>
        )
    }
    else {
        return (
            <>
                <span className="loader"></span>
            </>
        )
    }
};

EpisodeCard.defaultProps = {
    type: "episodes"
}

export default EpisodeCard;