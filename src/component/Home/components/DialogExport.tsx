import React, { useEffect } from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import MaterialTable, { Column } from "material-table";
import Button from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import XLSX from "xlsx";

const StyledFormControl = styled(FormControl)`
margin: 1rem;
min-width: 120;
`;
interface WithdrawInfo {
    NameEmp: string;
    LastNameEmp: string;
    IDEmp: string;
    NameEquip: string;
    Process: string;
    DateLog: Date | string;
    CountLog: number;
}

interface TableWithdraw {
    columns: Array<Column<WithdrawInfo>>;
    data: WithdrawInfo[];
}

 interface Props{
    plantNumber : string;
} 

export const DialogExport: React.FC<Props> = ({plantNumber=0}) => {
    console.log(plantNumber);
    const [open, setOpen] = React.useState(false);
    const [withdrawLog, setWithdrawLog] = React.useState<TableWithdraw>({
        columns: [
            { title: "Name", field: "NameEmp" },
            { title: "Lastname", field: "LastNameEmp" },
            { title: "ID", field: "IDEmp" },
            { title: "Equipment", field: "NameEquip" },
            { title: "Process", field: "Process" },
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
                let infowithdraw = await axios.get(
                    `${process.env.REACT_APP_SERVER_URI}selectlog/${year}-${month}`
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
    const exportXlsx = () => {
        const dataexcel = withdrawLog.data.map(
            ({
                NameEmp,
                LastNameEmp,
                IDEmp,
                NameEquip,
                Process,
                DateLog,
                CountLog
            }) => ({
                Name: NameEmp,
                Lastname: LastNameEmp,
                ID: IDEmp,
                Equipment: NameEquip,
                Process : Process,
                Date: dayjs(DateLog).format("DD/MM/YYYY HH:mm:ss"),
                Quantity: CountLog
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
            <ButDiv>
            <ExportBut variant="outlined" color="primary" onClick={handleClickOpen}>
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
                <DialogTitle id="form-dialog-title">Inventory Log</DialogTitle>
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
                                        <option key={i}
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
                                        <option key={i}
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
                            DateLog: dayjs(DateLog).format("DD/MM/YYYY")
                        }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={exportXlsx} color="primary">
                        Export
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DialogExport;

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