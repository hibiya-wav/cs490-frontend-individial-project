import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './styles/Films.css'
import "./styles/PopupPage.css";
import Footer from "./Footer";

export const Films = () => {
    const [data, value] = useState([]);
    const [customerData, customerValue] = useState([]);
    const [filterData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermActor, setSearchTermActor] = useState('');
    const [searchTermGenre, setSearchTermGenre] = useState('');
    const [filmClick, selectedFilm] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/queries/films");
                value(res.data);
                setFilteredData(res.data);
            } catch (error) {
                console.error('Error fetching Data:', error);
            }
        };
        fetchData();
    }, []);

    const searchingTitle = () => {

        // regex to check if searchTermActor contains only letters or is empty.
        if (!/^[a-zA-Z\s]*$/.test(searchTerm)) {
            alert("Invalid input: The search term should not contain numbers or special characters.");
            return;
        }

        const filteredData = data.filter(film => film.title.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredData(filteredData);
    };

    const searchingActorFilm = async () => {

        // regex to check if searchTermActor contains only letters or is empty.
        if (!/^[a-zA-Z\s]*$/.test(searchTermActor)) {
            alert("Invalid input: The search term should not contain numbers or special characters.");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8080/api/queries/films/actors/${searchTermActor}`);
            setFilteredData(res.data);
        } catch (error) {
            console.error('Error searching actor:', error);
        }
    };

    const searchingGenreFilm = async () => {

        // regex to check if searchTermActor contains only letters or is empty.
        if (!/^[a-zA-Z\s]*$/.test(searchTermGenre)) {
            alert("Invalid input: The search term should not contain numbers or special characters.");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8080/api/queries/films/genre/${searchTermGenre}`);
            setFilteredData(res.data);
        } catch (error) {
            console.error('Error searching genre:', error);
        }
    };

    const openFilmDetailsWindow = (film) => {
        selectedFilm(film);
    };


    const closeFilmDetailsWindow = () => {
        selectedFilm(null);
    };

    const resetSearchInfo = () => {
        setSearchTerm('');
        setSearchTermActor('');
        setSearchTermGenre('');
        setFilteredData(data);
    };


    const rentMovieOperation = async (customerId) => {

        const numericRegex = /^[0-9]+$/;

        if (!numericRegex.test(customerId)) {
            alert("Error: Customer ID should contain only numbers.");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8080/api/queries/customerinfospec/${customerId}`);
            const data = res.data
            const isValidCustomer = res.data !== undefined;

            if (isValidCustomer) {
                alert(`Movie rented to ${titleCase(data.first_name)} ${titleCase(data.last_name)}\nCustomer ID: ${customerData}`);
            } else {
                alert("Error renting the movie. Please try again.");
            }
        } catch (error) {
            alert("Error renting the film. Please ensure that the customer ID is valid and try again later.");
        }
    };

    function titleCase(str) {
        return str.toLowerCase().split(' ').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }

    return (
        <div style={{height: '100vh', paddingTop: '80px'}}>
            <h2>Search for a Film</h2>

            <div className='parent-container' style={{display: 'flex'}}>
                <div className='rounded-container'>
                    <input type={"text"}
                           placeholder={"Film Title"}
                           value={searchTerm}
                           onChange={(typingAction) => setSearchTerm(typingAction.target.value)}/>
                    <button onClick={searchingTitle}>Search</button>
                </div>

                <div className='rounded-container'>
                    <input type={"text"}
                           placeholder={"Actor Name"}
                           value={searchTermActor}
                           onChange={(typingAction) => setSearchTermActor(typingAction.target.value)}/>
                    <button onClick={searchingActorFilm}>Search</button>
                </div>

                <div className='rounded-container'>
                    <input type={"text"}
                           placeholder={"Genre"}
                           value={searchTermGenre}
                           onChange={(typingAction) => setSearchTermGenre(typingAction.target.value)}/>
                    <button onClick={searchingGenreFilm}>Search</button>
                </div>
            </div>
            <div className='centerReset'>
                <button className='outsideReset' onClick={resetSearchInfo}>Reset Search</button>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Release Year</th>
                    <th>Rental Rate</th>
                    <th>Rating</th>
                </tr>
                </thead>
                <tbody>
                {filterData.map((film) => (
                    <tr key={film.id}>
                        <td>
                            <a className='page-link' href="#"
                               onClick={() => openFilmDetailsWindow(film)}>{film.title}</a>
                        </td>
                        <td>{film.description}</td>
                        <td>{film.release_year}</td>
                        <td>{film.rental_rate}</td>
                        <td>{film.rating}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {filmClick && (
                <div className="box-details-modal">
                    <div className="modal-content">
                        <h2>{filmClick.title}</h2>
                        <p>Description: {filmClick.description}</p>
                        <p>Release Year: {filmClick.release_year}</p>
                        <p>Length: {filmClick.length}</p>
                        <p>Rental Rate: {filmClick.rental_rate}</p>
                        <p>Replacement Cost: {filmClick.replacement_cost}</p>
                        <p>Special Features: {filmClick.special_features}</p>
                        <button className='outsideReset' onClick={closeFilmDetailsWindow}>Close</button>
                        <br/>
                        <br/>
                        <h4 style={{marginLeft: '0px', marginTop: '30px'}}>Rent Movie to a Customer</h4>
                        <div style={{marginLeft: '0px'}} className='rounded-container'>
                            <input type={"text"}
                                   placeholder={"Customer ID"}
                                   value={customerData}
                                   onChange={(typingAction) => customerValue(typingAction.target.value)}
                            />
                            <button onClick={() => rentMovieOperation(customerData)}>Rent Movie</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};
