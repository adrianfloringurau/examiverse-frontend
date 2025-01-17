import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './main-components/Home';
import NotFound from './main-components/NotFound';
import Login from './main-components/Login';
import ExamGroup from './main-components/ExamGroup';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Home />} />
      <Route path='/exam-group/:groupId' element={<ExamGroup />} />
      <Route path='/exam-group/:groupId/exam/:examId' element={<Home />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App
