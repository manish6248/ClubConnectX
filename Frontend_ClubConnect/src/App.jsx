// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';
import ProfilePage from './pages/ProfilePage';
import ChatRoom from './pages/ChatRoom';



import UserProfile from "./pages/UserProfile";
import EventForm from './pages/EventForm';
import LandingPost from './pages/LandingPost';
import EventDetails from './pages/EventDetails';
import TrendingPage from './pages/TrendingPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import AllEvents from './pages/AllEvents';
import EventAttendees from './pages/EventAttendees';
import EventSponsors from './pages/EventSponsors';
import SponsorForm from './pages/SponsorForm';

import Certy from './components/Certification/Certy';
import CertificatePage from './components/Certification/CertificatePage';
import CertificateView from './components/Certification/CertificateView';
import Payment from './components/Razorpay/Payment';


// import ChatRoom from './pages/ChatRoom';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          
          <Route path="/" element={<TrendingPage/>} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatRoom/>} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/event" element={<EventForm/>} />

          <Route path="/landingpost" element={<LandingPost/>} />

          <Route path="/event/:id" element={<EventDetails />} />
         
      
        <Route path="/register-event/:eventId" element={<PrivateRoute><StudentRegisterPage /></PrivateRoute>} />
        
        {/* Club Admin routes */}
        <Route path="/create-event" element={<PrivateRoute adminOnly={true}><EventForm /></PrivateRoute>} />
        {/* <Route path="/edit-event/:eventId" element={<PrivateRoute adminOnly={true}><EventForm /></PrivateRoute>} /> */}
        <Route path="/event/:eventId/attendees" element={<PrivateRoute adminOnly={true}><EventAttendees /></PrivateRoute>} />
        <Route path="/event/:eventId/sponsors" element={<PrivateRoute adminOnly={true}><EventSponsors /></PrivateRoute>} />
        
        {/* Sponsor routes */}
        <Route path="/sponsor-event/:eventId" element={<PrivateRoute sponsorOnly={true}><SponsorForm /></PrivateRoute>} />
          
        <Route path="/certificate" element={<Certy/>} />
          <Route path="/certificatespages" element={<CertificatePage/>} />
          <Route path="/certificate/view/:id" element={<CertificateView />} />

          {/* <Route path="/payment/:eventId" element={<Payment/>} /> */}

          
          <Route path="/payment" element={<Payment/>} />
          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

            <Route
            path="/all-events"
            element={
              // <PrivateRoute>
                <AllEvents />
              // </PrivateRoute>
            }
          />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
    
    
  );
}

export default App;