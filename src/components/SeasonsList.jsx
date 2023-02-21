import React, { useEffect, useContext, useState } from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addEpisodesInDirectoryToList, getOtherFilesInDirectory } from '../context/directory/DirectoryActions';
import EpisodeCard from './EpisodeCard.jsx';
import {IoIosCheckmarkCircle} from 'react-icons/io';

const SeasonsList = ({episodesList, id}) => {

    const [episodes, setEpisodes] = useState([]);
    const [otherEpisodes, setOtherEpisodes] = useState({});
    const [active, setActive] = useState(0);
    const {directories} = useContext(DirectoryContext);

    useEffect(() => {
        if (Object.hasOwn(episodesList, 'directory')) {
            const list = addEpisodesInDirectoryToList(episodesList, directories, id);
            setEpisodes(list);
            const otherFiles = getOtherFilesInDirectory(episodesList, list);
            if (otherFiles) {
                const otherFilesFiltered = otherFiles.filter((file) => !file.is_directory);
                setOtherEpisodes(otherFilesFiltered);
            }
        }
        else {
            setEpisodes(episodesList.episodes);
        }

        return () => {
            setEpisodes([]);
            setOtherEpisodes({});
        }
    }, [episodesList]);

    const getEpisodesAvailable = (list) => {
        const available = list.filter((episode) => episode.hasOwnProperty('directory'));
        return available.length;
    }

    if (Object.keys(episodesList).length !== 0) {
        return (
            <div>
                <div className='season-info-container'>
                    <img className='season-img' loading="lazy" src={episodesList.poster_path} />
                    <div className='season-info'>
                        {episodesList.hasOwnProperty('directory') ? (
                            episodesList.name ? <p className='season-title'>{episodesList.name} ({episodesList.episodes[0].air_date.substring(0,4)}) <IoIosCheckmarkCircle className='checkmark-seasons' title='Season In Directory'/></p> : <p className='season-title'>No Season Name Available</p>
                        ) : (episodesList.name ? <p className='season-title'>{episodesList.name} ({episodesList.episodes[0].air_date.substring(0,4)})</p> : <p className='season-title'>No Season Name Available</p>)}
                        {episodesList.overview ? <p className='season-overview'>{episodesList.overview}</p> : <p className='season-overview'>No Overview Available</p>}
                    </div>
                </div>
                <div className='tabs tabs-episodes'>
                    <a className={active === 0 ? 'episodes-header active-episodes' : 'episodes-header'} onClick={(e) => setActive(0)}>Episodes</a>
                    {Object.keys(otherEpisodes).length !== 0 ? <a className={active === 1 ? 'episodes-header active-episodes' : 'episodes-header'} onClick={(e) => setActive(1)}>Other Files</a> : null}
                </div>
                {active === 0 && (
                    <div className='episodes-container'>
                        <div className='episodes-list-info'>
                            <p>Total Episodes: {episodesList.episodes.length}</p>
                            <p>Available To Play: {getEpisodesAvailable(episodesList.episodes)}</p>
                        </div>
                        <EpisodeCard episodes={episodes} />
                    </div>
                )}
                {active === 1 && (
                    <div className='episodes-container'>
                        <EpisodeCard episodes={otherEpisodes} type="files" />
                    </div>
                )}
            </div>
        )
    }
    else {
        return (
            <div>
                <span className="loader"></span>
            </div>
        )
    }
};

export default SeasonsList;