import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { dateNumbersToWords } from '../context/directory/DirectoryActions';
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Mousewheel, Navigation } from "swiper";
import '../assets/css/swiper/swiper.min.css';
import '../assets/css/swiper/a11y.min.css';
import '../assets/css/swiper/navigation.min.css';
import '../assets/css/NewEpisodesSlider.css';

const NewEpisodesSlider = ({episodes}) => {

    const navigate = useNavigate();
    const {directories} = useContext(DirectoryContext);

    const swiperParameters = {
        modules: [A11y, Mousewheel, Navigation],
        mousewheel: { enabled: true },
        watchSlidesProgress: true,
        lazy: { enabled: true },
        loop: true,
        observeParents: true,
        resistanceRatio: 0.8,
        navigation: {
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        },
        observer: true,
        speed: 600,
        threshold: 5,
    };

    const handleClick = (directory) => {
        if (directories.find((file) => file.id === Number(directory.id) && file.media_type === directory.media_type)) {
          navigate(directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`);
        }
        else {
          navigate(directory.media_type === 'tv' ? `/searched/series/${directory.id}` : directory.media_type === 'movie' ? `/searched/movie/${directory.id}` : `/unknown/${directory.id}`);
        }
    };

    if(episodes.length > 0) {
        return (
            <div className='new-episodes-slider-container'>
                <Swiper {...swiperParameters} className='swiper-new-episodes'>
                    {episodes.map((episode, i) => (
                        episode ? (
                            <SwiperSlide key={i} className='swiper-slide-new-episodes'>
                                <img onClick={() => handleClick(episode)} className="swiper-slide-new-episodes-image" loading="lazy" src={episode.poster_path} />
                                <div className="swiper-lazy-preloader"></div>
                                <div className="swiper-slide-new-episodes-content">
                                    <div className="content-text">Episode. {episode.next_episode.episode_number}</div>
                                    <div className="swiper-slide-new-episodes-title">{dateNumbersToWords(episode.next_episode.air_date)}</div>
                                </div>
                            </SwiperSlide>
                        ) : null
                    ))}
                </Swiper>
                <div className="swiper-button-prev new-episodes-btn-prev" />
                <div className="swiper-button-next new-episodes-btn-next" />
            </div>
        );
    }
    else {
        return (
            <div>
                <span className='loader'></span>
            </div>
        )
    }
};

export default NewEpisodesSlider;