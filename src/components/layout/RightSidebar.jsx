import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const RightSidebar = ({toggleSidebar, isOpen}) => {
    return (
        <div className={isOpen ? 'sidebar-right' : 'sidebar-right-closed align-close'}>
            <div className={isOpen ? 'close-btn-right' : 'close-btn-right align-close'}>
                {isOpen ? <FaAngleDoubleRight onClick={toggleSidebar} /> : <FaAngleDoubleLeft onClick={toggleSidebar} />}
            </div>
            <div className='new-episodes-container'>
                <h4>New Episodes This Week</h4>
            </div>
        </div>
    )
};

export default RightSidebar;