import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import MaterialTable, { Column } from "material-table";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Cookies from "js-cookie";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import XLSX from "xlsx";
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
  KKS_Equip_Withdraw: string;
  Date_withdraw: Date | string;
  Count_withdraw: number;
}

interface TableWithdraw {
  columns: Array<Column<WithdrawInfo>>;
  data: WithdrawInfo[];
}

const DialogExport: React.FC = () => {
  const [open, setOpen] = React.useState(false);
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
        let infowithdraw = await axios.get(
          `http://localhost:5000/selectwithdraw/${year}-${month}`
        );
        console.log(infowithdraw.data);
        setWithdrawLog(prev => ({ ...prev, data: infowithdraw.data }));
      } catch (e) {
        console.log(e);
      }
    };
    fetching();
  }, [year, month]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
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
        Name: NameEmp,
        Lastname: LastNameEmp,
        ID: IDEmp,
        Equipment: NameEquip,
        KKSCode: KKS_Equip_Withdraw,
        Date: dayjs(Date_withdraw).format("DD/MM/YYYY HH:mm:ss"),
        Quantity: Count_withdraw
      })
    );
    const ws = XLSX.utils.json_to_sheet(dataexcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    XLSX.writeFile(wb, `WithdrawReport : ${month}-${year} .xlsx`);
    setOpen(false);
  };
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Export
      </Button>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Withdraw Log</DialogTitle>
        <DialogContent>
          <DialogContentText>Insert month and year</DialogContentText>
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
            data={withdrawLog.data.map(({ Date_withdraw, ...rest }) => ({
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
    </>
  );
};

export default DialogExport;
