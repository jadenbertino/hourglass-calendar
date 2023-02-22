import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

// pages & components
import {Locked, DailyView} from './pages/pages'

// styles
import './App.css';

function App() {
  const { authIsReady } = useAuthContext()
  return (
    <Router>
      {authIsReady && (<>
        <Routes>
          <Route path="/" element={<Locked />} />
          <Route path="/daily" element={<DailyView />} />
        </Routes>
      </>)}
    </Router>
  );
}

export default App;
