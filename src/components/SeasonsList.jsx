import React, { useEffect, useContext, useState } from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addEpisodesInDirectoryToList, getUnknownFilesInDirectory } from '../context/directory/DirectoryActions';
import EpisodeCard from './EpisodeCard.jsx';
import {IoIosCheckmarkCircle} from 'react-icons/io';

const SeasonsList = ({episodesList, id}) => {

    const [episodes, setEpisodes] = useState([]);
    const [unknownEpisodes, setUnknownEpisodes] = useState([]);
    const [active, setActive] = useState(0);
    const {directories} = useContext(DirectoryContext);

    useEffect(() => {
        console.log(episodesList);
        if (episodesList.hasOwnProperty('directory')) {
            const list = addEpisodesInDirectoryToList(episodesList, directories, id);
            setEpisodes(list);
            const unknownFiles = getUnknownFilesInDirectory(episodesList);
            setUnknownEpisodes(unknownFiles);
        }
        else {
            setEpisodes(episodesList.episodes);
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
                    {episodesList.poster_path ? <img className='season-img' loading="lazy" src={`https://image.tmdb.org/t/p/w200/${episodesList.poster_path}`}/> : null}
                    <div className='season-info'>
                        {episodesList.hasOwnProperty('directory') ? (
                            episodesList.name ? <p className='season-title'>{episodesList.name} ({episodesList.episodes[0].air_date.substring(0,4)}) <IoIosCheckmarkCircle className='checkmark-seasons' title='Season In Directory'/></p> : null
                        ) : (episodesList.name ? <p className='season-title'>{episodesList.name} ({episodesList.episodes[0].air_date.substring(0,4)})</p> : null)}
                        {episodesList.overview ? <p className='season-overview'>{episodesList.overview}</p> : null}
                    </div>
                </div>
                <div className='tabs'>
                    <a className={active === 0 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(0)}>Episodes</a>
                    {Object.keys(unknownEpisodes).length !== 0 ? <a className={active === 1 ? 'episodes-header active' : 'episodes-header'} onClick={(e) => setActive(1)}>Unknown Files</a> : null}
                </div>
                {active === 0 && (
                    <div>
                        <div className='episodes-list-info'>
                            <p>Total Episodes: {episodesList.episodes.length}</p>
                            <p>Available To Play: {getEpisodesAvailable(episodesList.episodes)}</p>
                        </div>
                        <EpisodeCard episodes={episodes} />
                    </div>
                )}
                {active === 1 && (
                    <div>
                        <EpisodeCard episodes={unknownEpisodes} type="files" />
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