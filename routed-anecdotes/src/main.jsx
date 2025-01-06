import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
    BrowserRouter as Router,
    Routes, Route, Link,
    useParams,
    useNavigate,
    useMatch,
    Navigate
  } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <App />
    </Router>
)