import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Footer from "./Footer";

export const Customers = () => {

    const [data, setData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerID, setCustomerID] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [newCustomer, setNewCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/queries/customerinfo");
            setData(res.data);
            setCustomerData(res.data);
        } catch (error) {
            console.error('Error fetching Data:', error);
        }
    };

    const customerSpecificInfo = async (customerId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/queries/customerinfo/${customerId}`);
            const customerData = res.data;

            const rentalHistory = {};
            customerData.forEach((row) => {
                const rentalId = row.rental_id;
                if (!rentalHistory[rentalId]) {
                    rentalHistory[rentalId] = {
                        rentalId: rentalId,
                        rentalDate: row.rental_date,
                        filmTitle: row.film_title
                    };
                }
            });

            setSelectedCustomer({...customerData[0], rentalHistory: Object.values(rentalHistory)});
        } catch (error) {
            alert("Error fetching customer information. Please try again later.");
        }
    };

    const fetchCustomerDetails = async (customerId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/queries/customerinfo/${customerId}`);
            const data = res.data;
            setEditedCustomer({...data, customer_id: customerId});
            setEditingCustomer(true);
        } catch (error) {
            console.error('Error fetching customer details:', error);
            alert("Error fetching customer details. Please try again.");
        }
    };

    const deleteCustomer = async (selectedCustomer) => {
        try {
            await axios.delete(`http://localhost:8080/api/queries/customerdelete/${selectedCustomer.customer_id}`);
            fetchData();
            closeCustomerInfoWindow();
        } catch (error) {
            alert("Error deleting customer. Please try again later.");
        }
    };

    const searchingPerson = (searchTerm) => {

        // regex, checks if the input is alphabetic char or not
        if (!/^[a-zA-Z\s]+$/.test(searchTerm)) {
            alert("Please enter a valid search term containing only letters and spaces.");
            return;
        }

        const searchTerms = searchTerm.toLowerCase().split(/\s+/);
        const filteredData = data.filter(customer =>
            searchTerms.every(term =>
                customer.first_name.toLowerCase().includes(term) ||
                customer.last_name.toLowerCase().includes(term)
            )
        );
        setCustomerData(filteredData);
    };


    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setNewCustomer({...newCustomer, [name]: value});
    };

    const generateRandomAddressId = () => {
        const min = 5;
        const max = 507;
        return Math.floor(Math.random() * (max - min + 1)) + min; // inclusive random number for min and max to define the address for new users
    };

    const addNewCustomer = async () => {
        try {
            const addressId = generateRandomAddressId();
            await axios.post("http://localhost:8080/api/queries/customerAdd", {...newCustomer, addressId});
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error('Error adding new customer:', error);
        }
    };

    const saveEditedCustomer = async (customerId) => {
        try {
            const {first_name, last_name, email} = editedCustomer;

            if (!customerId) {
                alert("Customer ID is missing.");
                return;
            }

            await axios.patch(`http://localhost:8080/api/queries/customerinfospec/${customerId}`, {
                first_name,
                last_name,
                email
            });

            setEditingCustomer(false);
            fetchData();
            alert("Customer details saved successfully.");
        } catch (error) {
            console.error('Error saving customer details:', error);
            alert("Error saving customer details. Please try again.");
        }
    };


    const searchingCustomerID = () => {
        const trimmedID = customerID.trim();

        // regex, checks to make sure the input is an integer, if not we alert the user
        if (!/^\d+$/.test(trimmedID)) {
            alert("Please enter a valid numeric ID.");
            return;
        }

        const filteredData = data.filter(customer =>
            customer.customer_id.toString() === trimmedID
        );
        setCustomerData(filteredData);
    };


    const resetSearchInfo = () => {
        setCustomerID('');
        setCustomerName('');
        setCustomerData(data);
    };

    const openCustomerInfoWindow = (customer) => {
        customerSpecificInfo(customer.customer_id);
    };

    const openCustomerEditWindow = (selectedCustomer) => {
        closeCustomerInfoWindow();
        fetchCustomerDetails(selectedCustomer.customer_id);
    }

    const closeCustomerInfoWindow = () => {
        setSelectedCustomer(null);
    };


    return (
        <div style={{height: '100vh', paddingTop: '80px'}}>
            <h2>Sakila Customers</h2>
            <div className='parent-container' style={{display: 'flex'}}>
                <div className='rounded-container'>
                    <input type={"text"}
                           placeholder={"Customer Name"}
                           value={customerName}
                           onChange={(typingAction) => setCustomerName(typingAction.target.value)}/>
                    <button onClick={() => searchingPerson(customerName)}>Search by Name</button>
                </div>

                <div className='rounded-container'>
                    <input type={"text"}
                           placeholder={"Customer ID"}
                           value={customerID}
                           onChange={(typingAction) => setCustomerID(typingAction.target.value)}/>
                    <button onClick={searchingCustomerID}>Search by ID</button>
                </div>
            </div>
            <div className='centerReset' style={{marginTop: '20px'}}>
                <button className='outsideReset' onClick={resetSearchInfo} style={{marginRight: '40px'}}>Reset Search
                </button>
                <button className='outsideReset' onClick={() => setShowModal(true)}>Create New Customer</button>
            </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <table>
                    <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customerData.map((customer) => (
                        <tr key={customer.customer_id}>
                            <td>
                                <a className='page-link' href="#"
                                   onClick={() => openCustomerInfoWindow(customer)}>{customer.customer_id}</a>
                            </td>
                            <td>{customer.first_name}</td>
                            <td>{customer.last_name}</td>
                            <td>{customer.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/*edit user*/}
            {editingCustomer && (
                <div className="box-details-modal">
                    <div className="modal-content">
                        <h3>Edit Customer Details</h3>
                        <div>
                            <label style={{marginBottom: "10px"}}>First Name:</label>
                            <div className="rounded-container">
                                <input
                                    type="text"
                                    value={editedCustomer.first_name}
                                    onChange={(e) => setEditedCustomer(prevState => ({
                                        ...prevState,
                                        first_name: e.target.value
                                    }))}
                                    className="rounded-input"
                                />
                                <button onClick={() => saveEditedCustomer(editedCustomer.customer_id)}>Save</button>
                            </div>
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <div className="rounded-container">
                                <input
                                    type="text"
                                    value={editedCustomer.last_name}
                                    onChange={(e) => setEditedCustomer(prevState => ({
                                        ...prevState,
                                        last_name: e.target.value
                                    }))}
                                    className="rounded-input"
                                />
                                <button onClick={() => saveEditedCustomer(editedCustomer.customer_id)}>Save</button>
                            </div>
                        </div>
                        <div>
                            <label>Email:</label>
                            <div className="rounded-container">
                                <input type="text" value={editedCustomer.email}
                                       onChange={(e) => setEditedCustomer(prevState => ({
                                           ...prevState,
                                           email: e.target.value
                                       }))} className="rounded-input"/>
                                <button onClick={() => saveEditedCustomer(editedCustomer.customer_id)}>Save</button>
                            </div>
                        </div>
                        <div className="rounded-container" style={{marginRight: '200px'}}>
                            <button onClick={() => setEditingCustomer(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/*Add Customer Info*/}
            {showModal && (
                <div className="box-details-modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}
                              style={{fontSize: '24px'}}>&times;</span>
                        <h3>Add New Customer</h3>
                        <div className="rounded-container">
                            <input type="text" name="firstName" value={newCustomer.firstName}
                                   onChange={handleInputChange} placeholder="First Name" className="rounded-input"/>
                        </div>
                        <div className="rounded-container">
                            <input type="text" name="lastName" value={newCustomer.lastName} onChange={handleInputChange}
                                   placeholder="Last Name" className="rounded-input"/>
                        </div>
                        <div className="rounded-container">
                            <input type="text" name="email" value={newCustomer.email} onChange={handleInputChange}
                                   placeholder="Email" className="rounded-input"/>
                        </div>
                        <div className="centerReset">
                            <div className="rounded-container">
                                <button onClick={addNewCustomer}>Add Customer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/*View Customer information*/}
            {selectedCustomer && (
                <div className="box-details-modal" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ maxHeight: '80%', overflowY: 'auto', width: '80%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                        <h2>Customer Information</h2>
                        <p>Customer ID: {selectedCustomer.customer_id}</p>
                        <p>Customer Name: {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                        <p>Email: {selectedCustomer.email}</p>
                        <h3>Rental History</h3>
                        <ul>
                            {selectedCustomer.rentalHistory.slice(0, 5).map((rental) => (
                                <div style={{ border: '2px solid #000000', padding: '5px 10px', marginBottom: '15px', marginRight: '300px', marginLeft: '300px' }}>
                                    <li key={rental.rentalId}>
                                        <p>Rental ID: {rental.rentalId}</p>
                                        <p>Rental Date: {rental.rentalDate}</p>
                                        <p>Film Title: {rental.filmTitle}</p>
                                    </li>
                                </div>
                            ))}
                        </ul>
                        <button className='outsideReset' style={{ marginTop: '20px', padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={closeCustomerInfoWindow}>Close </button>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                            <button style={{ flex: '1', padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => openCustomerEditWindow(selectedCustomer)}>Edit Information
                            </button>
                            <button style={{ flex: '1', padding: '10px 20px', backgroundColor: '#FF0000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => deleteCustomer(selectedCustomer)}>Delete Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

