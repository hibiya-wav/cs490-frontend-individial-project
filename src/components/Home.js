import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './styles/PopupPage.css';
import './styles/HomePage.css';

export const Home = () => {
    const [films, setFilmValue] = useState([]);
    const [actors, setActorValue] = useState([]);
    const [selectedActor, setSelectedActor] = useState(null);
    const [selectedFilm, setSelectedFilm] = useState(null);

    useEffect(() => {
        const fetchTop5FilmData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/queries/top5films");
                setFilmValue(res.data);
            } catch (error) {
                console.error('Error fetching Data:', error);
            }
        };

        const fetchTop5ActorData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/queries/top5actors");
                setActorValue(res.data);
            } catch (error) {
                console.error('Error fetching Actors:', error);
            }
        };

        fetchTop5FilmData();
        fetchTop5ActorData();
    }, []);

    const filmButtonClickFUNC = async (filmId) => {
        try {
            console.log('Film ID:', filmId); // Log the filmId value
            const res = await axios.get(`http://localhost:8080/api/queries/top5films/${filmId}`);
            setSelectedFilm(res.data);
        } catch (error) {
            console.error('Error fetching Film details:', error.response); // Log the error response
        }
    };

    const actorButtonClickFUNC = async (actorId) => {
        try {
            console.log('Actor ID:', actorId); // Log the filmId value
            const res = await axios.get(`http://localhost:8080/api/queries/top5actors/${actorId}`);
            setSelectedActor(res.data);
        } catch (error) {
            console.error('Error fetching Actor details:', error.response); // Log the error response
        }
    };

    const closeFilmDetailsWindow = () => {
        setSelectedFilm(null);
    };

    const closeActorDetailsWindow = () => {
        setSelectedActor(null);
    };

    return (
        <div className="split-data-layout" style={{height: '100vh', paddingTop: '110px'}}>
            <div className="left-side-films">
                <h2 id="home" style={{marginBottom: '25px'}}>Top 5 rented films of all time</h2>
                <div className='container'>
                    <ul>
                        {films.map((film) => (
                            <li key={film.id}>
                                <div className='info-container'>
                                    {film.title}{' '}
                                    <div className='button-container'>
                                        <button onClick={() => filmButtonClickFUNC(film.film_id)}>Details</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {selectedFilm && (
                    <div className="box-details-modal">
                        <div className="modal-content">
                            <h2>Film Details</h2>
                            <p>Film Title: {selectedFilm.title}</p>
                            <p>Description: {selectedFilm.description}</p>
                            <p>Year Released: {selectedFilm.release_year}</p>
                            <p>Length: {selectedFilm.length} Minutes</p>
                            <p>Rental Rate: ${selectedFilm.rental_rate}</p>
                            <div className="button-container">
                                <button onClick={closeFilmDetailsWindow}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="right-side-actors">
                <h2 id="about" style={{marginBottom: '25px'}}>Top 5 actors</h2>
                <ul>
                    {actors.map((actor) => (
                        <li key={actor.id}>
                            <div className='info-container'>
                                {actor.first_name}{' '}{actor.last_name}{' '}
                                <div className="button-container">
                                    <button onClick={() => actorButtonClickFUNC(actor.actor_id)}>Details</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {selectedActor && (
                    <div className="box-details-modal">
                        <div className="modal-content">
                            <h2>Actor Details</h2>
                            {selectedActor.slice(0, 1).map((actor) => (
                                <p>Actor Name: {actor.first_name} {actor.last_name}</p>
                            ))}
                            <p>Top Films Rented where this Actor starred in:</p>
                            <ol>
                                {selectedActor.slice(0, 5).map((film, index) => (
                                    <li key={film.title}><span>{index + 1}.</span>{film.title}</li>
                                ))}
                            </ol>
                            <div className="button-container">
                                {/*// center this button*/}
                                <button onClick={closeActorDetailsWindow}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
