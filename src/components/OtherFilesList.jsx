import React, { useEffect, useState } from 'react';
import { getOtherFoldersList } from '../context/directory/DirectoryActions';
import EpisodeCard from './EpisodeCard.jsx';

const OtherFilesList = ({otherFiles}) => {

    const [selectedFolder, setSelectedFolder] = useState(otherFiles[0].path);
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
    }

    return (
        <div className='other-files-container'>
            <select className='seasons-select' value={selectedFolder} onChange={handleChange}>
                {otherFoldersOptions}
            </select>
            <EpisodeCard episodes={fileList} type='folders' />
        </div>
    )
};

export default OtherFilesList;