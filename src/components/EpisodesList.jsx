import React, { useEffect, useContext, useState } from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addEpisodesInDirectoryToList } from '../context/directory/DirectoryActions';
import Card from './Card.jsx';
import '../assets/css/App.css';

const EpisodesList = ({episodesList}) => {

    const [episodes, setEpisodes] = useState([]);
    const {directories} = useContext(DirectoryContext);

    useEffect(() => {
        if (episodesList.hasOwnProperty('directory')) {
            const list = addEpisodesInDirectoryToList(episodesList, directories);
            setEpisodes(list);
        }
        else {
            setEpisodes(episodesList.episodes);
        }
    }, []);

    if (Object.keys(episodesList).length !== 0) {
        return (
            <div>
                <div className='season-info-container'>
                    {episodesList.poster_path ? <img className='season-img' loading="lazy" src={`https://image.tmdb.org/t/p/w200/${episodesList.poster_path}`}/> : null}
                    <div className='season-info'>
                        {episodesList.name ? <p className='season-title'>{episodesList.name} ({episodesList.episodes[0].air_date.substring(0,4)})</p> : null}
                        {episodesList.overview ? <p className='season-overview'>{episodesList.overview}</p> : null}
                    </div>
                </div>
                <h4 className='episodes-header'>Episodes ({episodesList.episodes.length})</h4>
                <Card episodes={episodes} />
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