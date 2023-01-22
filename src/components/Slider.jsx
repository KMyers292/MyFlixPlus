import React from 'react';
import { Link } from 'react-router-dom';
import {IoIosArrowForward, IoIosArrowBack, IoMdMore, IoMdCreate} from 'react-icons/io';
import {useBlazeSlider} from 'react-blaze-slider';
import '../assets/css/App.css';
import '../assets/css/slider.css';

const Slider = ({directoryList, type}) => {

    const ref = useBlazeSlider({
        all: {
            slidesToScroll: 4,
            slidesToShow: 4
            },
            "(max-width: 900px)": {
            slidesToScroll: 2,
            slidesToShow: 2,
            slidesGap: "40px"
            },
            "(max-width: 500px)": {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    })

    if(type === 'scrolling') {
        return (
            <div ref={ref} className="blaze-slider slider-scrolling">
                <a className="blaze-prev"><IoIosArrowBack/></a>
                <a className="blaze-next"><IoIosArrowForward/></a>
                <div className="blaze-container blaze-container-scrolling">
                    <div className="blaze-track">
                        {Object.values(directoryList).map((directory, i) => (
                            <div className="blaze-card blaze-card-scrolling" key={i} style={ directory.poster_path ? { backgroundImage: "url(" + `https://image.tmdb.org/t/p/w400/${directory.poster_path}` + ")", backgroundSize: "100% 100%"} : {backgroundImage: "url(" + "D:/Projects/Electron/MyFlix_javascript/assets/no_image.jpg" + ")", backgroundSize: "100% 100%"}}>
                                <Link to={`/${directory.id}`} className="card-link">
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    else if (type === 'static') {
        return (
            <div ref={ref} className="blaze-slider">
                <div className="blaze-container blaze-container-static">
                    <div className="blaze-track">
                        {Object.values(directoryList).map((directory, i) => (
                            <div className="blaze-card blaze-card-static" key={i} style={ directory.backdrop_path ? { backgroundImage: "url(" + `https://image.tmdb.org/t/p/w400/${directory.backdrop_path}` + ")", backgroundSize: "100% 100%"} : {backgroundImage: "url(" + "D:/Projects/Electron/MyFlix_javascript/assets/no_image.jpg" + ")", backgroundSize: "100% 100%"}}>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
};

Slider.defaultProps = {
    type: "scrolling"
}

export default Slider;