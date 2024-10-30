import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Predictions from './Predictions';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/predictions' element={<Predictions />} />
    </Routes>
  );
}

export default App;
