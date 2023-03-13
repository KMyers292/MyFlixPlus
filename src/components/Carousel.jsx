import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Mousewheel, Navigation } from "swiper";
import '../assets/css/swiper/swiper.min.css';
import '../assets/css/swiper/a11y.min.css';
import '../assets/css/swiper/navigation.min.css';
import '../assets/css/Carousel.css';

const Carousel = ({directoryList}) => {

    const navigate = useNavigate();
    const {directories} = useContext(DirectoryContext);
    const [smallerDirectoryList, setSmallerDirectoryList] = useState([]);

    useEffect(() => {
        if (directoryList.length > 5) {
            const subset = Math.floor(directoryList.length / 6) * 6;
            const lessResults = directoryList.slice(0, Math.min(subset, 30));
            setSmallerDirectoryList(lessResults);
        }
        else {
            setSmallerDirectoryList(directoryList);
        }
    }, [directoryList]);

    const swiperParameters = {
        modules: [A11y, Mousewheel, Navigation],
        observer: true,
        observeParents: true,
        loop: true,
        watchSlidesProgress: true,
        mousewheel: { enabled: true },
        spaceBetween: 15,
        slidesPerView: 6,
        slidesPerGroup: 6,
        lazy: { enabled: true },
        navigation: true,
    };

    const handleClick = (directory) => {
        if (directories.find((file) => file.id === Number(directory.id) && file.media_type === directory.media_type)) {
            navigate(directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`);
        }
        else {
            navigate(directory.media_type === 'tv' ? `/searched/series/${directory.id}` : directory.media_type === 'movie' ? `/searched/movie/${directory.id}` : `/unknown/${directory.id}`);
        }
    };

    return (
        <div className='carousel-container'>
            <Swiper {...swiperParameters} className='swiper-carousel'>
                {smallerDirectoryList.length > 6 ? <div className="nav-background-carousel"></div> : null}
                {smallerDirectoryList.length > 6 ? <div className="nav-background-carousel-right"></div> : null}
                {smallerDirectoryList.map((directory, i) => (
                    directory ? (
                        <SwiperSlide key={i} onClick={() => handleClick(directory)} className='swiper-slide-carousel'>
                            <img className="swiper-slide-carousel-image" loading="lazy" src={directory.poster_path ? directory.poster_path : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png'} />
                            <div className="swiper-lazy-preloader"></div>
                            <div className="swiper-slide-carousel-content">
                                <img className="content-image" loading="lazy" src={directory.poster_path ? directory.poster_path : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png'} />
                                <div className="swiper-slide-carousel-title">{directory.title}</div>
                            </div>
                        </SwiperSlide>
                    ) : null
                ))}
            </Swiper>
        </div>
    )
};

export default Carousel;