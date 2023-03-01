import React, { useContext, useEffect, useState } from 'react';
import DirectoryContext from '../context/directory/DirectoryContext';
import Slider from '../components/Slider.jsx';
import Alert from '../components/layout/Alert.jsx';
import { sortList, fetchTrendingMedia, checkForNewEpisodes } from '../context/directory/DirectoryActions';
import Carousel from '../components/Carousel.jsx';
import TrendingSlider from '../components/TrendingSlider.jsx';

const DirectorySearchResults = () => {

    const [trending, setTrending] = useState([]);

    useEffect(() => {
        checkForNewEpisodes();
        const getData = async () => {
            const data = await fetchTrendingMedia();
            console.log(data);
            setTrending(data);
        };

        getData();
    }, []);

    const {directories, loading} = useContext(DirectoryContext);

    if(!loading && trending.length > 0) {
        return (
            <div className='results-container'>
                <h2 className='trending-header'>Top 10 Trending Today</h2>
                <TrendingSlider trendingList={trending} />
                <h2 className='heading'>Newly Added</h2>
                <Carousel directoryList={sortList(directories, 'new')} />
                <h2 className='heading'>Most Popular</h2>
                <Carousel directoryList={sortList(directories, 'popular')} />
            </div>
        )
    }
    else {
        return (
            <div>
                <span className='loader'></span>
                <p>Reading Directory...</p>
            </div>
        )
    }
};

export default DirectorySearchResults;