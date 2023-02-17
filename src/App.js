import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

// pages & components
import { Home } from './pages/pages'
import { Nav } from './components/components'

// styles
import './App.css';

function App() {
  const { authIsReady } = useAuthContext()
  return (
    <Router>
      {authIsReady && (<>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </>)}
    </Router>
  );
}

export default App;
