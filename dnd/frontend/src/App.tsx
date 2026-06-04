import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CampaignSelection from './pages/CampaignSelection';
import NewCampaign from './pages/NewCampaign';
import CampaignList from './pages/CampaignList';
import CampaignPlay from './pages/CampaignPlay';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/campaigns" element={<RequireAuth><CampaignSelection /></RequireAuth>} />
        <Route path="/campaigns/new" element={<RequireAuth><NewCampaign /></RequireAuth>} />
        <Route path="/campaigns/list" element={<RequireAuth><CampaignList /></RequireAuth>} />
        <Route path="/campaign/play" element={<RequireAuth><CampaignPlay /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
