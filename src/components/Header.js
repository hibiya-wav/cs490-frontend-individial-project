import React from 'react';
import {Link} from 'react-router-dom';
import "./styles/Header.css";

export const Header = () => {
    return (
        <header style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: '#103432', padding: '10px', color: 'white' }}>
            <h1><Link to="/">Sakila Films</Link></h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/films">Films</Link>
                <Link to="/customers">Customers</Link>
            </nav>
        </header>
    );
};
