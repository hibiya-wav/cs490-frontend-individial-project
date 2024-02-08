// App.js
import {Home} from './components/Home';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {Films} from "./components/Films";
import {Customers} from "./components/Customers"
import {useEffect, useState} from "react";
import {Route, Routes, useLocation} from 'react-router-dom';

function App() {
    const relativeLocation = useLocation();
    const [footerValue, setFooter] = useState(true);

    useEffect(() => {
        if (relativeLocation.pathname === '/films') {
            setFooter(false);
        } else {
            setFooter(true);
        }
    }, [relativeLocation.pathname]);

    return (
        <div>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="films" element={<Films/>}/>
                <Route path="customers" element={<Customers/>}/>
            </Routes>
            {footerValue && <Footer/>}
        </div>
    );
}

export default App;
