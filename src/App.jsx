import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Pages
import Navbarb from './navbar';
import Home from './home';
import Signup from './signup';
import Signin from './signin';

import './style.css'



function App() {
  const [isLogin, setLogin] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogin(true);
        navigate("/");
      } else {
        setLogin(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setLogin(false);
      navigate("/signin");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Navbarb isLogin={isLogin} onLogout={handleLogout} />
      <Routes>
        {isLogin ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Home />} />
            <Route path="/contact" element={<Home />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="*" element={<Signup />} />
          </>
        )}
      </Routes>
    </DndProvider>
  );
}

export default App;
