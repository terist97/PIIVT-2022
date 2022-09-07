import React from 'react';
import {Container} from 'react-bootstrap';
import LoginPage from '../Administrator/LoginPage';
import ContactPage from '../Pages/ContactPage/ContactPage';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './Application.sass';
import Menu from '../Menu/Menu';
import UserCategoryList from './User/UserCategoryList/UserCategoryList';
import UserCategoryPage from './User/UserCategoryPage/UserCategoryPage';
import AdminDashboard from '../Administrator/Dashboard/AdminDashboard';
import AdminCategoryList from '../Administrator/Dashboard/AdminCategoryList';
import AdminAdministratorList from '../Administrator/Dashboard/AdminAdministratorList';
import AdminAdministratorAdd from '../Administrator/Dashboard/AdminAdministratorAdd';
import AdminItemAdd from '../Administrator/Dashboard/AdminItemAdd';
import AdminItemList from '../Administrator/Dashboard/AdminItemList';
import { Provider } from 'react-redux';



function Application() {
  return (
    
    <Container className="mt-4">
      <Menu/>
      
      

        <Routes>
          <Route path="/" element={<div><p>safasfs</p></div>} />
          <Route path='/contact' element={ <ContactPage/> }/>
          <Route path='/auth/administrator/login' element={ <LoginPage/> } />
          <Route path="/categories" element={<UserCategoryList/>} />
          <Route path="/category/:id" element={<UserCategoryPage/>} />
          <Route path="/admin/dashboard/category/:cid/items/add" element={<AdminItemAdd/>} />
          <Route path="/admin/dashboard/category/:cid/items/list" element={<AdminItemList/>} />
           

          <Route path="/auth/admin/dashboard" element={<AdminDashboard/>}/>

          <Route path="/admin/dashboard/category/list" element={<AdminCategoryList/>} />
          <Route path="/admin/dashboard/administrator/list" element={<AdminAdministratorList/>} />
          <Route path="/admin/dashboard/administrator/add" element={<AdminAdministratorAdd/>} />

          

          
        </Routes>
     
    </Container>
   
  );
}

export default Application;
