import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { collection, addDoc } from "firebase/firestore";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { query, onSnapshot } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAhh9_LbGYHY9ScEaB-v1HnlSQ7k2K1bo",
    authDomain: "hackathon-77ae9.firebaseapp.com",
    projectId: "hackathon-77ae9",
    storageBucket: "hackathon-77ae9.appspot.com",
    messagingSenderId: "126715915649",
    appId: "1:126715915649:web:7dac29e5222fcf51130c80",
    measurementId: "G-YY6P865QN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

function Signup({ setLogin }) {
    const [fname, setName] = useState('');
    const [femail, setEmail] = useState('');
    const [fpassword, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const formrequest = async (e) => {
        e.preventDefault();
        console.log("Name:", fname);
        console.log("Email:", femail);
        console.log("Password:", fpassword);

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, femail, fpassword);
            const user = userCredential.user;
            console.log("User signed up: ", user);

            // Add user data to Firestore
            const docRef = await addDoc(collection(db, "users"), {
                name: fname,
                email: femail,
                password: fpassword, // Consider storing a hashed version instead
                date: new Date().getDate()
            });
            console.log("Document written with ID: ", docRef.id);

            setAlertMessage('Signup successful!');
            setShowAlert(true);
        } catch (error) {
            console.error("Error during signup: ", error);
            setAlertMessage(error.message);
            setShowAlert(true);
        }
    };

    // Retrieve data
    // const [userData, setuserData] = useState([]);

    // useEffect(() => {
    //     const q = query(collection(db, "users"));
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         const currusers = [];
    //         querySnapshot.forEach((doc) => {
    //             currusers.push(doc.data().name);
    //         });
    //         console.log("Current users: ", currusers);
    //         setuserData(currusers);
    //     });
    // }, []);

    return (
        <Container>
            <div className="col-md-12 pt-5">
                <h1 className="text-center">Registration Form</h1>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="card mt-5 col-md-6">
                    <Form className="p-5" onSubmit={formrequest}>
                        {showAlert && (
                            <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
                                {alertMessage}
                            </Alert>
                        )}
                        <Form.Group as={Row} className="col-md-12 mb-3" controlId="formHorizontalName">
                            <Form.Label column sm={2}>
                                Name
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" placeholder="Name" value={fname} onChange={handleNameChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="col-md-12 mb-3" controlId="formHorizontalEmail">
                            <Form.Label column sm={2}>
                                Email
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="email" placeholder="Email" value={femail} onChange={handleEmailChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="col-md-12 mb-5" controlId="formHorizontalPassword">
                            <Form.Label column sm={2}>
                                Password
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="password" placeholder="Password" value={fpassword} onChange={handlePasswordChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="col-md-12 mb-3">
                            <Col sm={{ span: 10, offset: 2 }}>
                                <Button type="submit" className='w-100'>Sign up</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </div>
            {/* <div className="card mt-5 w-50">
                <ul>
                    {userData.map((uservalue, index) => (
                        <li key={index}>{uservalue}</li>
                    ))}
                </ul>
            </div> */}
        </Container>
    );
}

export default Signup;
