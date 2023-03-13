import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, EffectCoverflow, Mousewheel, Navigation, Pagination } from 'swiper';
import '../assets/css/swiper/swiper.min.css';
import '../assets/css/swiper/a11y.min.css';
import '../assets/css/swiper/navigation.min.css';
import '../assets/css/swiper/pagination.min.css';
import '../assets/css/TrendingSlider.css';

const TrendingSlider = ({trendingList}) => {

	const navigate = useNavigate();
	const {directories} = useContext(DirectoryContext);
    
	const swiperParameters = {
		modules: [A11y, Autoplay, EffectCoverflow, Mousewheel, Navigation, Pagination],
		effect: 'coverflow',
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
		slidesPerView: 'auto',
		loop: true,
		watchSlidesProgress: true,
		observer: true,
		speed: 1000,
	};

	const handleClick = (directory) => {
		if (directories.find((file) => file.id === Number(directory.id) && file.media_type === directory.media_type)) {
		navigate(directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`);
		}
		else {
		navigate(directory.media_type === 'tv' ? `/searched/series/${directory.id}` : directory.media_type === 'movie' ? `/searched/movie/${directory.id}` : `/unknown/${directory.id}`);
		}
  	};

  	if (trendingList && trendingList.length > 0) {
		return (
			<>
				<Swiper {...swiperParameters} className='trending-slider'>
					<div className='nav-background'></div>
					<div className='nav-background-right'></div>
					{trendingList.map((trending, i) => (
						trending ? (
							<SwiperSlide key={i} onClick={() => handleClick(trending)} className='trending-slide'>
								<img className='swiper-slide-trending-image' loading='lazy' src={trending.backdrop_path ? `https://image.tmdb.org/t/p/original/${trending.backdrop_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png'} alt={`Backdrop Poster For ${trending.title || trending.name}`} />
								<div className='swiper-lazy-preloader'></div>
								<div className='swiper-slide-trending-content'>
									<div className={trending.media_type === 'tv' ? 'series-badge' : 'movie-badge'}><p>{trending.media_type === 'tv' ? 'Series' : trending.media_type === 'movie' ? 'Movie' : null}</p></div>
									<div className='rating-badge'><p>{Math.round(trending.vote_average * 10)+ '%'}</p></div>
									<div className='swiper-slide-trending-title'>
										<p>{trending.title || trending.name} {directories.find((file) => file.id === Number(trending.id) && file.media_type === trending.media_type) ? <IoIosCheckmarkCircle className='checkmark-trending' title='In Directory'/> : null}</p>
									</div>
									<div className='swiper-slide-trending-text'>
										<p>{trending.overview.length > 310 ? trending.overview.substring(0, 310) + '...' : trending.overview}</p>
									</div>
								</div>
							</SwiperSlide>
						) : null
					))}
				</Swiper>
			</>
		);
  	}
  	else {
		return (
			<div className='loader-container'>
				<span className='loader'></span>
			</div>
		)
  	}
};

export default TrendingSlider;