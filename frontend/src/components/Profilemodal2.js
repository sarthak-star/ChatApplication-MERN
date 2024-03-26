import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Center,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent color="#CED4DA" backgroundColor="#212529"  h="410px">
          <Center>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.username}
          </ModalHeader>
          </Center>
          <ModalCloseButton />
          
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            
            
          >
            <Center>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.username}
            />
            </Center>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              textAlign="center"
            >
              {user.email}
            </Text>
            
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="purple" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;