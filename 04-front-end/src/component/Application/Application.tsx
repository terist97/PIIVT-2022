import React from 'react';
import {Container} from 'react-bootstrap';
import LoginPage from '../Administrator/AdministratorLoginPage/LoginPage';
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
import AdminItemEdit from '../Administrator/Dashboard/AdminItemEdit';
import AuthStore from '../../stores/AuthStore';
import ItemPreview from './User/Item/ItemPreview';
import UserItemPage from './User/UserCategoryPage/UserItemPage';
import { readBuilderProgram } from 'typescript';
import Cart from './User/Cart';
import AdminCategoryAdd from '../Administrator/Dashboard/AdminCategoryAdd';
import AdminCategoryEdit from '../Administrator/Dashboard/AdminCategoryEdit';





function Application() {
  return (

    <Provider  store={AuthStore}>
    
    <Container className="mt-4" >
      <Menu/>
      
      

        <Routes>
          <Route path="/" element={<p><h3>Welcome page</h3><h5>This is application </h5></p>} />
       
          <Route path='/contact' element={ <ContactPage/> }/>
          <Route path='/cart' element={ <Cart/> }/>
          <Route path='/auth/administrator/login' element={ <LoginPage/> } />
          <Route path="/categories" element={<UserCategoryList/>} />
          <Route path="/category/:id" element={<UserCategoryPage/>} />
          <Route path="/category/:id/item/:iid" element={<UserItemPage/>} />
          <Route path="/admin/dashboard/category/add" element={<AdminCategoryAdd/>} />
          <Route path="/admin/dashboard/category/:cid/items/add" element={<AdminItemAdd/>} />
          <Route path="/admin/dashboard/category/:cid/items/list" element={<AdminItemList/>} />
           

          <Route path="/auth/admin/dashboard" element={<AdminDashboard/>}/>
          

          <Route path="/admin/dashboard/category/list" element={<AdminCategoryList/>} />
          <Route path="/admin/dashboard/administrator/list" element={<AdminAdministratorList/>} />
          <Route path="/admin/dashboard/administrator/add" element={<AdminAdministratorAdd/>} />
          <Route path="/admin/dashboard/category/edit/:cid" element={ <AdminCategoryEdit /> } />
          <Route path="/admin/dashboard/category/:cid/items/edit/:iid" element={ <AdminItemEdit /> } />

          
        
          
        </Routes>
     
    </Container>
    </Provider>
   
  );
}

export default Application;
