import React, { useState } from 'react'
import "../styles/Login.css";
import Authenticator from './Authenticator';
import { FaUserAstronaut ,FaRegUser} from 'react-icons/fa';
import { Button , useToast} from '@chakra-ui/react';
import {useHistory} from "react-router-dom";
import axios from "axios";

const Login = (props) => {

  const [email,setEmail] = useState("");
  const [password,setPassword]= useState("");
  const [loading,setLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();


  const submitHandler =async()=>{
    setLoading(true);
    if(!email || !password){
      toast({
        title:"Please fill all the fields !",
        status:"Warning",
        duration:5000,
        isClosable:true,
        position:"bottom"

      });
      setLoading(false);
      return;
    }
    try {
      const config ={
        headers :{
          "Content-type": "application/json",
        }

      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          
          email,
          password
          
        },
        config
      );
      
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }


  };



  return (
    <div className="Login">
      <Authenticator/>
      <div className="message">
      <FaUserAstronaut/><p>Hey ! Welcome Back</p>
      </div>
      <div className="message">
      <FaUserAstronaut/><p>Can I get Your Email ?</p>

      </div>
      <div className="userinput">
        <input id='email' type="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}  /><FaRegUser/>
      </div>
      <div className="message">
      <FaUserAstronaut/><p>What's Your Password</p>
      </div>
      <div className="userinput">
        <input id='password' type="password" placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} /><FaRegUser/>
      </div>
      <div className="userinput">
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button><FaRegUser/>
      </div>
      <div className="formchange">
        <button className='Switchbtn' onClick={()=> props.onFormSwitch('signup')} >Not a User ? Signup here</button>
      </div>
    </div>
  )
}

export default Login