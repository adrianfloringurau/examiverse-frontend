import { Link } from "react-router-dom";

function NotFound() {
    return(
        <div className="full-container">
            <div>
                <p className="error big">404</p>
                <p className="error medium">Not Found</p>
                <p className="error small">Seems you got lost... Navigate to <Link className="error link" to="/">Home</Link> to start again.</p>
            </div>
            
        </div>
    )
}

export default NotFound;