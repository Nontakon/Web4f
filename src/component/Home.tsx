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
import QRCode from "qrcode.react";
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
  QRCode?: string | any;
}

interface TableState {
  columns: Array<Column<PartInfo>>;
  data: PartInfo[];
}
interface CountAdd {
  CountADD: number;
}
interface CountReturn {
  CountReturn: number | any;
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

  function remove_firstkks(element: String){
    return element.substr(2,element.length)
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
      let allEquipname = await axios.get(`${process.env.REACT_APP_SERVER_URI}equip_table/allEquipName/${infouser.data[0].KKS1_factory}`)
      setallEquipname(allEquipname.data)
      let IDEmp = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}returnwithdraw/allID/${infouser.data[0].KKS1_factory}`
      );
      setID(IDEmp.data);
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
      { title: "Stock", field: "CountStock" },
      { title: "QRCode", field: "QRCode" }
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
  var now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const handleAdd = async () => {
    let CountNow = await axios.post(
      `${process.env.REACT_APP_SERVER_URI}updateinventory/selectcount`,
      {
        NameEquip: `${equipName}`,
        KKS1: `${userinfo.KKS1_factory}`
      }
    );
    await axios.post(`${process.env.REACT_APP_SERVER_URI}updateinventory/`, {
      CountStock: `${CountNow.data[0].CountStock + count.CountADD}`,
      KKS1: `${userinfo.KKS1_factory}`,
      KKS4: `${CountNow.data[0].KKS4}`
    });
    await axios.post(`${process.env.REACT_APP_SERVER_URI}insertlog/`, {
      token: `${token}`,
      Process: "AddEquipment",
      KKS1: `${userinfo.KKS1_factory}`,
      KKS4: `${CountNow.data[0].KKS4}`,
      Countlog: `${count.CountADD}`,
      Datelog: `${now}`
    });
    setOpenadd(false);
  };

  const handleId = async () => {
    let CountNow = await axios.post(
      `${process.env.REACT_APP_SERVER_URI}updateinventory/selectcount`,
      {
        NameEquip: `${nameEquipSelect}`,
        KKS1: `${userinfo.KKS1_factory}`
      }
    );
    await axios.post(`${process.env.REACT_APP_SERVER_URI}updateinventory/`, {
      CountStock: CountNow.data[0].CountStock + countwithdrawSelect,
      KKS1: `${userinfo.KKS1_factory}`,
      KKS4: `${CountNow.data[0].KKS4}`,
      IDEmp: `${iduseSelect}`
    });
    await axios.post(`${process.env.REACT_APP_SERVER_URI}insertwithdraw/web`, {
      Countwithdraw: broke,
      KKS1: `${userinfo.KKS1_factory}`,
      KKS4: `${CountNow.data[0].KKS4}`,
      IDEmp: `${iduseSelect}`
    });
    await axios.post(`${process.env.REACT_APP_SERVER_URI}insertbrokeequip/`, {
      CountBroke: broke,
      KKS1: `${userinfo.KKS1_factory}`,
      KKS4: `${CountNow.data[0].KKS4}`
    });
    await axios.post(`${process.env.REACT_APP_SERVER_URI}insertlog/return`, {
      IDEmp: `${iduseSelect}`,
      Process: "ReturnEquipment",
      KKS1: `${userinfo.KKS1_factory}`,
      KKS4: `${CountNow.data[0].KKS4}`,
      Countlog: countwithdrawSelect,
      Datelog: `${now}`
    });
    await axios.post(`${process.env.REACT_APP_SERVER_URI}insertlog/return`, {
      IDEmp: `${iduseSelect}`,
      Process: "EquipmentBroke",
      KKS1: `${userinfo.KKS1_factory}`,
      KKS4: `${CountNow.data[0].KKS4}`,
      Countlog: broke,
      Datelog: `${now}`
    });
    setOpenadd(false);
    console.log(iduseSelect);
    console.log(nameEquipSelect);
    console.log(countwithdrawSelect);
    console.log(broke);
  };

  const [valuetab, setValuetab] = React.useState("one"); //problem

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValuetab(newValue);
  };
  const [count, setCount] = React.useState<CountAdd>({ CountADD: 0 });
  const [allEquipname,setallEquipname] = React.useState<string[] | any>([]);
  const [equipName, setEquipName] = React.useState<string[]>([]);

  const handleChangeEquip = (event: React.ChangeEvent<{ value: unknown }>) => {
    setEquipName(event.target.value as string[]);
  };
  const handleChangeQuantity = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCount({ CountADD: parseInt(event.target.value as string, 10) });
  };

  const [idemp, setID] = React.useState<string[] | any>([]);
  const [iduseSelect, setIDselect] = React.useState<string[]>([]);
  const [nameEquipforReturn, setnameEquipforReturn] = React.useState<
    string[] | any
  >([]);
  const [nameEquipSelect, setnameEquipSelect] = React.useState<string[]>([]);
  const [countwithdrawforReturn, setcountwithdrawforReturn] = React.useState<
    CountReturn
  >({ CountReturn: 0 });
  const [countwithdrawSelect, setcountwithdrawSelect] = React.useState<
    number
  >();
  const [broke, setBroke] = React.useState<number>(0);

  const handleChangeID = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setIDselect(event.target.value as string[]);
    let nameEquip = await axios.get(
      `${process.env.REACT_APP_SERVER_URI}returnwithdraw/allName/${event.target.value}`
    );
    setnameEquipforReturn(nameEquip.data);
  };
  const handleChangeEquipforReturn = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setnameEquipSelect(event.target.value as string[]);
    let CountWithdraw = await axios.post(
      `${process.env.REACT_APP_SERVER_URI}returnwithdraw/Count`,
      { IDEmp: `${iduseSelect}`, NameEquip: `${event.target.value}` }
    );
    setcountwithdrawforReturn({
      CountReturn: CountWithdraw.data.Count_withdraw
    });
  };
  const handleChangeCountwithdrawforReturn = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setcountwithdrawSelect(parseInt(event.target.value as string, 10));
    setBroke(
      countwithdrawforReturn.CountReturn -
        parseInt(event.target.value as string, 10)
    );
  };

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
          <AddBut
            variant="outlined"
            color="primary"
            onClick={handleClickOpenAdd}
          >
            Manage Item
          </AddBut>
        </Infoview>
        <MaterialTable
          title="EquipmentData"
          style={{ borderRadius: "15" }}
          columns={state.columns}
          data={state.data.map(({ DateStart, DateExpired, KKS, ...rest }) => {
            return {
              ...rest,
              KKS,
              DateStart: dayjs(DateStart).format("DD/MM/YYYY"),
              DateExpired: dayjs(DateExpired).format("DD/MM/YYYY"),
              QRCode: QRCode && (
                <QRCode value={remove_firstkks(KKS)} size={90} />
              )
            };
          })}
        />

        <DialogExport plantNumber={userinfo.KKS1_factory} />

        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={openadd}
          onClose={handleCloseAdd}
          aria-labelledby="form-dialog-title"
        >
          <div className={classes.root}>
            <div className={classes.tabBackground}>
            <AppBar position="static" color="transparent">
              <Tabs
                value={valuetab}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="wrapped label tabs example"
              >
                <Tab value="one" label="Insert Inventory" wrapped {...a11yProps("one")} />
                <Tab value="two" label="Return Inventory" wrapped {...a11yProps("two")} />
              </Tabs>
            </AppBar>
            </div>
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
                    {[...new Array(allEquipname.length)].map((_, i) => {
                      return (
                        <option value={allEquipname[i].NameEquip}>
                          {allEquipname[i].NameEquip}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  id="standard-basic"
                  label="Quantity"
                  className={classes.formControl}
                  onChange={handleChangeQuantity}
                  type="number"
                />
              </form>
              <Button onClick={handleAdd} color="primary">
                Insert
              </Button>
              <Button onClick={handleCloseAdd} color="primary">
                Cancel
              </Button>
            </TabPanel>
            <TabPanel value={valuetab} index="two">
              <form>
                {/* <TextField id="standard-basic" label="ID" cnpm install @types/qrcode.reactlassName={classes.formControl} onChange={handleChangeID} /> */}
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">ID</InputLabel>
                  <Select
                    native
                    value={iduseSelect}
                    onChange={handleChangeID}
                    input={<Input id="demo-dialog-native" />}
                  >
                    <option aria-label="None" value="" />
                    {[...new Array(idemp.length)].map((_, i) => {
                      return (
                        <option key={i} value={idemp[i].IDEmp}>
                          {idemp[i].IDEmp}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">
                    Equipment
                  </InputLabel>
                  <Select
                    native
                    value={nameEquipSelect}
                    onChange={handleChangeEquipforReturn}
                    input={<Input id="demo-dialog-native" />}
                  >
                    <option aria-label="None" value="" />
                    {[...new Array(nameEquipforReturn.length)].map((_, i) => {
                      return (
                        <option value={nameEquipforReturn[i].NameEquip}>
                          {nameEquipforReturn[i].NameEquip}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">Quantity</InputLabel>
                  <Select
                    native
                    value={countwithdrawSelect}
                    onChange={handleChangeCountwithdrawforReturn}
                    input={<Input id="demo-dialog-native" />}
                  >
                    <option aria-label="None" value="" />
                    <option value={0}>0</option>
                    {[...new Array(countwithdrawforReturn.CountReturn)].map(
                      (_, i) => {
                        return <option value={++i}>{i}</option>;
                      }
                    )}
                  </Select>
                </FormControl>
                <FormControl disabled className={classes.formControl}>
                  <InputLabel htmlFor="component-disabled">
                    Broke Item
                  </InputLabel>
                  <Input id="component-disabled" value={broke} />
                </FormControl>
              </form>
              <Button onClick={handleId} color="primary">
                Return
              </Button>
              <Button onClick={handleCloseAdd} color="primary">
                Cancel
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
      backgroundColor: theme.palette.background.paper,
    },
    tabBackground: {
      backgroundColor: 'orange',
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
const AddBut = styled(Button)`
  &&& {
    position: absolute;
    right: 30px;
    margin-top: 3px;
    font-size: 16px;
    z-index: 99;
  }
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
