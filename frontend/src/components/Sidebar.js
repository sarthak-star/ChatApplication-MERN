import React from 'react';
import "../styles/sidebar.css";
import { Avatar, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './profilemodal';
import { useHistory } from 'react-router-dom';
import { VscColorMode } from "react-icons/vsc";
import "../styles/singlechat.css";
import LoveTheme from "../Assets/LoveTheme.jpg";
import LightTheme from "../Assets/LightTheme.jpeg";
import SpaceTheme from "../Assets/SpaceTheme.jpg";
import SkyTheme from "../Assets/SkyTheme.jpeg";
import { getSenderEmail } from './chatlogic';




const Sidebar = () => {
  

  const history = useHistory();
  

  const ChangeTheme = (theme) => {
    console.log(theme);
    var root = document.querySelector(':root');
    
    
    root.style.setProperty('--bg-img-url', `url(${theme})`);

  }

 






  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  }




  const {user,notification,setNotification,setSelectedChat} = ChatState();
  return (
    <div className='sidebar' >
      <div className='sidebarup' >
        <Menu>
          <MenuButton color={'black'} colorScheme='purple' p={0} width={"50px"} as={Button} >
            <Avatar size="xs" cursor="pointer" name={user?.username} src={user?.pic} />
          </MenuButton>
          <MenuList color={"#CED4DA"} borderColor={"#212529"} bg={"#212529"} >
            <ProfileModal bg={"#212529"} user={user}>
              <MenuItem bg={"#212529"} >My Profile</MenuItem>
            </ProfileModal>
            <MenuItem bg={"#212529"} onClick={logoutHandler} >Logout</MenuItem>
          </MenuList>
        </Menu>


        <Menu>
          <MenuButton p={1}>
          
            <FaBell color='#CED4DA' fontSize={"1.5rem"} />

          

          
          </MenuButton>
          <MenuList pl={2} color={"#CED4DA"} borderColor={"#212529"} bg={"#212529"} >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSenderEmail(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>

        </Menu>
      </div>

      <div>
        <Menu>
          <MenuButton>
            <VscColorMode color='#DEE2E6' fontSize={"1.5rem"} />
          </MenuButton>
          <MenuList color={"#CED4DA"} borderColor={"#212529"} bg={"#212529"} >
            <MenuItem bg={"#212529"} onClick={()=> ChangeTheme(LoveTheme)}  >LoveTheme</MenuItem>
            <MenuItem bg={"#212529"} onClick={()=> ChangeTheme(LightTheme)} >LightTheme</MenuItem>
            <MenuItem bg={"#212529"} onClick={()=> ChangeTheme(SkyTheme)}>SkyTheme</MenuItem>
            <MenuItem bg={"#212529"} onClick={()=> ChangeTheme(SpaceTheme)}>SpaceTheme</MenuItem>

          </MenuList>


        </Menu>
      </div>


    </div>
  )
}

export default Sidebar