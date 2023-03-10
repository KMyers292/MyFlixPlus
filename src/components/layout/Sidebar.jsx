import React, { useContext } from 'react';
import DirectoryContext from '../../context/directory/DirectoryContext';
import { NavLink } from 'react-router-dom';
import { IoHomeOutline, IoCompassOutline, IoSettingsOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { BsBookmarkHeart } from 'react-icons/bs';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const Sidebar = ({toggleSidebar, isOpen}) => {

    const {directories} = useContext(DirectoryContext);

    if (directories.length > 0) {
        return (
            <div className={isOpen ? 'sidebar' : 'sidebar-closed align-close'}>
                <div className={isOpen ? 'close-btn' : 'close-btn align-close'}>
                    {isOpen ? <FaAngleDoubleLeft onClick={toggleSidebar} /> : <FaAngleDoubleRight onClick={toggleSidebar} />}
                </div>
                <NavLink to='/results' className={({isActive}) => isActive ? 'activeLink' : 'sidebar-link'}>
                    <IoHomeOutline /> {isOpen ? 'Home' : undefined}
                </NavLink>
                <NavLink to='/browse' className={({isActive}) => isActive ? 'activeLink' : 'sidebar-link'}>
                    <IoCompassOutline /> {isOpen ? 'Browse' : undefined}
                </NavLink>
                <NavLink to='/watchlist' className={({isActive}) => isActive ? 'activeLink' : 'sidebar-link'}>
                    <BsBookmarkHeart /> {isOpen ? 'Watch List' : undefined}
                </NavLink>
                <NavLink to='/settings' className={({isActive}) => isActive ? 'activeLink' : 'sidebar-link'}>
                    <IoSettingsOutline /> {isOpen ? 'Settings' : undefined}
                </NavLink>
                <NavLink to='/help' className={({isActive}) => isActive ? 'activeLink' : 'sidebar-link'}>
                    <IoInformationCircleOutline /> {isOpen ? 'Help' : undefined}
                </NavLink>
            </div>
        )
    }
    else {
        return (
            <div className='sidebar-not-loaded'>
            </div>
        )
    }
};

export default Sidebar;