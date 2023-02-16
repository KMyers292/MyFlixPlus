import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import MovieItemView from '../components/layout/MovieItemView.jsx';
import SeriesItemView from '../components/layout/SeriesItemView.jsx';
import UnknownFileView from '../components/layout/UnknownFileView.jsx';
import { getMediaObjectFromList } from '../context/directory/DirectoryActions';

const DirectoryItem = () => {
    const params = useParams();
    const {directory, dispatch, loading} = useContext(DirectoryContext);

    useEffect(() => {

        dispatch({ type: 'SET_LOADING' });
        const directoryItem = getMediaObjectFromList(params.id);

        dispatch({ 
            type: 'GET_DIRECTORY',
            payload: directoryItem
        });

        console.log(directoryItem);
        
    }, [dispatch, params.id]);

    if (directory.media_type === 'movie' && !loading) {
        return (<MovieItemView directoryItem={directory} />)
    }
    else if (directory.media_type === 'tv' && !loading) {
        return (<SeriesItemView directoryItem={directory} />)
    }
    else if (!loading) {
        return (<UnknownFileView directoryItem={directory} />)
    }
    else {
        return (
            <div>
                <span className="loader"></span>
            </div>
        )
    }
};

export default DirectoryItem;