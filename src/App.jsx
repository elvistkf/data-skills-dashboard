import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import Loading from './components/Loading';
import NavBar from './components/NavBar';
import Optimiser from './pages/Optimiser';
import responseData from "./assets/response.json";

function App() {
    const [state, setState] = useState("fetching")
    const [data, setData] = useState(null)

    const [alert, setAlert] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                // let response = await axios.get("https://data.mongodb-api.com/app/data-skills-api-ihkuj/endpoint/api/skills");
                // response = response.data;
                const response = responseData;
                setData(response);
            } catch (e) {
                console.error(e);
                setData(responseData)
            } finally {
                setState("fetched")
            }
        }
        fetchData();
    }, [])

    return (
        <Router>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/" element={state === "fetched" ? <Dashboard data={data} /> : <Loading/>} />
                    <Route path="/optimiser" element={state === "fetched" ? <Optimiser data={data} showAlert={alert} setAlert={setAlert} /> : <Loading/>} />
                </Routes>
            </div>
        </Router>
    )
}

export default App;