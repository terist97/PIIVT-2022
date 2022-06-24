import React from 'react';
import {Container} from 'react-bootstrap';
import LoginPage from '../Administrator/LoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './Application.sass';
import Menu from '../Menu/Menu';
import UserCategoryList from './User/UserCategoryList/UserCategoryList';
import UserCategoryPage from './User/UserCategoryPage/UserCategoryPage';



function Application() {
  return (
    <Container className="mt-4">
      <Menu/>
      
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<div><p>safasfs</p></div>} />
          <Route path='/contact' element={ <ContactPage/> }/>
          <Route path='/auth/administrator/login' element={ <LoginPage/> } />
          <Route path="/categories" element={<UserCategoryList/>} />
          <Route path="/category/:id" element={<UserCategoryPage/>} />

          
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default Application;
