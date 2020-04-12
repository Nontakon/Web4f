import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useHistory } from "react-router";
import { CounterContext } from "../store/storeprovider";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import logo from "../css_style/Logo_kmitl.png";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import Cookies from "js-cookie";
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"; 
import Fade from "@material-ui/core/Fade";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export default function LoginFrom() {
  const classes = useStyles();
  const { push } = useHistory();
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      id: "",
      password: ""
    }
  });
  const { KKS1, userName, addKKS1, adduserName } = useContext(CounterContext);
  const chacktoken = async () => {
    if (Cookies.get(`access_token`) !== undefined) {
      push("/Home");
    }
  };
  useEffect(() => {
    const fetching = async () => {
      try {
        chacktoken();
      } catch (e) {
        console.log(e);
      }
    };
    fetching();
  }, []);
  const onSubmit = async (data: any) => {
    try {
      setChecked(false)
      console.log(data);
      const info = await axios.post(
        `${process.env.REACT_APP_SERVER_URI}employee/web`,
        {
          ID: `${data.id}`,
          Pass: `${data.password}`
        }
      );
      console.log(info.data);
      if (info.data === true){
        setChecked(true);
        console.log("hi")
      } 
      // addKKS1(info.data.KKS1);
      // adduserName(info.data.user);
      await Cookies.set(`access_token`, `${info.data.token}`, {
        expires: new Date(new Date().getTime() + 16 * 60 * 60 * 1000)
      });
      push("/Home");
    } catch (e) {
      setChecked(true);
      console.log(e);
    }
  };

  const [checked, setChecked] = React.useState(false);
  
  return (
    <Background>
      <Container>
        <Imagelogo src={logo} />
        <Gridfrom onSubmit={handleSubmit(onSubmit)}>
          <StyledTextField
            id="standard-basic"
            label="ID"
            inputRef={register({ required: true, pattern: /([0-9]){13}/i })}
            type="text"
            name="id"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RootAccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            name="password"
            inputRef={register({ required: true, min: 1 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RootLockIcon />
                </InputAdornment>
              ),
            }}
          />
          <Fade in={checked}>
            <div className={classes.root}>
              <Alert variant="filled" severity="error">
                Login failed - Please check ID or Password
              </Alert>
            </div>
          </Fade>
          <Submitbutton variant="contained" type="submit">
            Submit
          </Submitbutton>
        </Gridfrom>
      </Container>
    </Background>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const Container = styled.div`
  margin: auto;
  display: grid;
`;
const Background = styled.div`
  display: flex;
  min-height: 90vh;
`;
const RootAccountCircleIcon = styled(AccountCircleIcon)`
  &&& {
    height: 30px;
    width: 30px;
    padding: 16px 0 30px;
  }
`;
const RootLockIcon = styled(LockIcon)`
  &&& {
    height: 30px;
    width: 30px;
    padding: 16px 0 30px;
  }
`;
const StyledTextField = styled(TextField)`
  &&& {
    width: 300px;
    padding: 20px 0;
    margin: auto;
    margin-top: 10px;
  }
`;
const Imagelogo = styled.img`
  width: 300px;
`;
const Gridfrom = styled.form`
  display: grid;
`;
const Submitbutton = styled(Button)`
  &&& {
    width: 250px;
    margin: 16px auto;
    align-content: center;
    color: white;
    background-color: orange;
  }
`;
