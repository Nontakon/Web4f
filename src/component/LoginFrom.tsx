import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  useHistory 
} from "react-router";
import { CounterContext} from "../store/storeprovider"
export default function LoginFrom() {
  const { push } = useHistory () 
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      id: "1409800338149",
      password: "123456789"
    }
  });
  const {KKS1,userName,addKKS1, adduserName } = useContext(CounterContext)
  const onSubmit = async (data: any) => {
    try {
      let info = await axios({
        method: "post",
        responseType: "json",
        url: "http://localhost:5000/employee/web",
        data: {
          ID: `${data.id}`,
          Pass: `${data.password}`
        },
      withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Credentials": true
        }
      });
      // console.log(info.data);
      addKKS1(info.data.KKS1)
      adduserName(info.data.user)
      console.log (KKS1,userName)
      push('/Home')

    } catch (e) {
      console.log("login fail");
    }
  };
  console.log({ errors });

  return (
    <nav>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="ID"
        name="id"
        ref={register({ required: true, pattern: /([0-9]){13}/i })}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        ref={register({ required: true, min: 1 })}
      />

      <input type="submit" />
    </form>
    </nav>
    
  );
}