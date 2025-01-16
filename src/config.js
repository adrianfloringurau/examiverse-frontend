const config = {
    frontend: process.env.REACT_APP_FRONTEND_LINK || 'http://localhost:5173',
    backend: process.env.REACT_APP_BACKEND_LINK || 'http://localhost:5000/api',
}

export default config;