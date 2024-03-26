import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Avatar, FormControl, IconButton, Input, Spinner, localStorageManager, useToast } from '@chakra-ui/react';
import { TiArrowBackOutline } from "react-icons/ti";
import "../styles/singlechat.css";
import { getFullSender, getSender, getSenderImage } from './chatlogic';
import { BsInfoCircle } from "react-icons/bs";
import Profilemodal2 from "./Profilemodal2";
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from "axios";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";



const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();


    const fetchMessages = async () => {

        if (!selectedChat) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }


    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post("/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);



            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });

            }
        }

    };

    const typingHandler = async (e) => {
        setNewMessage(e.target.value);
        


    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [user])

    

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    return (
        <div className='realchat' >
            {selectedChat ?
                (
                    <>
                        <div className="realchatheader">
                            <div className='innerheader' >
                                <IconButton
                                    display={{ base: "flex", md: "none" }}
                                    icon={<TiArrowBackOutline />}
                                    onClick={() => setSelectedChat("")}
                                />
                                {
                                    !selectedChat.isGroupChat ? (
                                        <>
                                            <Avatar cursor="pointer" src={getSenderImage(user, selectedChat.users)} />
                                            {getSender(user, selectedChat.users)}

                                        </>
                                    ) : (
                                        <>
                                            <Avatar bgColor={'purple.600'} cursor="pointer" name={selectedChat.chatName} src={selectedChat.chatName} />
                                            {selectedChat.chatName}
                                        </>
                                    )
                                }
                            </div>
                            <div >
                                {
                                    !selectedChat.isGroupChat ? (
                                        <Profilemodal2 bg={"#212529"} user={getFullSender(user, selectedChat.users)}>

                                            <BsInfoCircle cursor={"Pointer"} color='#DEE2E6' fontSize={25} />
                                        </Profilemodal2>
                                    ) : (
                                        <>
                                            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                                        </>
                                    )
                                }

                            </div>
                        </div>

                        {
                            loading ? (
                                <Spinner
                                    color='#DEE2E6'
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : (
                                <div className="realchatbody">

                                    <div className="messages">
                                        <ScrollableChat messages={messages} />
                                    </div>
                                    <div className="messagearea">
                                        <FormControl
                                            onKeyDown={sendMessage}
                                            id="first-name"
                                            isRequired
                                            mt={3}


                                        >
                                           
                                            <Input
                                                width={"97%"}
                                                color={"#DEE2E6"}

                                                variant="filled"
                                                bg="#343A40"
                                                placeholder="Enter a message.."
                                                value={newMessage}
                                                onChange={typingHandler}
                                            />
                                        </FormControl>
                                    </div>
                                </div>

                            )
                        }



                    </>
                )
                :
                (
                    <div style={{
                        color: "#DEE2E6",
                        fontSize: "20px"

                    }} >
                        <h1>Click on a Chat to start Chatting !</h1>
                    </div>
                )}



        </div>
    )
}

export default SingleChat