import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ConfirmSignup from './pages/ConfirmSignup';

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm" element={<ConfirmSignup />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;