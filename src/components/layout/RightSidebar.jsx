import React, { useContext, useEffect, useState } from 'react';
import DirectoryContext from '../../context/directory/DirectoryContext';
import { filterNewEpisodes } from '../../context/directory/DirectoryActions';
import NewEpisodesSlider from '../NewEpisodesSlider.jsx';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { IoIosNotificationsOutline } from "react-icons/io";

const RightSidebar = ({toggleSidebar, isOpen}) => {

    const {directories} = useContext(DirectoryContext);
    const [newEpisodesList, setNewEpisodesList] = useState([]);

    useEffect(() => {       
        const newEpisodes = filterNewEpisodes();
        newEpisodes.sort((a, b) => new Date(a.next_episode.air_date.replace(/-/g, '\/')) - new Date(b.next_episode.air_date.replace(/-/g, '\/')));
        if (newEpisodes) {
            setNewEpisodesList(newEpisodes);
        }
    }, [directories]);

    return (
        <div className={isOpen ? 'sidebar-right' : 'sidebar-right-closed align-close'}>
            <div className={isOpen ? 'close-btn-right' : 'close-btn-right align-close'}>
                {isOpen ? <FaAngleDoubleRight onClick={toggleSidebar} /> : <FaAngleDoubleLeft onClick={toggleSidebar} />}
            </div>
            <div className={isOpen ? 'notify-container' : 'notify-container-closed'}>
                <IoIosNotificationsOutline className="notify-icon" />
                <p className='notify-number'>{newEpisodesList.length}</p>
            </div>
            <div className={isOpen ? 'new-episodes-container' : 'new-episodes-container-closed'}>
                <h4 className='new-episodes-header'>New Episodes Coming Soon</h4>
                <NewEpisodesSlider episodes={newEpisodesList} />
            </div>
        </div>
    )
};

export default RightSidebar;