import { Link } from "react-router-dom";
import '../css/navbar.css';

function Navbar() {
    return(
        <>
            <nav>
                <Link id="logo" to="/">
                    <h1>EXAMiVERSE</h1>
                </Link>
                <Link to="/logout">
                    <h1>Log out</h1>
                </Link>
            </nav>
        </>
    )
}

export default Navbar;