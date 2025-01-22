import { Link } from "react-router-dom";
import '../css/navbar.css';
import logout from "../javascript/logout";

function Navbar() {
    return(
        <>
            <nav>
                <Link id="logo" to="/">
                    <h1>EXAMiVERSE</h1>
                </Link>
                <button className="button" onClick={() => logout()}>
                    <h1>Log out</h1>
                </button>
            </nav>
        </>
    )
}

export default Navbar;