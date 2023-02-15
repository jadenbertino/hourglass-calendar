import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// pages & components
import { Home } from './pages/pages'
import { Nav } from './components/components'

// styles
import './App.css';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
