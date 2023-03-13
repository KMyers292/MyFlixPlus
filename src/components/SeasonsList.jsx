import React, { useEffect, useContext, useState } from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addEpisodesInDirectoryToList, getOtherFilesInDirectory } from '../context/directory/DirectoryActions';
import EpisodeCard from './EpisodeCard.jsx';
import { IoIosCheckmarkCircle } from 'react-icons/io';

const SeasonsList = ({seasonObject, id}) => {

    const {directories} = useContext(DirectoryContext);
    const [active, setActive] = useState(0);
    const [episodes, setEpisodes] = useState([]);
    const [otherEpisodes, setOtherEpisodes] = useState([]);

    useEffect(() => {
        if (Object.hasOwn(seasonObject, 'directory')) {
            const episodesList = addEpisodesInDirectoryToList(seasonObject, directories, id);

            if (episodesList && episodesList.length > 0) {
                setEpisodes(episodesList);
                const otherFiles = getOtherFilesInDirectory(seasonObject, episodesList);

                if (otherFiles) {
                    const otherFilesFiltered = otherFiles.filter((file) => !file.is_directory);
                    setOtherEpisodes(otherFilesFiltered);
                }
            }
            else {
                setEpisodes(seasonObject.episodes);
            }
        }
        else {
            setEpisodes(seasonObject.episodes);
        }
    }, [seasonObject, id]);

    const getEpisodesAvailable = (episodesList) => {
        const availableEpisodes = episodesList.filter((episode) => Object.hasOwn(episode, 'directory'));
        return availableEpisodes.length;
    }

    if (Object.keys(seasonObject).length !== 0) {
        return (
            <>
                <div className='season-info-container'>
                    <img className='season-img' loading='lazy' src={seasonObject.poster_path} />
                    <div className='season-info'>
                        {Object.hasOwn(seasonObject, 'directory') ? (
                            seasonObject.name ? <p className='season-title'>{seasonObject.name} ({episodes && seasonObject.episodes.length > 0 && seasonObject.episodes[0].air_date ? seasonObject.episodes[0].air_date.substring(0,4) : 'Date Unavailable'}) <IoIosCheckmarkCircle className='checkmark-seasons' title='Season In Directory'/></p> : <p className='season-title'>No Season Name Available</p>
                        ) : (seasonObject.name ? <p className='season-title'>{seasonObject.name} ({episodes && seasonObject.episodes.length > 0 && seasonObject.episodes[0].air_date ? seasonObject.episodes[0].air_date.substring(0,4) : 'Date Unavailable'})</p> : <p className='season-title'>No Season Name Available</p>)}
                        <p className='season-overview'>{seasonObject.overview}</p>
                    </div>
                </div>
                <div className='tabs tabs-episodes'>
                    <a className={active === 0 ? 'episodes-header active-episodes' : 'episodes-header'} onClick={(e) => setActive(0)}>Episodes</a>
                    {otherEpisodes.length > 0 ? <a className={active === 1 ? 'episodes-header active-episodes' : 'episodes-header'} onClick={(e) => setActive(1)}>Other Files</a> : null}
                </div>
                {active === 0 && (
                    <div className='episodes-container'>
                        {episodes && episodes.length > 0 ? (
                            <div className='episodes-list-info'>
                                <p>Total Episodes: {seasonObject.episodes.length}</p>
                                <p>Available To Play: {getEpisodesAvailable(seasonObject.episodes)}</p>
                            </div>
                        ) : null}
                        <EpisodeCard episodes={episodes} />
                    </div>
                )}
                {active === 1 && (
                    <div className='episodes-container'>
                        <EpisodeCard episodes={otherEpisodes} type='files' />
                    </div>
                )}
            </>
        )
    }
    else {
        return (
            <div>
                <span className='loader'></span>
            </div>
        )
    }
};

export default SeasonsList;