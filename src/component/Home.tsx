import React, { useContext,useState, useEffect } from "react";
import { CounterContext} from "../store/storeprovider"
import {useHistory } from "react-router";
import axios from "axios";
import { Grid } from '@material-ui/core';

interface PartInfo {
  KKS: string
  KKS1: string
  NameEquip: string
  KKS4: string
  DateStart: Date
  DateExpired: Date
  Lift_time: number
  CountStock: number
}
const Home:React.FC = () => {
    const { push } = useHistory () 
    const {KKS1, userName} = useContext(CounterContext)
    const logout = async() =>{
        await axios({
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
    const [partInfo, setPartInfo] = useState([] as PartInfo[])
    useEffect(()=>{
      const fetching = async()=>{
        try{
          let { data } = await axios.get(`http://localhost:5000/equip_table/${KKS1}`)
          // console.log(data)
          setPartInfo(data)
          
        }catch(e){
          console.log(e)
        }
    }
    fetching()
    },[KKS1])
    const consol=()=>{
      console.log(partInfo)
    }
    return (
        <div>
            hi {userName}
            factory : {KKS1}
            <button onClick ={logout}>
                log out
            </button>
            <div>
              {/* <Grid 
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={1}
                  >
              <Grid container item xs={12} spacing={3}>

              </Grid>
            </Grid> */}
            <button onClick ={consol}>
                show console
            </button>
            </div>
            
        </div>
    )
}

export default Home
