import React from 'react';
import { Link } from 'react-router-dom';
import {IoIosArrowForward, IoIosArrowBack, IoMdMore, IoMdCreate} from 'react-icons/io';
import {useBlazeSlider} from 'react-blaze-slider';
import '../assets/css/App.css';
import '../assets/css/slider.css';

const Slider = ({directoryList, type}) => {

    if(type === 'scrolling') {

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
        });

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

        const ref = useBlazeSlider({
            all: {
                slidesToScroll: 5,
                slidesToShow: 5
                }
        });

        return (
            <div ref={ref} className="blaze-slider">
                <div className="blaze-container blaze-container-static">
                    <div className="blaze-track">
                        {Object.values(directoryList).map((directory, i) => (
                            <div key={i}>
                                <Link to={`/${directory.id}/${directory.media_type}`} className="card-link">
                                    <div className="blaze-card blaze-card-static" style={ directory.backdrop_path ? { backgroundImage: "url(" + `https://image.tmdb.org/t/p/w400/${directory.backdrop_path}` + ")", backgroundSize: "100% 100%"} : {backgroundImage: "url(" + "D:/Projects/Electron/MyFlix_javascript/assets/no_image.jpg" + ")", backgroundSize: "100% 100%"}}>
                                    </div>
                                </Link>
                                <div className='card-info'>
                                    <p title={directory.title}>{directory.title.length > 25 ? directory.title.substring(0,25) + "..." : directory.title}</p>
                                    <p>{Math.round(directory.vote_average * 10)}%</p>
                                </div>
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