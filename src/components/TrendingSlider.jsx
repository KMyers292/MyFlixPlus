import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectCoverflow, Mousewheel, Navigation, Pagination } from "swiper";
import '../assets/css/swiper/swiper.min.css';
import '../assets/css/swiper/a11y.min.css';
import '../assets/css/swiper/navigation.min.css';
import '../assets/css/swiper/pagination.min.css';
import '../assets/css/TrendingSlider.css';

const TrendingSlider = ({trendingList}) => {
    
    const swiperParameters = {
      modules: [A11y, Autoplay, EffectCoverflow, Mousewheel, Navigation, Pagination],
      effect: "coverflow",
      lazy: { enabled: true },
      coverflowEffect: { stretch: 100 },
      pagination: { clickable: true },
      mousewheel: { enabled: true },
      observeParents: true,
      autoplay: {
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        enabled: true,
        delay: 4000,
      },
      centeredSlides: true,
      navigation: true,
      slidesPerView: "auto",
      loop: true,
      watchSlidesProgress: true,
      observer: true,
      speed: 1000,
    };
    return (
      <>
        <Swiper {...swiperParameters} className='trending-slider'>
            <div className="nav-background"></div>
            <div className="nav-background-right"></div>
            {trendingList.map((trending, i) => (
                trending ? (
                    <SwiperSlide key={i} onClick={() => handleClick(trending)}>
                        <img className="swiper-slide-trending-image" loading="lazy" src={trending.backdrop_path ? `https://image.tmdb.org/t/p/original/${trending.backdrop_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png'} />
                        <div className="swiper-lazy-preloader"></div>
                        <div className="swiper-slide-trending-content">
                            <div className="swiper-slide-trending-title"><p>{trending.title || trending.name}</p></div>
                            <div className="swiper-slide-trending-text">
                                <p>{trending.overview}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ) : null
            ))}
        </Swiper>
      </>
    );
};

export default TrendingSlider;