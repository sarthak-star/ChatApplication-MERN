import React, { useEffect, useState } from 'react';
import "../styles/Homepage.css";
import Login from "../components/Login";
import Signup from "../components/Signup"
import { useHistory } from 'react-router-dom';

const Loginpage = () => {
    const [currentForm, setCurrentForm] = useState('signup');

    const toggleForm = (formName) => {
        setCurrentForm(formName);
    }

    const history = useHistory();
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if(user){
            history.push("/chat");
        }

    },[history]);

    
    return (
        <div className="Loginpage">
            <div className="Form">
                <div className="formcard">
                    {
                        currentForm === 'login' ? <Login onFormSwitch={toggleForm} /> : <Signup onFormSwitch={toggleForm} />
                    }

                </div>
            </div>

            <div className="heading_vertical">
                <div className="heading">
                    ChatFlix
                </div>
            </div>
        </div>
    )
}

export default Loginpage