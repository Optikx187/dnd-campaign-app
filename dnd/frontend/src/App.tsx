import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CampaignSelection from './pages/CampaignSelection';
import NewCampaign from './pages/NewCampaign';
import CampaignList from './pages/CampaignList';
import CampaignPlay from './pages/CampaignPlay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/campaigns" element={<CampaignSelection />} />
        <Route path="/campaigns/new" element={<NewCampaign />} />
        <Route path="/campaigns/list" element={<CampaignList />} />
        <Route path="/campaign/play" element={<CampaignPlay />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
