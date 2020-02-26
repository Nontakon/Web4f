import React, { useContext,useState, useEffect } from "react";
import { CounterContext} from "../store/storeprovider"
import {useHistory } from "react-router";
import axios from "axios";
import styled, { css } from "styled-components";
import dayjs from 'dayjs'
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
    const {KKS1, userName,addKKS1,adduserName} = useContext(CounterContext)
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
        addKKS1("")
        adduserName("")
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
              <Item2><input  
              type="text"
              placeholder="NameEquip"
              name="NameEquip"></input></Item2>
              <Item2><input  
              type="text"
              placeholder="KKS"
              name="KKS"></input></Item2>
              <Item2><input  
              type="text"
              placeholder="KKS1"
              name="KKS1"></input></Item2>
              <Item2><input  
              type="text"
              placeholder="KKS4"
              name="KKS4"></input></Item2>
              <Item2><input  
              type="text"
              placeholder="DateStart"
              name="DateStart"></input></Item2>
              <Item2><input  
              type="text"
              placeholder="DateExpired"
              name="DateExpired"></input></Item2>
              <Item2><input  
              type="text"
              placeholder="Life_time"
              name="Life_time"></input></Item2>
              <Item2><input  
              type="text"
              placeholder="CountStock"
              name="CountStock"></input></Item2>
              {
                partInfo.map(({NameEquip,KKS,KKS1,KKS4,DateStart,DateExpired,Life_time,CountStock})=><>
                <p>{NameEquip}</p>
                <p>{KKS}</p>
                <p>{KKS1}</p>
                <p>{KKS4}</p>
                <p>{dayjs(DateStart).format('DD/MM/YYYY')}</p>
                <p>{dayjs(DateExpired).format('DD/MM/YYYY')}</p>
                <p>{Life_time}</p>
                <p>{CountStock}</p>
                </>)
              }
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
  padding: .5rem
  border-style: dotted;
  ${css`
      font-size: 18px;
      font-weight: bold;
    `}
`;