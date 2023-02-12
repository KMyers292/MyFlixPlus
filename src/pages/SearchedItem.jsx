import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { addDetailedDataToList } from '../context/directory/DirectoryActions';
import MovieItemView from '../components/layout/MovieItemView.jsx';
import SeriesItemView from '../components/layout/SeriesItemView.jsx';
import UnknownFileView from '../components/layout/UnknownFileView.jsx';

const SearchedItem = () => {
    const params = useParams();
    const {searchedItem, dispatch, loading} = useContext(DirectoryContext);

    useEffect(() => {

        dispatch({ type: 'SET_LOADING' });

        const getData = async () => {
            let data = {
                media_type: params.mediaType,
                id: params.id,
                searchedItem: true
            }
            
            await addDetailedDataToList(data);

            console.log(data);

            dispatch({ 
                type: 'GET_SEARCHED_ITEM',
                payload: data
            });
        }

        getData();

    }, [dispatch, params.id, params.mediaType]);

    if (searchedItem.media_type === 'movie' && !loading) {
        return (<MovieItemView directoryItem={searchedItem} />)
    }
    else if (searchedItem.media_type === 'tv' && !loading) {
        return (<SeriesItemView directoryItem={searchedItem} />)
    }
    else if (!loading) {
        return (<UnknownFileView directoryItem={searchedItem} />)
    }
    else {
        return (
            <div>
                <span className="loader"></span>
            </div>
        )
    }
};

export default SearchedItem;