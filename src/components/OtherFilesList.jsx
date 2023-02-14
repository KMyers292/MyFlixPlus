import React, { useEffect, useState } from 'react';
import { getOtherFiles } from '../context/directory/DirectoryActions';
import EpisodeCard from './EpisodeCard.jsx';

const OtherFilesList = ({otherFiles}) => {

    const [otherFoldersOptions, setOtherFoldersOptions] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(otherFiles[0].path);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        let others = [];

        for (let i = 0; i < otherFiles.length; i++) {
            others.push(<option value={otherFiles[i].path} key={i}>{otherFiles[i].file_name}</option>);
        }

        setOtherFoldersOptions(others);

        const files = getOtherFiles(selectedFolder);
        if (files) {
            setFileList(files);
        }

    }, [otherFiles]);

    const handleChange = async (e) => {
        setSelectedFolder(e.target.value);

        const files = getOtherFiles(e.target.value);
        if (files) {
            setFileList(files);
        }
    }

    return (
        <div>
            <select className='seasons-select' value={selectedFolder} onChange={handleChange}>
                {otherFoldersOptions}
            </select>
            <EpisodeCard episodes={fileList} type="files" />
        </div>
    )
};

export default OtherFilesList;