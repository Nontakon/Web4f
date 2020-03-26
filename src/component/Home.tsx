import React, { useContext, useEffect } from "react";
import { CounterContext } from "../store/storeprovider";
import { useHistory } from "react-router";
import axios from "axios";
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import MaterialTable, { Column } from "material-table";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Cookies from "js-cookie";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import DialogExport from "./Home/components/DialogExport";
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
    "aria-controls": `wrapped-tabpanel-${index}`
  };
}

interface PartInfo {
  KKS: string;
  NameEquip: string;
  DateStart: Date | string;
  DateExpired: Date | string;
  Life_time: number;
  CountStock: number;
}

interface TableState {
  columns: Array<Column<PartInfo>>;
  data: PartInfo[];
}
interface CountAdd{
  CountADD : number;
}
const Home: React.FC = () => {
  const { push } = useHistory();
  const { KKS1, userName, addKKS1, adduserName } = useContext(CounterContext);
  const token = Cookies.get(`access_token`);
  const [userinfo, setuserinfo] = React.useState({
    NameEmp: "",
    LastNameEmp: "",
    Position: "",
    KKS1_factory: ""
  });
  function remove_last_character(element: String) {
    return element.slice(0, element.length - 1);
  }

  const chacktoken = async () => {
    if (token !== undefined) {
      let infouser = await axios.post(
        `${process.env.REACT_APP_SERVER_URI}equip_table/user`,
        { token: `${token}` }
      );
      // console.log(infouser.data)
      setuserinfo(infouser.data[0]);
      let infodata = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}equip_table/${infouser.data[0].KKS1_factory}`
      );
      // console.log(infodata.data)
      setState(prev => ({ ...prev, data: infodata.data }));
    } else {
      push("/LoginFrom");
    }
  };
  const logout = async () => {
    Cookies.remove("access_token");
    push("/LoginFrom");
  };
  const [state, setState] = React.useState<TableState>({
    columns: [
      { title: "Equipment", field: "NameEquip" },
      { title: "KKSCode", field: "KKS" },
      { title: "DateStart", field: "DateStart" },
      { title: "DateExpired", field: "DateExpired" },
      { title: "Life time", field: "Life_time" },
      { title: "Stock", field: "CountStock" }
    ],
    data: []
  });

  const classes = useStyles();

  const [openadd, setOpenadd] = React.useState(false);

  useEffect(() => {
    chacktoken();
  }, []);

  const handleClickOpenAdd = () => {
    setOpenadd(true);
  };
  const handleCloseAdd = () => {
    setOpenadd(false);
  };
  var now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const handleAdd = async() => {
    let dataInventory = await axios.post(`${process.env.REACT_APP_SERVER_URI}insertinventory/selectcount`,{ NameEquip: `${equipName}`,KKS1 : `${userinfo.KKS1_factory}`})
    await axios.post(`${process.env.REACT_APP_SERVER_URI}insertinventory/`,{CountStock :`${dataInventory.data[0].CountStock + count.CountADD}`,KKS1 : `${userinfo.KKS1_factory}`,KKS4 : `${dataInventory.data[0].KKS4}`})
    await axios.post(`${process.env.REACT_APP_SERVER_URI}insertlog/`,{
      token: `${token}`,
      Process: 'AddEquipment',
      KKS1 : `${userinfo.KKS1_factory}`,
      KKS4 : `${dataInventory.data[0].KKS4}`,
      Countlog: `${count.CountADD}`,
      Datelog : `${now}`
    })
    setOpenadd(false);
  }

  const handleId = () => {
    console.log(now)
    console.log(idemp)
    console.log(equipName)
    console.log(count)
  }

  const [valuetab, setValuetab] = React.useState("one"); //problem

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValuetab(newValue);
  };
  const [count,setCount] = React.useState<CountAdd>({CountADD:0});

  const [equipName, setEquipName] = React.useState<string[]>([]);

  const handleChangeEquip = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEquipName(event.target.value as string[]);
  };
  const handleChangeQuantity = (event: React.ChangeEvent<{ value: unknown }>) =>{
    setCount({CountADD : parseInt(event.target.value as string ,10)});
  }
  const IdEmp = 0;
  const [idemp, setID] = React.useState<number>(IdEmp);
  const handleChangeID = (event: React.ChangeEvent<{ value: unknown }>) => {
    setID(event.target.value as number);
  }

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
        />

        <DialogExport />
        <Button variant="outlined" color="primary" onClick={handleClickOpenAdd}>
          Add
        </Button>
        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={openadd}
          onClose={handleCloseAdd}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.root}>
            <AppBar position="static">
              <Tabs
                value={valuetab}
                onChange={handleChange}
                aria-label="wrapped label tabs example"
              >
                <Tab value="one" label="Add" wrapped {...a11yProps("one")} />
                <Tab value="two" label="Return" wrapped {...a11yProps("two")} />
              </Tabs>
            </AppBar>
            <TabPanel value={valuetab} index="one">
              <form>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">
                    Equipment
                  </InputLabel>
                  <Select
                    native
                    value={equipName}
                    onChange={handleChangeEquip}
                    input={<Input id="demo-dialog-native" />}
                  >
                    <option aria-label="None" value="" />
                    <option value={'Valve'}>Valve</option>
                    <option value={'Flow rate meter'}>Flow rate meter</option>
                    <option value={'Presure meter'}>Presure meter</option>
                  </Select>
                </FormControl>
                <TextField id="standard-basic" label="Quantity" className={classes.formControl} onChange={handleChangeQuantity} />
              </form>
              <Button onClick={handleAdd} color="primary">
                Add
              </Button>
              <Button onClick={handleCloseAdd} color="primary">
                Cancel
              </Button>
            </TabPanel>
            <TabPanel value={valuetab} index="two">
              <form>
                <TextField id="standard-basic" label="ID" className={classes.formControl} onChange={handleChangeID} />
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">
                    Equipment
                  </InputLabel>
                  <Select
                    native
                    value={equipName}
                    onChange={handleChangeEquip}
                    input={<Input id="demo-dialog-native" />}
                  >
                    <option aria-label="None" value="" />
                    <option value={'valve'}>Valve</option>
                    <option value={'Flow rate meter'}>Flow rate meter</option>
                    <option value={'Pressure meter'}>Pressure meter</option>
                  </Select>
                </FormControl>
                <TextField id="standard-basic" label="Quantity" className={classes.formControl} onChange={handleChangeQuantity} />
              </form>
              <Button onClick={handleId} color="primary">
                Add
              </Button>
            </TabPanel>
          </div>
        </Dialog>
      </Viewtable>
    </div>
  );
};

export default Home;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
      width: "fit-content",
      margin: "auto"
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper
    }
  })
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
  &&& {
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
  font-size: 80px;
  font-family: calibri;
`;
