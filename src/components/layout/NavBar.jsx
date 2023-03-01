import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoArrowForward, IoSearchSharp } from 'react-icons/io5';
import {Navbar, Container, Button, Form} from 'react-bootstrap';

const NavBar = () => {

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
            // const results = await fetchBasicData(title);
            // setResults(results);
            // getResults(results, title);
        }
    }

    return (
        <Navbar expand='lg' variant='dark' className='navbar' sticky='top'>
            <Container fluid className='nav-container'>
                <Navbar.Brand href='#' className='nav-brand'>Name TBD</Navbar.Brand>
                <IoArrowBack className='nav-back-btn' onClick={handleClick} />
                <IoArrowForward className='nav-back-btn' onClick={handleClickForward} />
                <Navbar.Toggle aria-controls='basic-navbar-nav' className='nav-toggle' />
                <Navbar.Collapse className='justify-content-end'>
                    <form onSubmit={submitHandler} className='edit-search-form'>
                        <div className='nav-form-group'>
                            <input
                                className='modal-search-input'
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
                        </div>
                    </form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default NavBar;
