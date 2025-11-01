import './App.css'
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import HomePage from '../HomePage/HomePage';
import AboutPage from '../AboutPage/AbouPage';
import ServicesPage from '../ServicesPage/ServicesPage';
import CaregiversPage from '../CaregiversPage/CaregiversPage';
import NavBar from '../../components/NavBar/NavBar';
import { getUser } from '../../utilities/users-api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUser() {
      const foundUser = await getUser();
      setUser(foundUser)
    }
    checkUser()
  }, [])

  return (<>
    <NavBar user={user} setUser={setUser} />
    <main>
      <Routes>
        <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
        <Route path="/home" element={<HomePage user={user} setUser={setUser} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/caregivers" element={<CaregiversPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </main>
  </>)
}

export default App
