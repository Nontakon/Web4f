import React, { useEffect, Component } from "react";
import axios from "axios";
import styled from "styled-components";
import dayjs from "dayjs";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Cookies from "js-cookie";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const StyledFormControl = styled(FormControl)`
  margin: 1rem;
  min-width: 120;
`;
interface CountAdd {
    CountADD: number;
}
interface CountReturn {
    CountReturn: number | any;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
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
interface Props{
    plantNumber : string;
    updateData: (arg: PartInfo[]) => void;

}

const DialogManage: React.FC<Props> = ({ plantNumber = "",updateData }) => {
    useEffect(() => {
        const fetching = async () => {
            try {
                if (plantNumber !== "") {
                    let allEquipname = await axios.get(
                      `${process.env.REACT_APP_SERVER_URI}equip_table/allEquipName/${plantNumber}`
                    );
                    setallEquipname(allEquipname.data);
                    let IDEmp = await axios.get(
                        `${process.env.REACT_APP_SERVER_URI}returnwithdraw/allID/${plantNumber}`
                    );
                    setID(IDEmp.data);
                }
            } catch (e) {
                console.log(e);
            }
            };
        fetching();
    }, [plantNumber]);
   
    const token = Cookies.get(`access_token`);
    var now = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const classes = useStyles();
    const [openadd, setOpenadd] = React.useState(false);
    const handleAdd = async (props : any) => {
      let CountNow = await axios.post(
        `${process.env.REACT_APP_SERVER_URI}updateinventory/selectcount`,
        {
          NameEquip: `${equipName}`,
          KKS1: `${plantNumber}`
        }
      );
      await axios.post(`${process.env.REACT_APP_SERVER_URI}updateinventory/`, {
        CountStock: `${CountNow.data[0].CountStock + count.CountADD}`,
        KKS1: `${plantNumber}`,
        KKS4: `${CountNow.data[0].KKS4}`
      });
      await axios.post(`${process.env.REACT_APP_SERVER_URI}insertlog/`, {
        token: `${token}`,
        Process: "AddEquipment",
        KKS1: `${plantNumber}`,
        KKS4: `${CountNow.data[0].KKS4}`,
        Countlog: `${count.CountADD}`,
        Datelog: `${now}`
      });
      let infodata = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}equip_table/${plantNumber}`
      );
      updateData(infodata.data);
      // console.log(infodata.data)
      // setState(prev => ({ ...prev, data: infodata.data }));
      setOpenadd(false);
    };

    const handleId = async (props: any) => {
      let CountNow = await axios.post(
        `${process.env.REACT_APP_SERVER_URI}updateinventory/selectcount`,
        {
          NameEquip: `${nameEquipSelect}`,
          KKS1: `${plantNumber}`
        }
      );
      await axios.post(`${process.env.REACT_APP_SERVER_URI}updateinventory/`, {
        CountStock: CountNow.data[0].CountStock + countwithdrawSelect,
        KKS1: `${plantNumber}`,
        KKS4: `${CountNow.data[0].KKS4}`,
        IDEmp: `${iduseSelect}`
      });
      await axios.post(
        `${process.env.REACT_APP_SERVER_URI}insertwithdraw/web`,
        {
          Countwithdraw: broke,
          KKS1: `${plantNumber}`,
          KKS4: `${CountNow.data[0].KKS4}`,
          IDEmp: `${iduseSelect}`
        }
      );
      await axios.post(`${process.env.REACT_APP_SERVER_URI}insertbrokeequip/`, {
        CountBroke: broke,
        KKS1: `${plantNumber}`,
        KKS4: `${CountNow.data[0].KKS4}`
      });
      await axios.post(`${process.env.REACT_APP_SERVER_URI}insertlog/return`, {
        IDEmp: `${iduseSelect}`,
        Process: "ReturnEquipment",
        KKS1: `${plantNumber}`,
        KKS4: `${CountNow.data[0].KKS4}`,
        Countlog: countwithdrawSelect,
        Datelog: `${now}`
      });
      await axios.post(`${process.env.REACT_APP_SERVER_URI}insertlog/return`, {
        IDEmp: `${iduseSelect}`,
        Process: "EquipmentBroke",
        KKS1: `${plantNumber}`,
        KKS4: `${CountNow.data[0].KKS4}`,
        Countlog: broke,
        Datelog: `${now}`
      });
      let infodata = await axios.get(
        `${process.env.REACT_APP_SERVER_URI}equip_table/${plantNumber}`
      );
      // console.log(infodata.data)
        updateData(infodata.data);
      // setState(prev => ({ ...prev, data: infodata.data }));
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
    const [allEquipname, setallEquipname] = React.useState<string[] | any>([]);
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
    const handleClickOpenAdd = () => {
        setOpenadd(true);
    };
    const handleCloseAdd = () => {
        setOpenadd(false);
    };

    return (
        <>
            <AddBut
                variant="outlined"
                color="primary"
                onClick={handleClickOpenAdd}
            >
                Manage Item
          </AddBut>
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
                        <option key={i} value={allEquipname[i].NameEquip}>
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
        </>
    )
}

export default DialogManage

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

const AddBut = styled(Button)`
  &&& {
    position: absolute;
    right: 30px;
    margin-top: 3px;
    font-size: 16px;
    z-index: 99;
  }
`;