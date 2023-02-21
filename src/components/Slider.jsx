import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import {IoIosArrowForward, IoIosArrowBack, IoIosCheckmarkCircle} from 'react-icons/io';
import {useBlazeSlider} from 'react-blaze-slider';
import '../assets/css/App.css';
import '../assets/css/slider.css';

const Slider = ({directoryList, type}) => {

    const {directories} = useContext(DirectoryContext);

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
                            <div className="blaze-card blaze-card-scrolling" key={i} style={{ backgroundImage: "url(" + `${directory.poster_path}` + ")", backgroundSize: "100% 100%"}}>
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
                slidesToScroll: 6,
                slidesToShow: 6
                }
        });

        return (
            <div ref={ref} className="blaze-slider">
                <div className="blaze-container blaze-container-static">
                    <div className="blaze-track">
                        {Object.values(directoryList).map((directory, i) => (
                            directory ? (
                                <div key={i}>
                                    <Link to={directories.find((file) => file.id === Number(directory.id)) ? `/${directory.id}` : `/searched/${directory.id}/${directory.media_type}`} className="card-link">
                                        <div className="blaze-card blaze-card-static" title={directory.title} style={{ backgroundImage: "url(" + `${directory.backdrop_path}` + ")", backgroundSize: "100% 100%"}}>
                                            {directories.find((file) => file.id === Number(directory.id)) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
                                        </div>
                                    </Link>
                                    <div className='card-info'>
                                        <p title={directory.title}>{directory.title.length > 22 ? directory.title.substring(0,22) + "..." : directory.title}</p>
                                        <p>{Math.round(directory.vote_average * 10)}%</p>
                                    </div>
                                </div>
                            ) : null
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