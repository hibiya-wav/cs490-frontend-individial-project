import React, {useEffect, useState} from 'react';
import axios from 'axios';

export const Customers = () => {
    const [data, value] = useState([]);
    const [customerData, customerValue] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/queries/customerinfo");
                value(res.data);
                customerValue(res.data);
            } catch (error) {
                console.error('Error fetching Data:', error);
            }
        };
        fetchData();
    }, []);

    const searchingPerson = () => {
        const filteredData = data.filter(film => film.title.toLowerCase().includes(searchTerm.toLowerCase()));
        customerValue(filteredData);
    };



    return (
        <div>
            <h3 style={{marginTop: '400px'}}>hi!</h3>
            <table>
                <thead>
                <tr>
                    <th>Customer ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
                </thead>
                <tbody>
                {customerData.map((customer) => (
                    <tr key={customer.id}>
                        <td>{customer.customer_id}</td>
                        <td>{customer.first_name}</td>
                        <td>{customer.last_name}</td>
                    </tr>
                    // add POST protocol buttons on here to edit and delete customers
                ))}
                </tbody>
            </table>


        </div>
    );
};
