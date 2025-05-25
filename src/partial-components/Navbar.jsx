import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css";
import logout from "../javascript/logout";

function Navbar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // State for dark mode
    const [username, setUsername] = useState("");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Load the username and dark mode preference from localStorage
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername || "User");

        const storedDarkMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(storedDarkMode);

        // Apply dark mode class to the body if needed
        if (storedDarkMode) {
            document.body.classList.add("dark-mode");
        }
    }, []);

    // Handle clicks outside of the dropdown to close it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem("darkMode", newDarkMode);

        // Toggle dark mode class on the body
        if (newDarkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    };

    return (
        <>
            <nav>
                <Link id="logo" to="/">
                    <h1>EXAMiVERSE</h1>
                </Link>
                <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                    {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
                <div className="user-menu" ref={dropdownRef}>
                    <button className="user-button" onClick={toggleDropdown}>
                        <h1>{username}</h1>
                    </button>
                    {dropdownVisible && (
                        <div className="dropdown">
                            <button onClick={logout}>Log out</button>
                            <button onClick={() => navigate("/change-password")}>
                                Change Password
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;