import './App.css'
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import HomePage from '../HomePage/HomePage';
import AboutPage from '../AboutPage/AboutPage';
import ServicesPage from '../ServicesPage/ServicesPage';
import CaregiversPage from '../CaregiversPage/CaregiversPage';
import AppointmentsPage from '../AppointmentsPage/AppointmentsPage';
import EHRPage from '../EHRPage/EHRPage';
import LoginPage from '../LoginPage/LoginPage';
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
        {user ? <>
          <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
          <Route path="/home" element={<HomePage user={user} setUser={setUser} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage user={user} />} />
          <Route path="/caregivers" element={<CaregiversPage />} />
          <Route path="/appointments" element={<AppointmentsPage user={user} />} />
          <Route path="/ehr" element={<EHRPage user={user} />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </> : <>
          <Route path="/appointments" element={<Navigate to="/signup" replace />} />
          <Route path="/ehr" element={<Navigate to="/signup" replace />} />
          <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
          <Route path="/home" element={<HomePage user={user} setUser={setUser} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage user={user} />} />
          <Route path="/caregivers" element={<CaregiversPage />} />
          <Route path="/login" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<LoginPage user={user} setUser={setUser} />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </>}
      </Routes>
    </main>
  </>)
}

export default App
