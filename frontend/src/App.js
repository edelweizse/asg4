import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Predicts from './Predicts';

function App() {
  return (
    <div className='bg-gray-900 p-3'>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/predicts' element={<Predicts />} />
      </Routes>
    </div>
    
  );
}

export default App;
