import React, { useEffect, useState } from 'react';
import { Container, Button, Col, Form, Row } from 'react-bootstrap';
import { collection, addDoc, query, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useDrag, useDrop } from 'react-dnd';

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

// Item types
const ItemTypes = {
    TASK: 'TASK'
};

// Draggable Task Component
const Task = ({ id, task, index, moveTask, handleDeleteTask }) => {
    const [, drag] = useDrag({
        type: ItemTypes.TASK,
        item: { id, index }
    });

    return (
        <div ref={drag} className="mb-3 p-3 rounded shadow-sm todolistitem">
            <div>{task}</div>
            <Button
                variant="danger"
                onClick={() => handleDeleteTask(id)}
                size="sm"
                className="mt-2"
            >
                Delete
            </Button>
        </div>
    );
};

// Droppable Column Component
const TaskColumn = ({ status, tasks, moveTask, handleDeleteTask }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.TASK,
        drop: (item) => {
            moveTask(item.id, status);
        }
    });

    return (
        <Col md={4} ref={drop}>
            <h4 className="text-center">{status}</h4>
            <div className="p-3 bg-light rounded todolistbox" style={{ minHeight: '300px' }}>
                {tasks
                    .filter(task => task.status === status)
                    .map((task, index) => (
                        <Task
                            key={task.id}
                            id={task.id}
                            task={task.task}
                            index={index}
                            moveTask={moveTask}
                            handleDeleteTask={handleDeleteTask}
                        />
                    ))}
            </div>
        </Col>
    );
};

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
            await updateDoc(taskDocRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    // Delete task
    const handleDeleteTask = async (id) => {
        try {
            await deleteDoc(doc(db, "todotasks", id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    // Move task to a new status
    const moveTask = (id, newStatus) => {
        const taskToMove = tasks.find(task => task.id === id);
        if (taskToMove) {
            updateTaskStatus(id, newStatus);
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-center align-items-center">
                <div className="card addtodolistitem mt-5 mb-5 col-md-6">
                    <div className="col-md-12">
                        <h2 className="text-center mt-4">Add Task to To-Do List</h2>
                    </div>
                    <Form className="p-5" onSubmit={handleAddTask}>
                        <Form.Group as={Row} className="col-md-12 mb-4" controlId="formHorizontalTask">
                            <Form.Label column sm={3}>Enter Task</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    placeholder="Add Task"
                                    value={task}
                                    onChange={handleTaskChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="col-md-12 mb-3 mt-3">
                            <Col sm={{ span: 9, offset: 3 }}>
                                <Button type="submit" className='w-100'>Add Task</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </div>

            <div className="col-md-12">
                <h2 className="text-center mt-4 mb-3 fw-bold">My Daily Jira</h2>
            </div>

            <Row>
                {['To Do', 'In Progress', 'Complete'].map(status => (
                    <TaskColumn
                        key={status}
                        status={status}
                        tasks={tasks}
                        moveTask={moveTask}
                        handleDeleteTask={handleDeleteTask}
                    />
                ))}
            </Row>
        </Container>
    );
}

export default Home;
