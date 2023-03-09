import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import { useBlazeSlider } from 'react-blaze-slider';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import '../assets/css/slider.css';

const Slider = ({directoryList, type}) => {

    const {directories} = useContext(DirectoryContext);

    if (type === 'static') {
        const ref = useBlazeSlider({
            all: {
                slidesToScroll: 6,
                slidesToShow: 6
                }
        });

        return (
            <div ref={ref} className='blaze-slider'>
                <div className='blaze-container blaze-container-static'>
                    <div className='blaze-track'>
                        {directoryList.map((directory, i) => (
                            directory ? (
                                <div key={i}>
                                    {directories.find((file) => file.id === Number(directory.id) && file.media_type === directory.media_type) ? (
                                        <Link to={directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`} className='card-link'>
                                            {console.log(directory)}
                                            <div className='blaze-card blaze-card-static' title={directory.title} style={{ backgroundImage: 'url('+`${directory.backdrop_path ? directory.backdrop_path : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png' }`+')', backgroundSize: '100% 100%'}}>
                                                {directories.find((file) => file.id === Number(directory.id) && file.media_type === directory.media_type) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link to={directory.media_type === 'tv' ? `/searched/series/${directory.id}` : `/searched/movie/${directory.id}`} className='card-link'>
                                            <div className='blaze-card blaze-card-static' title={directory.title} style={{ backgroundImage: 'url('+`${directory.backdrop_path ? directory.backdrop_path : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png' }`+')', backgroundSize: '100% 100%'}}>
                                                {directories.find((file) => file.id === Number(directory.id) && file.media_type === directory.media_type) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
                                            </div>
                                        </Link>
                                    )}
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
    type: 'scrolling'
}

export default Slider;