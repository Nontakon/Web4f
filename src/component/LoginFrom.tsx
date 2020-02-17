import React from 'react';
import { useForm } from 'react-hook-form';
import axios from "axios";
import home from "./Home";
export default function LoginFrom() {
  const { register, handleSubmit, errors } = useForm({
      defaultValues:{
          id:'1409800338149',
          password:'123456789'
      }
  });
  const onSubmit = async (data: any) => {
      
    try {
                    let info = await axios({
                        method: 'post',
                        responseType: 'json',
                        url: 'http://localhost:5000/employee/web',
                        data: {                         
                                            ID: `${data.id}`,
                                            Pass: `${data.password}`
                        }
                    });
                    console.log(info.data)
                    
  } catch (e) {
                console.log("login fail");
    }
  }
  console.log({errors});
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="ID" name="id" ref={register({required: true,pattern: /([0-9]){13}/i})}/>
      <input type="password" placeholder="Password" name="password" ref={register({required: true, min: 1})} />

      <input type="submit" />
    </form>
  );
}
// import React, { useState, useEffect,Fragment } from "react";
// import axios from "axios";
// import Grid from '@material-ui/core/Grid'
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
// import classes from "*.module.css";
// import {useForm} from "react-hook-form";
// import Button from '@material-ui/core/Button';
// const useStyles = makeStyles(theme => ({
// }));

// export default function LoginFrom() {
//     const accountForm = useForm();
//     const [loginInput, setLoginInput] = useState({
//         ID: "1409800338149",
//         password: "123456789"
//     });
//     const [loginInfo, setLoginInfo] = useState({
//         token: "Guestlogin",
//         KKS1 : "",
//         User : "",
//     });    
//     const  onSubmit = async() => {
//         let data ={
//             ID: `${loginInput.ID}`,
//             Pass: `${loginInput.password}`
//         }
//         console.log(data)
//         try {
//             let info = await axios({
//                 method: 'post',
//                 responseType: 'json',
//                 url: 'http://localhost:5000/employee/web',
//                 data: data
//               });
//             // const  info  = await axios.post(`http://localhost:5000/employee/web`, {body:{
//             //     ID: `${ID}`,
//             //     Pass: `${password}`}
//             // });
//             console.log(info.data)
//             console.log("------------------------")
//             setLoginInfo((prev)=>({...prev, token : info.data.token }))
//             setLoginInfo((prev)=>({...prev, User : info.data.user }))
//             setLoginInfo((prev)=>({...prev, KKS1 : info.data.KKS1 }))
//             // this.setState({defaultAnimationDialog : info.data.defaultAnimationDialog });
//             console.log("sucess")
//           } catch (e) {
//             console.log("login fail");
//             // this.setState({ defaultAnimationDialog: true });
//           }
//         // TODO: implement signInWithEmailAndPassword()
//       }
    
//     return (
//         <Fragment>
//             <div className={classes.root}>
//             <form onSubmit={accountForm.handleSubmit(onSubmit)}>
//                 <Grid container
//                     direction="row"
//                     justify="center"
//                     alignItems="center"
//                     spacing ={1}
//                     >
//                         <Grid item md={12} xs={12}>
//                         <TextField
//                             id="ID"
//                             label="ID"
//                             margin="normal"
//                             variant="outlined"
//                         />
//                         </Grid>
//                         <Grid item md={12} xs={12}>
//                         <TextField
//                             onChange={Pass => setLoginInput((prev)=>({...prev, Passwords: Pass }))}
//                             id="password"
//                             label="Password"
//                             margin="normal"
//                             variant="outlined"
//                             type="password"
//                         />
//                         </Grid>
//                     </Grid>
//                     </form>
//                     <Button
//                     onClick={onSubmit}
//                     >
//                     Back
//                 </Button>
//             </div>
//         </Fragment>
    //   <section className="section container">
    //     <div className="columns is-centered">
    //       <div className="column is-half">
    //         <form>
    //           <div className="field">
    //             <label className="label">ID</label>
    //             <div className="control">
    //               <input 
    //                 className="input" 
    //                 type="text" 
    //                 name="ID"
    //                 onChange={this.onChange} />
    //             </div>
    //           </div>

    //           <div className="field">
    //             <label className="label">Password</label>
    //             <div className="control">
    //               <input 
    //                 className="input" 
    //                 type="password"
    //                 name="password"
    //                 onChange={this.onChange} />
    //             </div>
    //           </div>

    //           <div className="field is-grouped">
    //             <div className="control">
    //               <button className="button is-link" onClick ={()=>this.onSubmit}>Submit</button>
    //             </div>
    //             <div className="control">
    //               <button className="button is-text">Cancel</button>
    //             </div>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   </section>
//     )
//   }