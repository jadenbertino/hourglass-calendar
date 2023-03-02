import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

// pages & components
import Locked from './pages/Locked/Locked';
import DailyView from './pages/DailyView/DailyView';
import WeeklyView from './pages/WeeklyView/WeeklyView';
import MonthlyView from './pages/MonthlyView/MonthlyView'

function App() {
  const { authIsReady } = useAuthContext()
  return (
    <Router>
      {authIsReady && (<>
        <Routes>
          <Route path="/" element={<Locked />} />
          <Route path="/daily" element={<DailyView />} />
          <Route path="/weekly" element={<WeeklyView />} />
          <Route path="/monthly" element={<MonthlyView />} />
        </Routes>
      </>)}
    </Router>
  );
}

export default App;