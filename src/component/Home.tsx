import React, { useContext,useState, useEffect } from "react";
import { CounterContext} from "../store/storeprovider"
import {useHistory } from "react-router";
import axios from "axios";
import styled, { css } from "styled-components";
import dayjs from 'dayjs'
import MaterialTable, { Column } from 'material-table';
// import { Grid } from '@material-ui/core';

interface PartInfo {
  KKS: string
  NameEquip: string
  DateStart: Date | string
  DateExpired: Date | string
  Life_time: number
  CountStock: number
}
interface TableState {
  columns: Array<Column<PartInfo>>;
  data: PartInfo[];
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
    const [state, setState] = React.useState<TableState>({
      columns: [
        { title: 'NameEquip', field: 'NameEquip' },
        { title: 'KKS', field: 'KKS' },
        { title: 'DateStart',field: 'DateStart',},
        { title: 'DateExpired',field: 'DateExpired',},
        { title: 'Life_time',field: 'Life_time',},
        { title: 'CountStock',field: 'CountStock',},
      ],
      data: [],
    });
    useEffect(()=>{
      const fetching = async()=>{
        try{
          let  infodata  = await axios.get(`http://localhost:5000/equip_table/${KKS1}`) 
          console.log(infodata.data)
          setState((prev) => ({ ...prev, data : infodata.data}))
          
        }catch(e){
          console.log(e)
        }
    }
    fetching()
    },[KKS1])
    const consol=()=>{
      console.log(state.data)
    }
    const editdata=()=>{
      console.log(state.data)
    }
    return (
      <div>
        <div>
          <button onClick={logout}>log out</button>
        </div>
        <div>factory : {KKS1}</div>
        <div>Log in by {userName}</div>
        <Viewtable>
          <MaterialTable
            title="EquipmentData"
            style={{ borderRadius: "15"}}
            columns={state.columns}
            data={state.data.map(({ DateStart, DateExpired, ...rest }) => ({
              ...rest,
              DateStart: dayjs(DateStart).format("DD/MM/YYYY"),
              DateExpired: dayjs(DateExpired).format("DD/MM/YYYY")
            }))}
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    setState(prevState => {
                      const data = [...prevState.data];
                      data.push(newData);
                      return { ...prevState, data };
                    });
                  }, 600);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    if (oldData) {
                      setState(prevState => {
                        const data = [...prevState.data];
                        data[data.indexOf(oldData)] = newData;
                        return { ...prevState, data };
                      });
                    }
                  }, 600);
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    setState(prevState => {
                      const data = [...prevState.data];
                      data.splice(data.indexOf(oldData), 1);
                      return { ...prevState, data };
                    });
                  }, 600);
                })
            }}
          />
        </Viewtable>
      </div>
    );
}

export default Home

const Viewtable = styled.div`
  margin-top: 20px;
  padding: 0 50px 0 50px;
`;