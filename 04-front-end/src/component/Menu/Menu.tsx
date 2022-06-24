import { BrowserRouter, Link} from 'react-router-dom';


export default function Menu() {
    return (

        <BrowserRouter>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/">Home</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-item nav-link active" to="/contact">Contact <span className="sr-only">(current)</span></Link>
                        <Link className="nav-item nav-link active" to="/categories">categories <span className="sr-only">(current)</span></Link>
                        <Link className="nav-item nav-link" to="/auth/administrator/login">Admin login</Link>
                        
                        
    </div>
  </div>
</nav>

        
        </BrowserRouter>

    );
}