import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBasicData } from '../../context/directory/DirectoryActions';
import { IoArrowBack, IoArrowForward, IoSearchSharp } from 'react-icons/io5';

const NavBar = ({getResults}) => {

    const navigate = useNavigate();
    const [text, setText] = useState('');

    const handleClick = () => {
        navigate(-1);
    }

    const handleClickForward = () => {
        navigate(1);
    }


    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (text) {
            const results = await fetchBasicData(text);
            getResults(results, text);
            navigate('/search');
            setText('');
        }
    }

    return (
        <nav className='main-nav'>
            <div className='nav-links'>
                <h1 className='nav-brand'>NameTBD</h1>
                <IoArrowBack className='nav-back-btn' onClick={handleClick} />
                <IoArrowForward className='nav-back-btn' onClick={handleClickForward} />
            </div>
            <form onSubmit={submitHandler} className='nav-search-bar'>
                <input
                    className='nav-search-input'
                    type='text' 
                    id='newMedia' 
                    name='newMedia' 
                    placeholder='Search...'
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    required 
                />
                <button type='submit' className='search-submit-btn' >
                    <IoSearchSharp className='submit-icon' />
                </button>
            </form>
        </nav>
    )
};

export default NavBar;
