import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Navbar, Container, Nav, Button, Form} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IoArrowBack } from "react-icons/io5";
import { GrSearch } from 'react-icons/gr';
import { RiMovie2Line } from "react-icons/ri";
import '../../assets/css/App.css';

const NavBar = () => {

    const navigate = useNavigate();
    const [text, setText] = useState('');

    const handleChange = (event) => {
        setText(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if(text === '') {
            // setAlert('Please Enter Something', 'error');
        }
        else {


            setText('');
        }
    }

    const handleClick = () => {
        navigate(-1);
    }

    return (
        <Navbar expand="lg" variant="dark" className="navbar" sticky="top">
            <Container fluid className="nav-container">
                <Navbar.Brand href="#" className="nav-brand">MYFLIX+</Navbar.Brand>
                <IoArrowBack className="nav-back-btn" onClick={handleClick} />
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="nav-toggle" />
                <Navbar.Collapse className='justify-content-end'>
                    <Form className="d-flex">
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2 search-box"
                        aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default NavBar;
