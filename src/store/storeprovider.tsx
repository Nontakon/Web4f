import React, { createContext, useReducer } from "react"

const initialState = {
    KKS1 : "",
    userName :"",
    addKKS1:(payload:string)=>{},
    adduserName:(payload:string)=>{}
  }
  export const CounterContext = createContext(initialState)
  
  const counterReducer = (state : any, action : any) => {
    switch (action.type) {
      case "ADD_KKS":
        return {
          ...state, // copy state 
          KKS1: action.payload // set state counter
        }
      case "ADD_userName":
        return {
          ...state, // copy state 
          userName: action.payload // set state counter
        }
    }
  }
  export const Storeprovider:React.FC = ({ children }) => {
    const [counterState, counterDispatch] = useReducer(
      counterReducer,
      initialState
    )
        // console.log(counterState)
    const { KKS1,userName } = counterState
  
    const addKKS1 = (payload:string) =>
      counterDispatch({ type: "ADD_KKS", payload }) // ส่ง type ADD_COUNTER และ payload เพื่อให้ conterReducer ไปใช้งานต่อ
    const adduserName = (payload:string) =>
      counterDispatch({ type: "ADD_userName", payload }) // ส่ง type SUB_COUNTER และ payload เพื่อให้ conterReducer ไปใช้งานต่อ
  
    return (
      <CounterContext.Provider value={{ KKS1, userName, addKKS1 , adduserName }}>
        {children}
      </CounterContext.Provider>
    )
  }