import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { filterNewEpisodes } from '../../context/directory/DirectoryActions';
import NewEpisodesSlider from '../NewEpisodesSlider.jsx';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const RightSidebar = ({toggleSidebar, isOpen}) => {

    const [newEpisodesList, setNewEpisodesList] = useState([]);

    useEffect(() => {
        const newEpisodes = filterNewEpisodes();
        if (newEpisodes) {
            setNewEpisodesList(newEpisodes);
        }
    }, []);

    return (
        <div className={isOpen ? 'sidebar-right' : 'sidebar-right-closed align-close'}>
            <div className={isOpen ? 'close-btn-right' : 'close-btn-right align-close'}>
                {isOpen ? <FaAngleDoubleRight onClick={toggleSidebar} /> : <FaAngleDoubleLeft onClick={toggleSidebar} />}
            </div>
            <div className='new-episodes-container'>
                <h4 className='new-episodes-header'>New Episodes Coming Soon</h4>
                <NewEpisodesSlider episodes={newEpisodesList} />
            </div>
        </div>
    )
};

export default RightSidebar;