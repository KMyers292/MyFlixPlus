import React, {useContext} from 'react';
import Slider from '../components/Slider.jsx';
import Alert from '../components/layout/Alert.jsx';
import DirectoryContext from '../context/directory/DirectoryContext';
import { sortList } from '../context/directory/DirectoryActions';
import '../assets/css/App.css';

const DirectorySearchResults = () => {

    const {directories, loading} = useContext(DirectoryContext);

    if(!loading) {
        return (
            <div>
                <Alert />
                <h2 className="heading">Newly Added</h2>
                <Slider directoryList={sortList(directories, 'new')} />
                <h2 className="heading">Most Popular</h2>
                <Slider directoryList={sortList(directories, 'popular')} />
                <h2 className="heading">Most Popular</h2>
                <Slider directoryList={sortList(directories, 'popular')} />
            </div>
        )
    }
    else {
        return (
            <div>
                Loading...
            </div>
        )
    }
};

export default DirectorySearchResults;