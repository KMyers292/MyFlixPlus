import React from 'react';
import { Link } from 'react-router-dom';
import {IoIosArrowForward, IoIosArrowBack, IoMdMore, IoMdCreate} from 'react-icons/io';
import {useBlazeSlider} from 'react-blaze-slider';
import '../assets/css/App.css';
import '../assets/css/slider.css';

const Slider = ({directoryList}) => {

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

    return (
        <div ref={ref} className="blaze-slider">
            <a className="blaze-prev"><IoIosArrowBack/></a>
            <a className="blaze-next"><IoIosArrowForward/></a>
            <div className="blaze-container">
                <div className="blaze-track">
                    {Object.values(directoryList).map((directory, i) => (
                        <div className="blaze-card" key={i} style={ directory.poster_path ? { backgroundImage: "url(" + `http://image.tmdb.org/t/p/w400/${directory.poster_path}` + ")", backgroundSize: "100% 100%"} : {backgroundImage: "url(" + "D:/Projects/Electron/MyFlix_javascript/assets/no_image.jpg" + ")", backgroundSize: "100% 100%"}}>
                            <Link to={`/${directory.id}`} className="card-link">
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default Slider;