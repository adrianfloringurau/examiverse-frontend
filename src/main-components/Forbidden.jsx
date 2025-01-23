import { Link } from "react-router-dom";

function Forbidden() {
    return(
        <div className="full-container">
            <div>
                <p className="error big">403</p>
                <p className="error medium">Forbidden</p>
                <p className="error small">This content is locked... Navigate to <Link className="error link" to="/">Home</Link> to start again.</p>
            </div>
            
        </div>
    )
}

export default Forbidden;