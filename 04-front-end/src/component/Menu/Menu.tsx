import { BrowserRouter, Link} from 'react-router-dom';
import AdminDashboard from '../Administrator/Dashboard/AdminDashboard';
//import AuthReducer from './../../stores/AuthReducer';


export default function Menu() {

    // const [role, setRole ]= useState<"visitor" | "user" | "administrator"> (AuthReducer.getState().role);

    // AuthStore.subcribe(() => {

    //     setRole(AuthStore.getState().role)

    // });

    
    return (

        
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <Link className="navbar-brand" to="/">Home</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-item nav-link active" to="/contact">Contact <span className="sr-only">(current)</span></Link>
                        <Link className="nav-item nav-link active" to="/categories">categories <span className="sr-only">(current)</span></Link>
                        <Link className="nav-item nav-link" to="/auth/administrator/login">Admin login</Link>

                        <Link className="nav-item nav-link" to="/auth/admin/dashboard">AdminDashboard</Link>
                
                        
    </div>
  </div>
</nav>

        
     

    );
}