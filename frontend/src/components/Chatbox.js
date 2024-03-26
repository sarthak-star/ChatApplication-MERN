import React from 'react';
import "../styles/chatbox.css";

import SingleChat from './SingleChat';


const Chatbox = ({fetchAgain , setFetchAgain}) => {
  
  return (
    <div className="chatbox" >
      <SingleChat  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
   
  )
}

export default Chatbox