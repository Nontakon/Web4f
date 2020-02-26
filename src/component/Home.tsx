import React, { useContext,useState, useEffect } from "react";
import { CounterContext} from "../store/storeprovider"
import {useHistory } from "react-router";
import axios from "axios";
import styled, { css } from "styled-components";
// import { Grid } from '@material-ui/core';

interface PartInfo {
  KKS: string
  KKS1: string
  NameEquip: string
  KKS4: string
  DateStart: Date
  DateExpired: Date
  Life_time: number
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
    const editdata=()=>{
      console.log(partInfo[0])
    }
    return (
        <div>
          <div><button onClick ={logout}>
                log out
            </button>
          </div>
          <div>
               factory : {KKS1}
          </div>
          <div>
              hi {userName}
          </div>
          <div>
            <button onClick ={consol}>
                show console
            </button>
            
          </div> 
          <div>
            <Grid>
              <Item>NameEquip</Item>
              <Item>KKS</Item>
              <Item>KKS1</Item>
              <Item>KKS4</Item>
              <Item>DateStart</Item>
              <Item>DateExpired</Item>
              <Item>Life_time</Item>
              <Item>CountStock</Item>
              {/* <Item>edit</Item> */}
              {
                partInfo.map(({NameEquip,KKS,KKS1,KKS4,DateStart,DateExpired,Life_time,CountStock})=><>
                <p>{NameEquip}</p>
                <p>{KKS}</p>
                <p>{KKS1}</p>
                <p>{KKS4}</p>
                <p>{DateStart}</p>
                <p>{DateExpired}</p>
                <p>{Life_time}</p>
                <p>{CountStock}</p>
                </>)
              }
              {/* <Item>{partInfo[0].NameEquip}</Item> */}
              {/* <Item>{partInfo[0].KKS}</Item>
              <Item>{partInfo[0].KKS1}</Item>
              <Item>{partInfo[0].KKS4}</Item>
              <Item>{partInfo[0].DateStart}</Item>
              <Item>{partInfo[0].DateExpired}</Item>
              <Item>{partInfo[0].Life_time}</Item>
              <Item>{partInfo[0].CountStock}</Item> */}
               {/* <Item2><button onClick ={editdata}>edit</button></Item2> */}
            </Grid>
          </div>
        </div>
    )
}

export default Home

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(10, 1fr);
  grid-gap: 5px;
  border-style: solid;
  
`;
export const Item = styled.div`
  display: flex;
  justify-content: center;
  padding: .5rem;
  border-style: dotted;
  
  ${css`
      font-size: 18px;
      font-weight: bold;
    `}
`;
export const Item2 = styled.div`
  display: flex;
  justify-content: center;
  padding: .5rem;
  border-style: dotted;
  ${css`
      font-size: 18px;
      font-weight: bold;
    `}
`;