import { Link } from "react-router-dom";
import AuthStore from "../../stores/AuthStore";

export default function MenuVisitor(){
    return (


        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <Link className="navbar-brand" to="/">Hi, visitor</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
                <Link className="nav-item nav-link active" to="/contact">Contact <span className="sr-only">(current)</span></Link>
                <Link className="nav-item nav-link active" to="/korpa">Korpa <span className="sr-only">(current)</span></Link>
                <Link className="nav-item nav-link active" to="/categories">Categories <span className="sr-only">(current)</span></Link>
                <Link className="nav-item nav-link" to="/auth/administrator/login">Admin login</Link>
               
        
                
            </div>
        </div>
    </nav>
    );
}