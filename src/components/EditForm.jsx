import React, {useEffect, useState, useContext} from 'react';
import {Button, Form} from 'react-bootstrap';
import DirectoryContext from '../context/directory/DirectoryContext';
import '../assets/css/App.css';

const EditForm = () => {

    const [title, setTitle] = useState("");
    const [mediaType, setMediaType] = useState("");

    const {directory, dispatch, loading} = useContext(DirectoryContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(title);
        console.log(mediaType);
    }

    useEffect(() => {
        setTitle(directory.name ? directory.name : directory.original_title ? directory.original_title : directory.file_name);
        setMediaType(directory.media_type);
    }, []);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="mediaType">
                <Form.Label>Movie or TV Series?</Form.Label>
                <Form.Check name="mediaType" id="tv" type="radio" label="Series" value="tv" defaultChecked={directory.media_type === 'tv'} onChange={(e) => setMediaType(e.target.value)} />
                <Form.Check name="mediaType" id="movie" type="radio" label="Movie" value="movie" defaultChecked={directory.media_type === 'movie'} onChange={(e) => setMediaType(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="name" placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)} value={title} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
};

export default EditForm;