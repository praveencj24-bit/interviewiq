import { Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import History from './pages/History.jsx';
import Analyze from './pages/Analyze.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';
import InterviewSetup from './pages/InterviewSetup.jsx';
import InterviewPage from './pages/InterviewPage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<History />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/analyses/:id" element={<AnalysisPage />} />
          <Route path="/interview" element={<InterviewSetup />} />
          <Route path="/interviews/:id" element={<InterviewPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
