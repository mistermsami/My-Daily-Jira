import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Col, Form, Row } from 'react-bootstrap';
import { collection, addDoc, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration
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

function Home() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);

    // Handle task input change
    const handleTaskChange = (e) => setTask(e.target.value);

    // Add new task
    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "todotasks"), {
                task: task,
                status: 'To Do',
                date: new Date().toISOString()
            });
            setTask('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    // Retrieve tasks
    useEffect(() => {
        const q = query(collection(db, "todotasks"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksArray = [];
            querySnapshot.forEach((doc) => {
                tasksArray.push({ id: doc.id, ...doc.data() });
            });
            setTasks(tasksArray);
        });

        return () => unsubscribe();
    }, []);

    // Update task status
    const updateTaskStatus = async (id, newStatus) => {
        try {
            const taskDocRef = doc(db, "todotasks", id);
            await updateDoc(taskDocRef, {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-center align-items-center">
                <div className="card mt-5 mb-5 col-md-6">
                    <div className="col-md-12">
                        <h2 className="text-center mt-4">Add Task to To-Do List</h2>
                    </div>
                    <Form className="p-5" onSubmit={handleAddTask}>
                        <Form.Group as={Row} className="col-md-12 mb-3" controlId="formHorizontalTask">
                            <Form.Label column sm={2}>Task</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    placeholder="Add Task"
                                    value={task}
                                    onChange={handleTaskChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="col-md-12 mb-3">
                            <Col sm={{ span: 10, offset: 2 }}>
                                <Button type="submit" className='w-100'>Add Task</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </div>

            <div className="col-md-12">
                <h2 className="text-center mt-4 mb-3 fw-bold">To-Do List</h2>
            </div>

            <div className="d-flex justify-content-center align-items-center">

            <div className="col-md-8 mb-5">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>To Do</th>
                            <th>In Progress</th>
                            <th>Complete</th>
                            {/* <th>Status</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <tr key={task.id}>
                                <td>{index + 1}</td>
                                {task.status === 'To Do' ?(
                                    <td>{task.task}</td>
                                ):(
                                    <td></td>
                                )}
                                {task.status === 'In Progress' ?(
                                    <td>{task.task}</td>
                                ):(
                                    <td></td>
                                )}
                                {task.status === 'Complete' ?(
                                    <td>{task.task}</td>
                                ):(
                                    <td></td>
                                )}
                                {/* <td>{task.task}</td> */}
                                {/* <td>{task.status}</td> */}
                                <td>
                                    {task.status === 'To Do' && (
                                        <Button
                                            variant="warning"
                                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                                        >
                                            Start
                                        </Button>
                                    )}
                                    {task.status === 'In Progress' && (
                                        <Button
                                            variant="success"
                                            onClick={() => updateTaskStatus(task.id, 'Complete')}
                                        >
                                            Complete
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            </div>
        </Container>
    );
}

export default Home;
