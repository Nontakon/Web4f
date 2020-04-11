import React, { useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import dayjs from "dayjs";
import MaterialTable, { Column } from "material-table";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import XLSX from "xlsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";


const StyledFormControl = styled(FormControl)`
margin: 1rem;
min-width: 120;
`;
interface WithdrawInfo {
    NameEmp: string;
    LastNameEmp: string;
    IDEmp: string;
    NameEquip: string;
    DateLog: Date | string;
    CountLog: number;
}
interface AddInfo {
    NameEmp: string;
    LastNameEmp: string;
    IDEmp: string;
    NameEquip: string;
    DateLog: Date | string;
    CountLog: number;
}
interface ChangeInfo {
    NameEmp: string;
    LastNameEmp: string;
    IDEmp: string;
    NameEquip: string;
    KKSCode : string;
    DateLog: Date | string;
}
interface ReturnInfo {
    NameEmp: string;
    LastNameEmp: string;
    IDEmp: string;
    NameEquip: string;
    DateLog: Date | string;
    CountLog: number;
}
interface BrokeInfo {
    NameEmp: string;
    LastNameEmp: string;
    IDEmp: string;
    NameEquip: string;
    DateLog: Date | string;
    CountLog: number;
}
interface TableWithdraw {
    columns: Array<Column<WithdrawInfo>>;
    data: WithdrawInfo[];
}
interface TableAdd {
    columns: Array<Column<AddInfo>>;
    data: AddInfo[];
}
interface TableChange {
    columns: Array<Column<ChangeInfo>>;
    data: ChangeInfo[];
}
interface TableReturn {
   columns: Array<Column<ReturnInfo>>;
    data: ReturnInfo[];
}
interface TableBroke {
   columns: Array<Column<BrokeInfo>>;
    data: BrokeInfo[];
}

 interface Props{
    plantNumber : string;
} 

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function a11yProps(index: any) {
    return {
        id: `wrapped-tab-${index}`,
        "aria-controls": `wrapped-tabpanel-${index}`
    };
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

export const DialogExport: React.FC<Props> = ({plantNumber=""}) => {
    // console.log(plantNumber);
    const [open, setOpen] = React.useState(false);
    const [withdrawLog, setWithdrawLog] = React.useState<TableWithdraw>({
        columns: [
            { title: "Name", field: "NameEmp" },
            { title: "Lastname", field: "LastNameEmp" },
            { title: "ID", field: "IDEmp" },
            { title: "Equipment", field: "NameEquip" },
            { title: "Date", field: "DateLog" },
            { title: "Quantity", field: "CountLog" }
        ],
        data: []
    });
    const [addLog, setAddLog] = React.useState<TableAdd>({
        columns: [
            { title: "Name", field: "NameEmp" },
            { title: "Lastname", field: "LastNameEmp" },
            { title: "ID", field: "IDEmp" },
            { title: "Equipment", field: "NameEquip" },
            { title: "Date", field: "DateLog" },
            { title: "Quantity", field: "CountLog" }
        ],
        data: []
    });
    const [changeLog, setChangeLog] = React.useState<TableChange>({
      columns: [
        { title: "Name", field: "NameEmp" },
        { title: "Lastname", field: "LastNameEmp" },
        { title: "ID", field: "IDEmp" },
        { title: "Equipment", field: "NameEquip" },
        { title: "KKS Code", field: "KKSCode" },
        { title: "Date", field: "DateLog" },
      ],
      data: [],
    });
    const [returnLog, setReturnLog] = React.useState<TableReturn>({
        columns: [
            { title: "Name", field: "NameEmp" },
            { title: "Lastname", field: "LastNameEmp" },
            { title: "ID", field: "IDEmp" },
            { title: "Equipment", field: "NameEquip" },
            { title: "Date", field: "DateLog" },
            { title: "Quantity", field: "CountLog" }
        ],
        data: []
    });
    const [brokeLog, setBrokeLog] = React.useState<TableBroke>({
        columns: [
            { title: "Name", field: "NameEmp" },
            { title: "Lastname", field: "LastNameEmp" },
            { title: "ID", field: "IDEmp" },
            { title: "Equipment", field: "NameEquip" },
            { title: "Date", field: "DateLog" },
            { title: "Quantity", field: "CountLog" }
        ],
        data: []
    });
    const MonthNow = dayjs().format("M");
    const YearNow = dayjs().format("YYYY");
    const [month, setMonth] = React.useState<number | string>(MonthNow);
    const [year, setYear] = React.useState<number | string>(YearNow);
    const handleMonth = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMonth(Number(event.target.value) || "");
        console.log(month);
    };

    const handleYear = (event: React.ChangeEvent<{ value: unknown }>) => {
        setYear(Number(event.target.value) || "");
        console.log(year);
    };
    useEffect(() => {
        const fetching = async () => {
            try {
                if(plantNumber !== ""){
                    let infowithdraw = await axios.post(
                        `${process.env.REACT_APP_SERVER_URI}selectlog/withdraw`,{Month : `${month}`,Year : `${year}`,KKS1 : `${plantNumber}` }
                    );
                    // console.log(infowithdraw.data);
                    setWithdrawLog(prev => ({ ...prev, data: infowithdraw.data }));
                    let infoAdd = await axios.post(
                        `${process.env.REACT_APP_SERVER_URI}selectlog/add`, { Month: `${month}`, Year: `${year}`, KKS1: `${plantNumber}` }
                    );
                    // console.log(infowithdraw.data);
                    setAddLog(prev => ({ ...prev, data: infoAdd.data }));
                    let infoChange = await axios.post(
                        `${process.env.REACT_APP_SERVER_URI}selectlog/changeequipment`, { Month: `${month}`, Year: `${year}`, KKS1: `${plantNumber}` }
                    );
                    // console.log(infowithdraw.data);
                    setChangeLog((prev) => ({ ...prev, data: infoChange.data }));
                    let infoReturn= await axios.post(
                        `${process.env.REACT_APP_SERVER_URI}selectlog/return`, { Month: `${month}`, Year: `${year}`, KKS1: `${plantNumber}` }
                    );
                    // console.log(infowithdraw.data);
                    setReturnLog((prev) => ({ ...prev, data: infoReturn.data }));
                    let infoBroke= await axios.post(
                        `${process.env.REACT_APP_SERVER_URI}selectlog/broke`, { Month: `${month}`, Year: `${year}`, KKS1: `${plantNumber}` }
                    );
                    // console.log(infowithdraw.data);
                    setBrokeLog((prev) => ({ ...prev, data: infoBroke.data }));
                }
            }catch (e) {
                console.log(e);
            }
        };
        fetching();
    }, [year, month,plantNumber]);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const exportXlsxWithdraw = () => {
        const dataexcel = withdrawLog.data.map(
            ({
                NameEmp,
                LastNameEmp,
                IDEmp,
                NameEquip,
                DateLog,
                CountLog
            }) => ({
                Name: NameEmp,
                Lastname: LastNameEmp,
                ID: IDEmp,
                Equipment: NameEquip,
                Date: dayjs(DateLog).format("DD/MM/YYYY HH:mm:ss"),
                Quantity: CountLog
            })
        );
        const ws = XLSX.utils.json_to_sheet(dataexcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, `WithdrawEquipmentReport : ${month}-${year} .xlsx`);
        setOpen(false);
    };
    const exportXlsxAdd = () => {
        const dataexcel = addLog.data.map(
            ({
                NameEmp,
                LastNameEmp,
                IDEmp,
                NameEquip,
                DateLog,
                CountLog
            }) => ({
                Name: NameEmp,
                Lastname: LastNameEmp,
                ID: IDEmp,
                Equipment: NameEquip,
                Date: dayjs(DateLog).format("DD/MM/YYYY HH:mm:ss"),
                Quantity: CountLog
            })
        );
        const ws = XLSX.utils.json_to_sheet(dataexcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, `AddEquipmentReport : ${month}-${year} .xlsx`);
        setOpen(false);
    };
    const exportXlsxChange = () => {
        const dataexcel = changeLog.data.map(
            ({
                NameEmp,
                LastNameEmp,
                IDEmp,
                NameEquip,
                KKSCode,
                DateLog
            }) => ({
                Name: NameEmp,
                Lastname: LastNameEmp,
                ID: IDEmp,
                Equipment: NameEquip,
                KKS_Code : KKSCode,
                Date: dayjs(DateLog).format("DD/MM/YYYY HH:mm:ss"),

            })
        );
        const ws = XLSX.utils.json_to_sheet(dataexcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, `ChangeEquipmentReport : ${month}-${year} .xlsx`);
        setOpen(false);
    };
    const exportXlsxReturn = () => {
        const dataexcel = returnLog.data.map(
            ({
                NameEmp,
                LastNameEmp,
                IDEmp,
                NameEquip,
                DateLog,
                CountLog
            }) => ({
                Name: NameEmp,
                Lastname: LastNameEmp,
                ID: IDEmp,
                Equipment: NameEquip,
                Date: dayjs(DateLog).format("DD/MM/YYYY HH:mm:ss"),
                Quantity: CountLog
            })
        );
        const ws = XLSX.utils.json_to_sheet(dataexcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, `ReturnEquipmentReport : ${month}-${year} .xlsx`);
        setOpen(false);
    };
    const exportXlsxBroke = () => {
        const dataexcel = brokeLog.data.map(
            ({
                NameEmp,
                LastNameEmp,
                IDEmp,
                NameEquip,
                DateLog,
                CountLog
            }) => ({
                Name: NameEmp,
                Lastname: LastNameEmp,
                ID: IDEmp,
                Equipment: NameEquip,
                Date: dayjs(DateLog).format("DD/MM/YYYY HH:mm:ss"),
                Quantity: CountLog
            })
        );
        const ws = XLSX.utils.json_to_sheet(dataexcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, `BrokeEquipmentReport : ${month}-${year} .xlsx`);
        setOpen(false);
    };
    const classes = useStyles();
    const [valuetab, setValuetab] = React.useState("one"); 

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setValuetab(newValue);
    };
    
    return (
      <>
        <ButDiv>
          <ExportBut
            variant="outlined"
            color="primary"
            onClick={handleClickOpen}
          >
            Export
          </ExportBut>
        </ButDiv>
        <Dialog
          fullWidth
          maxWidth={"lg"}
          open={open}
          onClose={handleClose}
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
                  <Tab
                    value="one"
                    label="Withdraw Equipment history"
                    wrapped
                    {...a11yProps("one")}
                  />
                  <Tab
                    value="two"
                    label="Add Equipment history"
                    wrapped
                    {...a11yProps("two")}
                  />
                  <Tab
                    value="three"
                    label="Change Equipment history"
                    wrapped
                    {...a11yProps("three")}
                  />
                  <Tab
                    value="four"
                    label="Return Equipment history"
                    wrapped
                    {...a11yProps("four")}
                  />
                  <Tab
                    value="five"
                    label="Broke Equipment history"
                    wrapped
                    {...a11yProps("five")}
                  />
                </Tabs>
              </AppBar>
            </div>
            <TabPanel value={valuetab} index="one">
              <form>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
              </form>
              <MaterialTable
                title=""
                style={{ borderRadius: "15" }}
                columns={withdrawLog.columns}
                data={withdrawLog.data.map(({ DateLog, ...rest }) => ({
                  ...rest,
                  DateLog: dayjs(DateLog).format("DD/MM/YYYY"),
                }))}
              />
              <ExportDiv>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={exportXlsxWithdraw} color="primary">
                  Export
                </Button>
              </ExportDiv>
            </TabPanel>
            <TabPanel value={valuetab} index="two">
              <form>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
              </form>
              <MaterialTable
                title=""
                style={{ borderRadius: "15" }}
                columns={addLog.columns}
                data={addLog.data.map(({ DateLog, ...rest }) => ({
                  ...rest,
                  DateLog: dayjs(DateLog).format("DD/MM/YYYY"),
                }))}
              />
              <ExportDiv>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={exportXlsxAdd} color="primary">
                  Export
                </Button>
              </ExportDiv>
            </TabPanel>
            <TabPanel value={valuetab} index="three">
              <form>
                <StyledFormControl>
                  <InputLabel htmlFor="demo-dialog-native">Month</InputLabel>
                  <Select
                    native
                    value={month}
                    onChange={handleMonth}
                    input={<Input id="demo-dialog-native" />}
                  >
                    {[...new Array(12)].map((_, i) => {
                      // console.log(i)
                      const monthString = dayjs()
                      .add(0 - i, "month")
                      .format("MMMM")
                      return (
                        <option
                          key={monthString}
                          value={dayjs()
                            .add(0 - i, "month")
                            .format("M")}
                        >
                          {monthString}
                        </option>
                      );
                    })}
                  </Select>
                </StyledFormControl>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
              </form>
              <MaterialTable
                title=""
                style={{ borderRadius: "15" }}
                columns={changeLog.columns}
                data={changeLog.data.map(({ DateLog, ...rest }) => ({
                  ...rest,
                  DateLog: dayjs(DateLog).format("DD/MM/YYYY"),
                }))}
              />
              <ExportDiv>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={exportXlsxChange} color="primary">
                  Export
                </Button>
              </ExportDiv>
            </TabPanel>
            <TabPanel value={valuetab} index="four">
              <form>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
              </form>
              <MaterialTable
                title=""
                style={{ borderRadius: "15" }}
                columns={returnLog.columns}
                data={returnLog.data.map(({ DateLog, ...rest }) => ({
                  ...rest,
                  DateLog: dayjs(DateLog).format("DD/MM/YYYY"),
                }))}
              />
              <ExportDiv>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={exportXlsxReturn} color="primary">
                  Export
                </Button>
              </ExportDiv>
            </TabPanel>
            <TabPanel value={valuetab} index="five">
              <form>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
                <StyledFormControl>
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
                          key={i}
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
                </StyledFormControl>
              </form>
              <MaterialTable
                title=""
                style={{ borderRadius: "15" }}
                columns={brokeLog.columns}
                data={brokeLog.data.map(({ DateLog, ...rest }) => ({
                  ...rest,
                  DateLog: dayjs(DateLog).format("DD/MM/YYYY"),
                }))}
              />
              <ExportDiv>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={exportXlsxBroke} color="primary">
                  Export
                </Button>
              </ExportDiv>
            </TabPanel>
          </div>
         
        </Dialog>
      </>
    );
};

export default DialogExport;

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

const ExportBut = styled(Button)`
  &&&{
    margin-top: 10px;
    font-size: 16px;
    z-index: 99;
  }
`;

const ButDiv = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ExportDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
`;