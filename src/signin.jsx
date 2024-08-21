import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { collection, onSnapshot, query } from "firebase/firestore";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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

// Initialize Firestore and Firebase Auth
const db = getFirestore(app);
const auth = getAuth(app);

function Signin({ setLogin }) {
    const [femail, setEmail] = useState('');
    const [fpassword, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userData, setUserData] = useState([]);

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const formrequest = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, femail, fpassword);
            const user = userCredential.user;
            console.log("Signed in user:", user);
            setLogin(true);  // Set login state to true upon successful sign-in
        } catch (error) {
            console.error("Error during sign-in: ", error);
            setError(error.message);  // Set error message to display in the UI
        }
    };

    // useEffect(() => {
    //     const q = query(collection(db, "users"));
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         const currusers = [];
    //         querySnapshot.forEach((doc) => {
    //             currusers.push(doc.data().name);
    //         });
    //         console.log("Current users: ", currusers);
    //         setUserData(currusers);
    //     });

    //     return () => unsubscribe(); // Cleanup on unmount
    // }, []);

    return (
        <Container>
            <div className="col-md-12 pt-5">
                <h1 className="text-center">Signin Form</h1>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="card mt-5 col-md-6">
                    <Form className="p-5" onSubmit={formrequest}>
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

                        {error && (
                            <Row className="col-md-12 mb-3">
                                <Col sm={{ span: 10, offset: 2 }}>
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                </Col>
                            </Row>
                        )}

                        <Form.Group as={Row} className="col-md-12 mb-3">
                            <Col sm={{ span: 10, offset: 2 }}>
                                <Button type="submit" className='w-100'>Sign in</Button>
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

export default Signin;
