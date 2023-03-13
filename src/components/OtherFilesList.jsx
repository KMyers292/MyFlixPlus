import React, { useEffect, useState } from 'react';
import { getOtherFoldersList } from '../context/directory/DirectoryActions';
import EpisodeCard from './EpisodeCard.jsx';

const OtherFilesList = ({otherFiles}) => {
    const [selectedFolder, setSelectedFolder] = useState(otherFiles.length > 0 ? otherFiles[0].path : []);
    const [otherFoldersOptions, setOtherFoldersOptions] = useState([]);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        let otherFolders = [];

        for (let i = 0; i < otherFiles.length; i++) {
            otherFolders.push(<option value={otherFiles[i].path} key={i}>{otherFiles[i].file_name}</option>);
        }

        setOtherFoldersOptions(otherFolders);

        const files = getOtherFoldersList(selectedFolder);
        if (files) {
            setFileList(files);
        }

        return () => {
            setOtherFoldersOptions([]);
            setFileList([]);
        }
    }, [otherFiles]);

    const handleChange = async (e) => {
        setSelectedFolder(e.target.value);

        const files = getOtherFoldersList(e.target.value);
        if (files) {
            setFileList(files);
        }
        else {
            setFileList([]);
        }
    }

    if (otherFiles && otherFiles.length > 0) {
        return (
            <div className='other-files-container'>
                {otherFoldersOptions.length > 0 ? (
                    <select className='seasons-select' value={selectedFolder} onChange={handleChange}>
                        {otherFoldersOptions}
                    </select>
                ) : null}
                <EpisodeCard episodes={fileList} type='folders' />
            </div>
        )
    }
    else {
        return (
            <div className='loader-container'>
                <span className='loader'></span>
            </div>
        )
    }
};

export default OtherFilesList;