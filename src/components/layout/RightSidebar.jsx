import React from 'react';
import { NavLink } from 'react-router-dom';
import NewEpisodesSlider from '../NewEpisodesSlider.jsx';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const RightSidebar = ({toggleSidebar, isOpen}) => {
    return (
        <div className={isOpen ? 'sidebar-right' : 'sidebar-right-closed align-close'}>
            <div className={isOpen ? 'close-btn-right' : 'close-btn-right align-close'}>
                {isOpen ? <FaAngleDoubleRight onClick={toggleSidebar} /> : <FaAngleDoubleLeft onClick={toggleSidebar} />}
            </div>
            <div className='new-episodes-container'>
                <h4 className='new-episodes-header'>New Episodes This Week</h4>
                <NewEpisodesSlider />
            </div>
        </div>
    )
};

export default RightSidebar;