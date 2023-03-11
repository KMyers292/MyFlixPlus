import React, { useContext, useEffect, useState, useRef } from 'react';
import DirectoryContext from '../../context/directory/DirectoryContext';
import { filterNewEpisodes, filterNewMovies, areThereNewEpisodesToday, areThereNewMoviesToday } from '../../context/directory/DirectoryActions';
import NewEpisodesSlider from '../NewEpisodesSlider.jsx';
import NewMoviesSlider from '../NewMoviesSlider.jsx'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { RiTvLine, RiMovie2Line } from "react-icons/ri";

const RightSidebar = ({toggleSidebar, isOpen}) => {

    const {directories, watchlist} = useContext(DirectoryContext);
    const [newEpisodesList, setNewEpisodesList] = useState([]);
    const [newMoviesList, setNewMoviesList] = useState([]);
    const viewed = useRef(false);

    useEffect(() => {       
        const newEpisodes = filterNewEpisodes();
        if (newEpisodes) {
            newEpisodes.sort((a, b) => new Date(a.next_episode.air_date.replace(/-/g, '\/')) - new Date(b.next_episode.air_date.replace(/-/g, '\/')));
            setNewEpisodesList(newEpisodes);
        }
        const newMovies = filterNewMovies();
        if (newMovies) {
            newMovies.sort((a, b) => new Date(a.release.replace(/-/g, '\/')) - new Date(b.release.replace(/-/g, '\/')));
            setNewMoviesList(newMovies);
        }
    }, [watchlist, directories]);

    const handleClick = () => {
        toggleSidebar();
        if (!viewed.current) {
            viewed.current = true;
        }
    };

    if (directories.length > 0) {
        return (
            <div className={isOpen ? 'sidebar-right' : 'sidebar-right-closed align-close'}>
                <div className={isOpen ? 'close-btn-right' : 'close-btn-right align-close'}>
                    {isOpen ? <FaAngleDoubleRight onClick={toggleSidebar} /> : <FaAngleDoubleLeft onClick={handleClick} />}
                </div>
                <div className={isOpen ? 'notify-container' : 'notify-container-closed'}>
                    <RiTvLine className="notify-icon" />
                    {!viewed.current ? (
                        <p className={newEpisodesList.length > 9 ? 'notify-number-large' : 'notify-number'} title='New Episodes Out This Week'>{newEpisodesList.length}</p>
                    ) : areThereNewEpisodesToday() ? (
                        <p className='notify-episode-today' title='New Episodes Out Today'></p>
                    ) : null}
                </div>
                <div className={isOpen ? 'new-episodes-container' : 'new-episodes-container-closed'}>
                    <h4 className='new-episodes-header'>New Episodes Coming Soon</h4>
                    <NewEpisodesSlider episodes={newEpisodesList} />
                </div>
                <div className={isOpen ? 'notify-container' : 'notify-container-closed notify-movie'}>
                    <RiMovie2Line className="notify-icon" />
                    {!viewed.current ? (
                        <p className={newEpisodesList.length > 9 ? 'notify-number-large' : 'notify-number'} title='New Movies Out This Week'>{newEpisodesList.length}</p>
                    ) : areThereNewMoviesToday() ? (
                        <p className='notify-episode-today' title='New Movies Out Today'></p>
                    ) : null}
                </div>
                <div className={isOpen ? 'new-episodes-container' : 'new-episodes-container-closed'}>
                    <h4 className='new-episodes-header'>New Movies Coming Soon</h4>
                    <NewMoviesSlider episodes={newMoviesList} />
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="sidebar-right-closed">
            </div>
        )
    }
};

export default RightSidebar;