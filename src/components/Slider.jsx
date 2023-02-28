import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import DirectoryContext from '../context/directory/DirectoryContext';
import {useBlazeSlider} from 'react-blaze-slider';
import {IoIosArrowForward, IoIosArrowBack, IoIosCheckmarkCircle} from 'react-icons/io';
import '../assets/css/slider.css';

const Slider = ({directoryList, type}) => {

    const {directories} = useContext(DirectoryContext);

    if (type === 'scrolling') {
        const ref = useBlazeSlider({
            all: {
                slidesToScroll: 4,
                slidesToShow: 4
                },
                "(max-width: 900px)": {
                slidesToScroll: 2,
                slidesToShow: 2,
                slidesGap: '40px'
                },
                "(max-width: 500px)": {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        });

        return (
            <div ref={ref} className='blaze-slider slider-scrolling'>
                <a className='blaze-prev'><IoIosArrowBack/></a>
                <a className='blaze-next'><IoIosArrowForward/></a>
                <div className='blaze-container blaze-container-scrolling'>
                    <div className='blaze-track'>
                        {directoryList.map((directory, i) => (
                            <div className='blaze-card blaze-card-scrolling' key={i} style={{ backgroundImage: 'url('+`${directory.poster_path}`+')', backgroundSize: '100% 100%'}}>
                                <Link to={directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`} className='card-link'>
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
            <div ref={ref} className='blaze-slider'>
                <div className='blaze-container blaze-container-static'>
                    <div className='blaze-track'>
                        {directoryList.map((directory, i) => (
                            directory ? (
                                <div key={i}>
                                    {directories.find((file) => file.id === Number(directory.id)) ? (
                                        <Link to={directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : `/unknown/${directory.id}`} className='card-link'>
                                            <div className='blaze-card blaze-card-static' title={directory.title} style={{ backgroundImage: 'url('+`${directory.backdrop_path ? directory.backdrop_path : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png' }`+')', backgroundSize: '100% 100%'}}>
                                                {directories.find((file) => file.id === Number(directory.id)) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link to={directory.media_type === 'tv' ? `/searched/series/${directory.id}` : `/searched/movie/${directory.id}`} className='card-link'>
                                            <div className='blaze-card blaze-card-static' title={directory.title} style={{ backgroundImage: 'url('+`${directory.backdrop_path ? directory.backdrop_path : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png' }`+')', backgroundSize: '100% 100%'}}>
                                                {directories.find((file) => file.id === Number(directory.id)) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
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
    else if (type === 'trending') {
        const ref = useBlazeSlider({
            all: {
                slidesToShow: 1,
                enableAutoplay: true,
                autoplayInterval: 5000,
                }
        });

        return (
            // <div ref={ref} className='blaze-slider'>
            //     <div className='blaze-container'>
            //         <div className='blaze-track'>
            //             {directoryList.map((directory, i) => (
            //                 directory ? (
            //                     <div key={i}>
            //                         {/* {directories.find((file) => file.id === Number(directory.id)) ? (
            //                             <Link to={directory.media_type === 'tv' ? `/series/${directory.id}` : directory.media_type === 'movie' ? `/movie/${directory.id}` : '/directoryFile'} className='card-link'>
            //                                 <div className='blaze-card blaze-card-static' title={directory.title} style={{ backgroundImage: 'url('+`${directory.backdrop_path ? directory.backdrop_path : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png' }`+')', backgroundSize: '100% 100%'}}>
            //                                     {directories.find((file) => file.id === Number(directory.id)) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
            //                                 </div>
            //                             </Link>
            //                         ) : (
            //                             <Link to={directory.media_type === 'tv' ? `/searched/series/${directory.id}` : `/searched/movie/${directory.id}`} className='card-link'>
            //                                 <div className='blaze-card blaze-card-static' title={directory.title} style={{ backgroundImage: 'url('+`${directory.backdrop_path ? directory.backdrop_path : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png' }`+')', backgroundSize: '100% 100%'}}>
            //                                     {directories.find((file) => file.id === Number(directory.id)) ? <IoIosCheckmarkCircle className='checkmark' title='In Directory'/> : null}
            //                                 </div>
            //                             </Link>
            //                         )} */}
            //                             <div className='blaze-card' title={directory.title} style={{ backgroundImage: 'url('+`${directory.backdrop_path ? `https://image.tmdb.org/t/p/w200/${directory.backdrop_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png' }`+')', backgroundSize: '100% 100%'}}>
            //                             </div>
            //                     </div>
            //                 ) : null
            //             ))}
            //         </div>
            //     </div>
            // </div>
                <div ref={ref} className="blaze-slider">
                  <div className="blaze-container">
                    <div className="blaze-track-container">
                      <div className="blaze-track">
                        {/* {directoryList.map((directory, i) => (
                            <div key={i} className='blaze-card' title={directory.title} style={{ backgroundImage: 'url('+`${directory.backdrop_path ? `https://image.tmdb.org/t/p/w200/${directory.backdrop_path}` : 'D:/Projects/MyFlix+/myflix+/src/assets/images/no_image.png' }`+')', backgroundSize: '100% 100%'}}>
                            </div>
                        ))} */}
                        <div>Hi</div>
                      </div>
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