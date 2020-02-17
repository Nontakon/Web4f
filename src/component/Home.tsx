import React, { useContext } from "react";
import { CounterContext} from "../store/storeprovider"
import {useHistory } from "react-router";
import axios from "axios";


const Home:React.FC = () => {
    const { push } = useHistory () 
    const {KKS1, userName} = useContext(CounterContext)
    const logout = async() =>{
        let info = await axios({
            method: "get",
            responseType: "json",
            url: "http://localhost:5000/employee/clear_cookie",
          withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              "Access-Control-Allow-Credentials": true
            }
          });
        push('/LoginFrom')
    }
    return (
        <div>
            hi {userName}
            factory : {KKS1}
            <button onClick ={logout}>
                log out
            </button>
        </div>
    )
}

export default Home
