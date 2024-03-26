
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import Mychats from "../components/Mychats";
import Sidebar from "../components/Sidebar";
import { ChatState } from "../context/ChatProvider";
import "../styles/chatpage.css";

export default function Chatpage() {
  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);



  return (
    <div className="Chatpage">
      {user && <Sidebar />}
      {user && <Mychats fetchAgain={fetchAgain} />}
      {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
    </div>




  )
}
