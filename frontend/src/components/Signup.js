import React, { useState } from 'react'
import "../styles/signup.css";
import Authenticator from './Authenticator';
import { FaUserAstronaut ,FaRegUser} from 'react-icons/fa';
import { Button, useToast } from '@chakra-ui/react'
import {useHistory} from "react-router-dom";
import axios from "axios";

const Login = (props) => {


  const [username,setUsername] = useState("");
  const [email,setEmail]= useState("");
  const [password,setPassword]=useState("");
  const [pic,setPic] =useState();
  const [PicLoading,setPicLoading]=useState(false);
  const toast = useToast();
  const history=useHistory();

  const postDetails =(pics)=>{
    setPicLoading(true);
    if(pics === undefined){
      toast({
        title: 'Please select an image !',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ChatFlix");
      data.append("cloud_name", "sarthakproject");
      fetch("https://api.cloudinary.com/v1_1/sarthakproject/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };
  
  


  const submitHandler =async()=>{
    setPicLoading(true);
    if(!username || !email || !password){
      toast({
        title: "Please Fill All The Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;

    }
    console.log(username,email,password,pic);
    try {
      const config ={
        headers :{
          "Content-type": "application/json",
        }

      };
      const { data } = await axios.post(
        "/api/user",
        {
          username,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
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
      setPicLoading(false);
    }

  };


  


  return (
    <div className="Login">
      <Authenticator/>
      <div className="message">
      <FaUserAstronaut/><p>Hey ! Welcome to ChatFlix</p>
      </div>
      <div className="message">
      <FaUserAstronaut/><p>What should we call you?</p>

      </div>
      <div className="userinput">
        <input id='fullname' type="text" placeholder='Enter Username' value={username} onChange={(e) => setUsername(e.target.value)} /><FaRegUser/>
      </div>
      <div className="message">
      <FaUserAstronaut/><p>Can I get Your Email ?</p>

      </div>
      <div className="userinput">
        <input id='emailid' type="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} /><FaRegUser/>
      </div>
      <div className="message">
      <FaUserAstronaut/><p>Set a Password</p>
      </div>
      <div className="userinput">
        <input id='password' type="password" placeholder='Enter pass' value={password} onChange={(e) => setPassword(e.target.value)} /><FaRegUser/>
      </div>
      
      <div className="message">
      <FaUserAstronaut/><p>Can i get a pic of you?</p>
      </div>
      <div className="userinput fileinput ">
        <input id='profilepicture' type="file" accept='image/*' onChange={(e) => postDetails(e.target.files[0])} /><FaRegUser/>
      </div>
      <div className="userinput">
        
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={PicLoading}
      >
        Sign Up
      </Button><FaRegUser/>
      </div>
      <div className="formchange">
        <button className='Switchbtn' onClick={()=> props.onFormSwitch('login')} >Already a User ? Login instead</button>
      </div>
    </div>
  )
};

export default Login