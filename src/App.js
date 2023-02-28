import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

// pages & components
import Locked from './pages/Locked';
import DailyView from './pages/DailyView';
import WeeklyView from './pages/WeeklyView';


function App() {
  const { authIsReady } = useAuthContext()
  return (
    <Router>
      {authIsReady && (<>
        <Routes>
          <Route path="/" element={<Locked />} />
          <Route path="/daily" element={<DailyView />} />
          <Route path="/weekly" element={<WeeklyView />} />
        </Routes>
      </>)}
    </Router>
  );
}

export default App;
