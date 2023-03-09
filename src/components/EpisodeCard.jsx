import React from 'react';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import { minutesToHours, dateNumbersToWords } from '../context/directory/DirectoryActions';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { BiPlayCircle } from 'react-icons/bi';

const EpisodeCard = ({episodes, type}) => {

    const handleClick = (index) => {
        if (type === 'episodes') {
            if (fs.existsSync(episodes[index].directory.path)) {
                ipcRenderer.send('vlc:open', episodes[index].directory.path);
            }
            else {
                console.log('No File Found');
            }
        }
        else if (type === 'files' || type === 'folders') {
            if (fs.existsSync(episodes[index].path)) {
                ipcRenderer.send('vlc:open', episodes[index].path);
            }
            else {
                console.log('No File Found');
            }
        }
    }

    if(episodes.length > 0 && type === 'episodes') {
        return (
            <>
                {episodes.map((episode, i) => (
                    <div key={i} className={Object.hasOwn(episode, 'directory') ? 'card-container hasDirectory' : 'card-container'} onClick={Object.hasOwn(episode, 'directory') ? () => handleClick(i) : undefined}>
                        <div className='episode-image-container'>
                            <img className='episode-image' loading='lazy' src={episode.still_path} />
                            {Object.hasOwn(episode, 'directory') ? <BiPlayCircle className='episode-play-icon' /> : null}
                        </div>
                        <div className='episode-info-container'>
                            <div className='episode-main-info'>
                                <div className='episode-title-container'>
                                    {episode.name && episode.episode_number ? <h6 className='episode-title'>{episode.episode_number}. {episode.name}</h6> : null}
                                    {Object.hasOwn(episode, 'directory') ? <IoIosCheckmarkCircle className='episode-checkmark-icon' title='Ready To Play'/> : null}
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
    else if (episodes.length > 0 && type === 'files') {
        return (
            <>
                {episodes.map((episode, i) => (
                    <div key={i} className='files-container' onClick={!episode.is_directory ? () => handleClick(i) : undefined}>
                        <p className='files-title'>{episode.file_name}</p>
                    </div>
                ))}
            </>
        )
    }
    else if (type === 'folders') {
        return (
            <>
                {episodes.length > 0 ? (
                    episodes.map((episode, i) => (
                        <div key={i} className='files-container folders' onClick={!episode.is_directory ? () => handleClick(i) : undefined}>
                            <p className='files-title'>{episode.file_name}</p>
                        </div>
                    ))
                ) : (
                    <p className='files-title'>Folder Is Empty.</p>
                )}
            </>
        )
    }
    else {
        return (<p className='no-episodes-text'>No Episodes Available.</p>)
    }
};

EpisodeCard.defaultProps = {
    type: 'episodes'
}

export default EpisodeCard;