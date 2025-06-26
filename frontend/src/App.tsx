import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ConfirmSignup from './pages/ConfirmSignup';
import CodeGuideEditor from './pages/AddCodeGuide';
import CodeGuidePage from './pages/CodeGuidePage';
import ProtectedRoute from './components/protectedRoute';
import PublicRoute from './components/publicRoute';

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              } 
            />
            
            <Route path="/confirm" element={<ConfirmSignup />} />
            
            <Route 
              path="/code-guide" 
              element={
                <ProtectedRoute>
                  <CodeGuideEditor />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/:guide-id" element={<CodeGuidePage />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;