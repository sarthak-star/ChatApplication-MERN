
import { Badge } from "@chakra-ui/layout";
import {AiFillCloseCircle } from "react-icons/ai";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <>
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      width={"fit-content"}
      gap={2}
      
      
      >
      {user.username}
      {admin === user._id && <span> (Admin)</span>}
      <AiFillCloseCircle />
    </Badge>
      </>
  );
};

export default UserBadgeItem;