import React, { useEffect, useContext, useState } from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addEpisodesInDirectoryToList, getOtherFilesInDirectory, addEpisodesToList, fetchEpisodesData, createEpisodesList } from '../context/directory/DirectoryActions';
import EpisodeCard from './EpisodeCard.jsx';
import { IoIosCheckmarkCircle } from 'react-icons/io';

const SeasonsList = ({directory, options, type}) => {

    const {directories} = useContext(DirectoryContext);
    const [active, setActive] = useState(0);
    const [seasonObject, setSeasonObject] = useState(directory.seasons[0]);
    const [otherEpisodes, setOtherEpisodes] = useState([]);

    useEffect(() => {
        if (Object.hasOwn(seasonObject, 'directory')) {
            const episodesList = addEpisodesInDirectoryToList(seasonObject, directories, directory.id);

            if (episodesList && episodesList.length > 0) {
                const otherFiles = getOtherFilesInDirectory(seasonObject, episodesList);

                if (otherFiles) {
                    const otherFilesFiltered = otherFiles.filter((file) => !file.is_directory);
                    setOtherEpisodes(otherFilesFiltered);
                }
            }
        }
    }, [seasonObject]);

    const getEpisodesAvailable = (episodesList) => {
        const availableEpisodes = episodesList.filter((episode) => Object.hasOwn(episode, 'directory'));
        return availableEpisodes.length;
    }

    const handleChange = async (e) => {
        if (type === 'directory') {
            const seasonObject = await addEpisodesToList(e.target.value, directory, directories);
            if (seasonObject) {
                setSeasonObject(seasonObject);
            }
            else {
                setSeasonObject(directory.seasons[e.target.value - 1]);
            }
        }
        else if (type === 'searched') {
            const response = await fetchEpisodesData(directory.id, e.target.value);
            const episodes = createEpisodesList(response);
    
            if (episodes) {
                const item = directory.seasons[e.target.value - 1];
                item.episodes = [...episodes];
                setSeasonObject(item);
            }
            else {
                setSeasonObject(directory.seasons[e.target.value - 1]);
            }
        }
    };

    if (Object.keys(seasonObject).length !== 0) {
        return (
            <div className='season-container'>
                <select className='seasons-select' onChange={handleChange}>
                    {options}
                </select>
                <div className='season-info-container'>
                    <img className='season-img' loading='lazy' src={seasonObject.poster_path} />
                    <div className='season-info'>
                        {Object.hasOwn(seasonObject, 'directory') ? (
                            seasonObject.name ? <p className='season-title'>{seasonObject.name} ({seasonObject.episodes.length > 0 && seasonObject.episodes[0].air_date ? seasonObject.episodes[0].air_date.substring(0,4) : 'Date Unavailable'}) <IoIosCheckmarkCircle className='checkmark-seasons' title='Season In Directory'/></p> : <p className='season-title'>No Season Name Available</p>
                        ) : (seasonObject.name ? <p className='season-title'>{seasonObject.name} ({seasonObject.episodes.length > 0 && seasonObject.episodes[0].air_date ? seasonObject.episodes[0].air_date.substring(0,4) : 'Date Unavailable'})</p> : <p className='season-title'>No Season Name Available</p>)}
                        <p className='season-overview'>{seasonObject.overview}</p>
                    </div>
                </div>
                <div className='tabs tabs-episodes'>
                    <a className={active === 0 ? 'episodes-header active-episodes' : 'episodes-header'} onClick={(e) => setActive(0)}>Episodes</a>
                    {otherEpisodes.length > 0 ? <a className={active === 1 ? 'episodes-header active-episodes' : 'episodes-header'} onClick={(e) => setActive(1)}>Other Files</a> : null}
                </div>
                {active === 0 && (
                    <div className='episodes-container'>
                        {seasonObject.episodes.length > 0 ? (
                            <div className='episodes-list-info'>
                                <p>Total Episodes: {seasonObject.episodes.length}</p>
                                <p>Available To Play: {getEpisodesAvailable(seasonObject.episodes)}</p>
                            </div>
                        ) : null}
                        <EpisodeCard episodes={seasonObject.episodes} />
                    </div>
                )}
                {active === 1 && (
                    <div className='episodes-container'>
                        <EpisodeCard episodes={otherEpisodes} type='files' />
                    </div>
                )}
            </div>
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