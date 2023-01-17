import React, {useRef, useEffect, useState, useContext} from 'react';
import {Button, Modal, Form, Card, ListGroup, Row, Col} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {IoIosArrowForward, IoIosArrowBack, IoMdMore, IoMdCreate} from 'react-icons/io';
import EditForm from './EditForm.jsx';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getDirectoryFiles, getDirectory, getTmdbMediaList, replaceMediaItem } from '../context/directory/DirectoryActions';
import '../assets/css/App.css';

const Carousel = ({directoryList, heading}) => {

    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [tmdbList, setTmdbList] = useState([]);
    const [directories, setDirectories] = useState(directoryList);
    const {directory, dispatch, loading} = useContext(DirectoryContext);
    const navigate = useNavigate();

    const handleClose = () => {
        setShow(false);
        setTmdbList([]);
        setTitle("");
    };

    const handleShow = (id) => {
        const directoryItem = getDirectory(id);

        dispatch({ 
            type: 'GET_DIRECTORY',
            payload: directoryItem
        });

        setShow(true);
    };

    const handleSubmit = async () => {
        if(title) {
            const result = await getTmdbMediaList(title);
            setTmdbList(result);
        }
    };

    const handleClick = async (item, directoryId) => {
        const newList = replaceMediaItem(item, directoryId);
        setShow(false);
        setTmdbList([]);
        setTitle("");

        const savedDirectory = sessionStorage.getItem('savedDirectory', savedDirectory) || '';

        dispatch({
            type: 'GET_DIRECTORIES',
            payload: newList
        });

        setDirectories(newList);
    };

    const sliders = useRef(null);
    const imgRef = useRef(null);
    let scrollAmount = 0;
    let imagePadding;

    if(window.innerWidth >= 1460) {
        imagePadding = 600;
    }
    else if(window.innerWidth >= 1040) {
        imagePadding = 400;
    }
    else if(window.innerWidth >= 600) {
        imagePadding = 200;
    }
    else if(window.innerWidth >= 415) {
        imagePadding = 100;
    }
    else {
        imagePadding = 20;
    }

    let scrollPerClick;
    let slidersCurrent;

    const sliderScrollLeft = () => {
        slidersCurrent.scrollTo({
            top: 0,
            left: (scrollAmount -= scrollPerClick),
            behavior: "smooth"
        });

        if(scrollAmount < 0) {
            scrollAmount = 0;
        }
    }

    const sliderScrollRight = () => {
        if(scrollAmount <= slidersCurrent.scrollWidth - slidersCurrent.clientWidth) {
            slidersCurrent.scrollTo({
                top: 0,
                left: (scrollAmount += scrollPerClick),
                behavior: "smooth"
            });
        }
    }

    useEffect(() => {
        scrollPerClick = imgRef.current.clientWidth + imagePadding;
        slidersCurrent = sliders.current;
    });

    return (
        <div className="carousel">
            <div className="heading">{heading}</div>
            <div ref={sliders} className="carousel-box">
                {Object.values(directoryList).map((directory, i) => (
                    <div className="carousel-card-box" key={i}>
                        <Link to={`/${directory.id}`}>
                            {directory.poster_path ? <img ref={imgRef} className='img-box' src={`http://image.tmdb.org/t/p/w400/${directory.poster_path}`} /> : 
                            <img ref={imgRef} className='img-box' src='D:\Projects\Electron\MyFlix_javascript\assets\no_image.jpg' />}
                        </Link>
                        <IoMdMore className="img-overlay" onClick={() => handleShow(directory.id)}/>
                    </div>
                ))}
            </div>
            <a onClick={sliderScrollLeft} className="switch-left slider-button"><IoIosArrowBack className="arrows"/></a>
            <a onClick={sliderScrollRight} className="switch-right slider-button"><IoIosArrowForward className="arrows"/></a>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">{directory.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="modal-text">Not The Movie Or Show You Were Expecting?</p>
                    <p className="modal-text">Search For What You Want Below:</p>
                    <Form onSubmit={handleSubmit} className="modal-form-box">
                        <Form.Group className="modal-form-group" controlId="title">
                            <Form.Control className="modal-form" type="name" onChange={(e) => setTitle(e.target.value)} placeholder="Enter Show Or Movie Title Here" />
                            <Button variant="primary" type="submit">Search</Button>
                        </Form.Group>
                    </Form>
                    <Row xs={1} md={2} className="g-4">
                        {tmdbList.map((item, i) => (
                            <Col key={i} className="modal-card-box">
                                <Card className="modal-card" onClick={() => handleClick(item, directory.id)}>
                                    <Row>
                                        <Col>
                                            <Card.Img className="modal-card-img" src={item.poster_path ? `http://image.tmdb.org/t/p/w200/${item.poster_path}` : 'D:\\Projects\\Electron\\MyFlix_javascript\\assets\\no_image.jpg'} alt="..."/>
                                        </Col>
                                        <Col>
                                            <Card.Body>
                                                <Card.Title>{item.media_type === 'movie' ? item.title : item.name}</Card.Title>
                                                <Card.Text>{item.overview}</Card.Text>
                                            </Card.Body>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item>{directory.release ? directory.release.substring(0,4) : "Release: N/A"}</ListGroup.Item>
                                                <ListGroup.Item>A second Item</ListGroup.Item>
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <p className="modal-text">Still Can't Find Exactly What You Want, Or Want To Change Something?</p>
                    <Button>Edit Info</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};

export default Carousel;