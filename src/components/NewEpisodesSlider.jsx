import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Mousewheel, Navigation } from "swiper";
import '../assets/css/swiper/swiper.min.css';
import '../assets/css/swiper/a11y.min.css';
import '../assets/css/swiper/navigation.min.css';
import '../assets/css/NewEpisodesSlider.css';

const NewEpisodesSlider = () => {

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

    return (
        <div className='new-episodes-slider-container'>
            <Swiper {...swiperParameters} className='swiper-new-episodes'>
                <SwiperSlide className='swiper-slide-new-episodes'>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/01.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 1</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/02.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 2</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/03.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 3</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/04.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 4</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/05.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 5</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/06.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 6</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/07.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 7</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/08.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 8</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/09.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 9</div>
                </div>
                </SwiperSlide>
        
                <SwiperSlide>
                <img
                    className="swiper-slide-new-episodes-image"
                    loading="lazy"
                    src="https://studio.swiperjs.com/demo-images/nature/10.jpg"
                />
        
                <div className="swiper-lazy-preloader"></div>
        
                <div className="swiper-slide-new-episodes-content">
                    <div className="swiper-slide-new-episodes-title">Slide 10</div>
                </div>
                </SwiperSlide>
            </Swiper>
            <div className="swiper-button-prev new-episodes-btn-prev" />
            <div className="swiper-button-next new-episodes-btn-next" />
        </div>
    );
};

export default NewEpisodesSlider;