import React, { useEffect, useContext, useState } from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addEpisodesInDirectoryToList } from '../context/directory/DirectoryActions';
import EpisodeCard from './EpisodeCard.jsx';
import {IoIosCheckmarkCircle} from 'react-icons/io';
import '../assets/css/App.css';

const EpisodesList = ({episodesList, id}) => {

    const [episodes, setEpisodes] = useState([]);
    const {directories} = useContext(DirectoryContext);

    useEffect(() => {
        console.log(episodesList);
        if (episodesList.hasOwnProperty('directory')) {
            const list = addEpisodesInDirectoryToList(episodesList, directories, id);
            setEpisodes(list);
        }
        else {
            setEpisodes(episodesList.episodes);
        }
    }, [episodesList]);

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
                <h4 className='episodes-header'>Episodes ({episodesList.episodes.length})</h4>
                <EpisodeCard episodes={episodes} />
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

export default EpisodesList;