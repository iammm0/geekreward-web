import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './main/App.jsx';
import './main/App.css';
import {UserProvider} from "./contexts/UserContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <UserProvider>
                <App />
            </UserProvider>
        </Router>
    </React.StrictMode>
);
