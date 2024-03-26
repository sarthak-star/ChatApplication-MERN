import React, { useEffect, useState } from 'react';
import "../styles/mychats.css";
import { Avatar, Box, Button, Center, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Input, Spinner, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { ChatState } from '../context/ChatProvider';
import axios from "axios";
import Chatloading from './Chatloading';
import Userlistitem from './Userlistitem';
import { MdGroupAdd } from "react-icons/md";
import { getSender, getSenderImage } from './chatlogic';
import GroupChatModal from './GroupChatModal';

const Mychats = ({ fetchagain }) => {
  const { user, chats, selectedChat, setSelectedChat, setChats } = ChatState();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [searchresult, setSearchresult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingchat, setLoadingchat] = useState();
  const [loggeduser, setLoggeduser] = useState();




  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlesearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",

      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchresult(data);

    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);

    }
  };

  const accessChat = async (userid) => {
    console.log(userid);
    try {
      setLoadingchat(true);
      const config = {
        headers: {

          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userid }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingchat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }

  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);


    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the Chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

    }

  }

  useEffect(() => {
    setLoggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);






  return (
    <div className='mychats' >

      <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"



      >
        <Center>


          <Button onClick={onOpen} colorScheme='purple' width={400} m={5} backgroundColor={'#343A40'} >
            <FaSearch />
            <Text d={{ base: "none", md: "flex" }} p={4}>
              Search User
            </Text>
          </Button>


        </Center>
        <Flex
          px={5}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          d="flex"
          w="100%"
          justify='space-between'

          alignItems="center"
          color={"#DEE2E6"}
        >
          <span id="mychatsheading">My Chats</span>
          <GroupChatModal>
            <Button
              d="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              colorScheme='purple'
              color={"#DEE2E6"}
            >
              <MdGroupAdd fontSize={23} />
            </Button>
          </GroupChatModal>
        </Flex>
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#212529"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"


        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  display={"flex"}
                  gap={5}

                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#805AD5" : "#343A40"}
                  color={"#DEE2E6"}
                  px={3}
                  py={3}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Avatar size="xs" cursor="pointer" name={!chat.isGroupChat
                    ? getSender(loggeduser, chat.users)
                    : chat.chatName} src={!chat.isGroupChat
                      ? getSenderImage(loggeduser, chat.users)
                      : chat.chatName} />

                  {!chat.isGroupChat
                    ? getSender(loggeduser, chat.users)
                    : chat.chatName}

                </Box>
              ))}
            </Stack>
          ) : (
            <Chatloading />
          )}


        </Box>

      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent backgroundColor={'#212529'}>
          <DrawerHeader color="#DEE2E6" >Search Users</DrawerHeader>
          <DrawerBody  >
            <Box display="flex" pb={2} >
              <Input
                color="#DEE2E6"
                placeholder="Search by name or email"
                mr={2}

                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant='flushed'
              />
              <Button color="#DEE2E6" colorScheme='purple' onClick={handlesearch} >Find</Button>
            </Box>
            {loading ? (
              <Chatloading />
            ) : (
              searchresult?.map((user) => (
                <Userlistitem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingchat && <Spinner color='white' ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>


      </Drawer>




    </div>
  )
}

export default Mychats