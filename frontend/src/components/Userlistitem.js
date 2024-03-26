import { Avatar } from "@chakra-ui/avatar";
import { Box} from "@chakra-ui/layout";

const UserListItem = ({user, handleFunction }) => {
  
  return (
    <Box
      
      onClick={handleFunction}
      cursor="pointer"
      bg="#343A40"
      _hover={{
        background: "#6B46C1",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color={"#CED4DA"}
      fontWeight={600}
      fontSize={18}
      p={3}
      mb={2}
      mt={3}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.username}
        src={user.pic}
      />{
        user.username.charAt(0).toUpperCase() + user.username.slice(1)
        
      }


     
    </Box>
  );
};

export default UserListItem;