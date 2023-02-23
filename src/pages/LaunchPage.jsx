import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getFileDataInDirectory } from '../context/directory/DirectoryActions';

const LaunchPage = () => {

    const navigate = useNavigate();
    const {dispatch, loading} = useContext(DirectoryContext);

    const handleClick = async () => {
        const savedDirectory = sessionStorage.getItem('savedDirectory') || '';

        if(!savedDirectory) {
            navigate('/getStarted');
        }

        dispatch({type: 'SET_LOADING'});

        const directories = await getFileDataInDirectory(savedDirectory);

        dispatch({
            type: 'GET_DIRECTORIES',
            payload: directories
        });

        navigate('/results');
    }

    return (
        <div className='launch-container'>
            <h1 className='launch-title'>MYFLIX+</h1>
            {loading ? (
                <div>
                    <span className='loader'></span>
                    <p>Reading Directory...</p>
                </div>
            ) : (
                <div>
                    <button className='launch-btn' onClick={handleClick}>Get Started</button>
                </div>
            )}
        </div>
    )
};

export default LaunchPage;