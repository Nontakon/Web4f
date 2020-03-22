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
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
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
import XLSX from 'xlsx';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import { Grid } from '@material-ui/core';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

const [valuetab, setValuetab] = React.useState('one'); //problem

const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
  setValuetab(newValue);
};
interface PartInfo {
  KKS: string
  NameEquip: string
  DateStart: Date | string
  DateExpired: Date | string
  Life_time: number
  CountStock: number
}
interface WithdrawInfo {
  NameEmp: string
  LastNameEmp : string
  IDEmp: string
  NameEquip: string
  KKS_Equip_Withdraw: string
  Date_withdraw: Date | string
  Count_withdraw: number
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

    function remove_last_character(element:String){
      return element.slice(0, element.length - 1)
    }

    const chacktoken = async() => {
      if(token !==undefined){
        let infouser = await axios.post(`http://localhost:5000/equip_table/user`,{ token: `${token}`}) 
        // console.log(infouser.data)
        setuserinfo(infouser.data)
        let infodata = await axios.get(`http://localhost:5000/equip_table/${infouser.data.KKS1_factory}`) 
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
        { title: 'Equipment', field: 'NameEquip' },
        { title: 'KKSCode', field: 'KKS' },
        { title: 'DateStart',field: 'DateStart',},
        { title: 'DateExpired',field: 'DateExpired',},
        { title: 'Life time',field: 'Life_time',},
        { title: 'Stock',field: 'CountStock',},
      ],
      data: [],
    });
    const [withdrawLog, setWithdrawLog] = React.useState<TableWithdraw>({
      columns: [
        { title: "Name", field: "NameEmp" },
        { title: "Lastname", field: "LastNameEmp" },
        { title: "ID", field: "IDEmp" },
        { title: "Equipment", field: "NameEquip" },
        { title: "KKSCode", field: "KKS_Equip_Withdraw" },
        { title: "Date", field: "Date_withdraw" },
        { title: "Quantity", field: "Count_withdraw" }
      ],
      data: []
    });

    
   
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const MonthNow = dayjs().format('M')
  // const MonthNow = 2
    const [month, setMonth] = React.useState<number | string>(MonthNow);
    const YearNow = dayjs().format('YYYY')
    const [year, setYear] = React.useState<number | string>(YearNow);
  useEffect(() => {
    const fetching = async () => {
      try {
        chacktoken()
        let infowithdraw = await axios.get(`http://localhost:5000/selectwithdraw/${year}-${month}`)
        console.log(infowithdraw.data)
        setWithdrawLog((prev) => ({ ...prev, data: infowithdraw.data }))
      } catch (e) {
        console.log(e)
        // console.log(e)
      }
    }
    fetching()
  }, [year, month])
    const handleMonth = (event: React.ChangeEvent<{ value: unknown }>) => {
      setMonth(Number(event.target.value) || '');
    console.log(month);
    };
    
    const handleYear = (event: React.ChangeEvent<{ value: unknown }>) => {
    setYear(Number(event.target.value) || '');
    console.log(year)
    };

    const handleClickOpen = () => {
    setOpen(true);
    };
    const handleClose = () => {
    setOpen(false);
    };

    const handleClickOpenAdd = () => {
    setOpen(true);
    };
    const handleCloseAdd = () => {
    setOpen(false);
    };

    const showmonth = () => {
    const dataexcel = withdrawLog.data.map(
      ({
        NameEmp,
        LastNameEmp,
        IDEmp,
        NameEquip,
        KKS_Equip_Withdraw,
        Date_withdraw,
        Count_withdraw
      }) => ({
        Name : NameEmp,
        Lastname : LastNameEmp,
        ID : IDEmp,
        Equipment : NameEquip,
        KKSCode : KKS_Equip_Withdraw,
        Date : dayjs(Date_withdraw).format("DD/MM/YYYY HH:mm:ss"),
        Quantity : Count_withdraw,

      })
    );
    const ws = XLSX.utils.json_to_sheet(dataexcel);
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb,ws,'SheetJS')
    XLSX.writeFile(wb,`WithdrawReport : ${month}-${year} .xlsx`)
    setOpen(false);  
    };

    const [fullWidth, setFullWidth] = React.useState(true);

    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg');

    return (
      <div>
        <Headnav>
          <Label>Warehouse</Label>
          <Logoutbut
            color="inherit"
            onClick={logout}
            startIcon={<ExitToAppIcon />}
          >
            Log out
          </Logoutbut>
        </Headnav>
        <Viewtable>
          <Infoview>
            {userinfo.NameEmp} &nbsp;{userinfo.LastNameEmp} &nbsp; factory :{" "}
            {remove_last_character(userinfo.KKS1_factory)}{" "}
          </Infoview>
          <MaterialTable
            title="EquipmentData"
            style={{ borderRadius: "15" }}
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
          <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Withdraw Log</DialogTitle>
            <DialogContent>
              <DialogContentText>Insert month and year</DialogContentText>
              <form>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">Month</InputLabel>
                  <Select
                    native
                    value={month}
                    onChange={handleMonth}
                    input={<Input id="demo-dialog-native" />}
                  >
                    {[...new Array(12)].map((_, i) => {
                      // console.log(i)
                      return (
                        <option
                          value={dayjs()
                            .add(0 - i, "month")
                            .format("M")}
                        >
                          {dayjs()
                            .add(0 - i, "month")
                            .format("MMMM")}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">Year</InputLabel>
                  <Select
                    native
                    value={year}
                    onChange={handleYear}
                    input={<Input id="demo-dialog-native" />}
                  >
                    {[...new Array(4)].map((_, i) => {
                      // console.log(i)
                      return (
                        <option
                          value={dayjs()
                            .add(0 - i, "year")
                            .format("YYYY")}
                        >
                          {dayjs()
                            .add(0 - i, "year")
                            .format("YYYY")}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </form>
              <MaterialTable
                title=""
                style={{ borderRadius: "15" }}
                columns={withdrawLog.columns}
                data={withdrawLog.data.map(({Date_withdraw, ...rest }) => ({
                  ...rest,
                  Date_withdraw: dayjs(Date_withdraw).format("DD/MM/YYYY")
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
          <Button variant="outlined" color="primary" onClick={handleClickOpenAdd}>
            Add
          </Button>
          <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleCloseAdd}
            aria-labelledby="form-dialog-title"
          >
            <div className={classes.root}>
              <AppBar position="static">
                <Tabs value={valuetab} onChange={handleChange} aria-label="wrapped label tabs example">
                  <Tab
                    value="one"
                    label="Add"
                    wrapped
                    {...a11yProps('one')}
                  />
                  <Tab 
                    value="two" 
                    label="Return"
                    wrapped
                    {...a11yProps('two')} />
                </Tabs>
              </AppBar>
              <TabPanel value={valuetab} index="one">
                Item One
              </TabPanel>
              <TabPanel value={valuetab} index="two">
                Item Two
              </TabPanel>
            </div>

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
      width: 'fit-content',
      margin: 'auto',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
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
