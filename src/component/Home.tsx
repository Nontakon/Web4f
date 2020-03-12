import React, { useContext,useState, useEffect } from "react";
import { CounterContext} from "../store/storeprovider"
import {useHistory } from "react-router";
import axios from "axios";
import styled, { css } from "styled-components";
import dayjs from 'dayjs'
import MaterialTable, { Column } from 'material-table';
import Button from "@material-ui/core/Button";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Cookies from "js-cookie";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import { Grid } from '@material-ui/core';

interface PartInfo {
  KKS: string
  NameEquip: string
  DateStart: Date | string
  DateExpired: Date | string
  Life_time: number
  CountStock: number
}
interface WithdrawInfo {
  NameEmployee: string
  IDEmployee: string
  KKS: string
  KKSCode: number
  DateWithdraw: Date | string
}
interface TableState {
  columns: Array<Column<PartInfo>>;
  data: PartInfo[];
}
interface TableWithdraw {
  columns: Array<Column<WithdrawInfo>>;
  data: WithdrawInfo[];
}
const Home:React.FC = () => {
    const { push } = useHistory () 
    const {KKS1, userName,addKKS1,adduserName} = useContext(CounterContext)
    const token = Cookies.get(`access_token`)
    const [userinfo, setuserinfo] = React.useState({
      NameEmp:'',
      LastNameEmp: '',
      Position: '',
      KKS1_factory: ''
    });
    const chacktoken = async() => {
      if(token !==undefined){
        let  infouser  = await axios.post(`http://10.26.14.160:5000/equip_table/user`,{ token: `${token}`}) 
        // console.log(infouser.data)
        setuserinfo(infouser.data)
        let  infodata  = await axios.get(`http://10.26.14.160:5000/equip_table/${infouser.data.KKS1_factory}`) 
        // console.log(infodata.data)
        setState((prev) => ({ ...prev, data : infodata.data}))
      }else{
        push('/LoginFrom')
      }
    }
    const logout = async() =>{
        Cookies.remove('access_token')
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
    const [withdrawLog, setWithdrawLog] = React.useState<TableWithdraw>({
      columns: [
        { title: 'NameEmployee', field: 'NameEmployee' },
        { title: 'IDEmployee', field: 'IDEmployee' },
        { title: 'NameEquip',field: 'NameEquip',},
        { title: 'KKSCode',field: 'KKSCode',},
        { title: 'DateWithdraw',field: 'DateWithdraw',},
      ],
      data: [],
    });
    useEffect(()=>{
      const fetching = async()=>{
        try{
          chacktoken()
         
        }catch(e){
          console.log(e)
          console.log(e)
        }
    }
    fetching()
    },[])
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [month, setMonth] = React.useState<number | string>('');

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMonth(Number(event.target.value) || '');
    };

    const handleClickOpen = () => {
    setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
    };

    const showmonth = () => {
    console.log(month);
    setOpen(false);  
    };

    return (
      <div>
        <Headnav>
          <Label>Warehouse</Label>
          <Logoutbut color="inherit" onClick={logout} startIcon={<ExitToAppIcon/>}>Log out</Logoutbut>
        </Headnav>
        <Viewtable>
          <Infoview>{userinfo.NameEmp} &nbsp;{userinfo.LastNameEmp} &nbsp; factory : {userinfo.KKS1_factory} </Infoview>
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
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Export
      </Button>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Withdraw Log</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Insert month and year
              </DialogContentText>
              <form>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">Month</InputLabel>
                  <Select
                    native
                    value={month}
                    onChange={handleChange}
                    input={<Input id="demo-dialog-native" />}
                  >
                    <option value="" />
                    <option value={1}>January</option>
                    <option value={2}>Febuary</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </Select>
                </FormControl>

              </form>
              <MaterialTable
                title=""
                style={{ borderRadius: "15"}}
                columns={withdrawLog.columns}
                data={withdrawLog.data.map(({DateWithdraw, ...rest }) => ({
                  ...rest,
                  DateWithdraw: dayjs(DateWithdraw).format("DD/MM/YYYY")
                }))}
          />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                Cancel
                </Button>
                <Button onClick={showmonth} color="primary">
                Export
                </Button>
            </DialogActions>
          </Dialog>
        </Viewtable>
      </div>
    );
}

export default Home

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

const Headnav = styled.div`
  background-color: orange;
  height: 130px;
  width: 100%;
  position: fixed;
  z-index: 1000;
`;
const Viewtable = styled.div`
  padding: 140px 30px 20px 30px;
  /* border: 2px solid black; */
  background-color: whitesmoke;
  border-radius: 3px;
`;

const Logoutbut = styled(Button)`
&&&{
  position: absolute;
  right: 30px;
  margin-top: 2%;
  color: whitesmoke;
  border-width: 5px;
  font-size: 22px;
}
`;
const Infoview = styled.div`
  flex-direction: row;
  font-family: calibri;
  font-size: 30px;
  padding: 10px 0 20px 0;
`;
const Label = styled.div`
  display: flex;
  margin: 10px 0 0 30px;
  position: absolute;
  color: white;
  font-size : 80px;
  font-family: calibri;
`;
