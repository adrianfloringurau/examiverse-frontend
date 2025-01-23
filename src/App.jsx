import { Route, Routes } from 'react-router-dom';
import Home from './main-components/Home';
import NotFound from './main-components/NotFound';
import Login from './main-components/Login';
import ExamGroup from './main-components/ExamGroup';
import Exam from './main-components/Exam';
import ExamGroupForm from './main-components/ExamGroupForm';
import ExamForm from './main-components/ExamForm';
import Register from './main-components/Register';
import ChangePassword from './main-components/ChangePassword';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/change-password' element={<ChangePassword />} />
      <Route path='/exam-group/:groupId' element={<ExamGroup />} />
      <Route path='/exam-group/:groupId/exam/:examId' element={<Exam />} />
      <Route path='/exam-group/new' element={<ExamGroupForm />} />
      <Route path='/exam-group/:groupId/exam/new' element={<ExamForm />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App
