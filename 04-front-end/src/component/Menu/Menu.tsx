import { useState } from 'react';
import { BrowserRouter, Link} from 'react-router-dom';

import AuthStore from '../../stores/AuthStore';
import AdminDashboard from '../Administrator/Dashboard/AdminDashboard';
import MenuVisitor from './MenuVisitor';
//import AuthReducer from './../../stores/AuthReducer';
import MenuAdministrator from './MenuAdministrator';


export default function Menu() {

     const [role, setRole ]= useState<"visitor" | "user" | "administrator"> (AuthStore.getState().role);

    AuthStore.subscribe(() => {

        setRole(AuthStore.getState().role)

    });


    
    return (
<>
        
         { role === "administrator" && <MenuAdministrator/>}
         { role === "visitor" && 

        
<nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
<Link className="navbar-brand" to="/">Home</Link>
<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
</button>
<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div className="navbar-nav">
        <Link className="nav-item nav-link active" to="/contact">Contact <span className="sr-only"></span></Link>
        <Link className="nav-item nav-link active" to="/cart">Cart <span className="sr-only"></span></Link>
        <Link className="nav-item nav-link active" to="/categories">Categories <span className="sr-only"></span></Link>
        <Link className="nav-item nav-link" to="/auth/administrator/login">Admin login</Link>
       

        
    </div>
</div>
</nav>
    }
    </>

        
     

    );
}