
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// Pages
import Landing from './pages/Landing.tsx';
import SignUp from './pages/SignUp.tsx';
import SignIn from './pages/SignIn.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Verify from './pages/Verify.tsx';
import Fractional from './pages/Fractional.tsx';
import Yield from './pages/Yield.tsx';
import Swap from './pages/Swap.tsx';
import Pay from './pages/Pay.tsx';
import Account from './pages/Account.tsx';
import PropAI from './pages/PropAI.tsx';

// Components
import Layout from './components/Layout.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
          <Route path="/fractional" element={<ProtectedRoute><Fractional /></ProtectedRoute>} />
          <Route path="/yield" element={<ProtectedRoute><Yield /></ProtectedRoute>} />
          <Route path="/swap" element={<ProtectedRoute><Swap /></ProtectedRoute>} />
          <Route path="/pay" element={<ProtectedRoute><Pay /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><PropAI /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
