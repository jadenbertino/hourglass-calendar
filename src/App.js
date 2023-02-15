import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// pages & components
import { Home, SignUp, SignIn } from './pages/pages'
import { Nav } from './components/components'

// styles
import './App.css';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        {/* <Route path="/signin" element={<SignIn />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
