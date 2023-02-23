import React, { useState, useEffect, useContext } from 'react';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import { useParams } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { getMediaObjectFromList, minutesToHours } from '../context/directory/DirectoryActions';
import EditModal from '../components/layout/EditModal.jsx';
import { IoPlaySharp } from 'react-icons/io5';
import { BsPlusCircle } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';

const UnknownFile = () => {

    const params = useParams();
    const {loading, dispatch} = useContext(DirectoryContext);

    useEffect(() => {
        // dispatch({ type: 'SET_LOADING' });
        const directoryItem = getMediaObjectFromList(params.id);
        console.log(directoryItem);
        // dispatch({ 
        //     type: 'GET_DIRECTORY',
        //     payload: directoryItem
        // });
    }, [dispatch, params.id]);

    if (!loading) {
        return (
            <div>UnknownFile</div>
        )
    }
    else {
        return (
            <div>
                <span className='loader'></span>
            </div>
        )
    }
};

export default UnknownFile;