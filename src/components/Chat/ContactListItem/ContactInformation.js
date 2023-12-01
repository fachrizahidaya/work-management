import { Button, Image, Modal, Text, VStack } from "native-base";
import React from "react";

const ContactInformation = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} onClose={toggle} size="xl">
      <Modal.Content>
        <Modal.Body bgColor="white">
          <VStack alignItems="center">
            <Image
              source={require("../../../assets/vectors/confirmation.jpg")}
              alt="confirmation"
              resizeMode="contain"
              h={150}
              w={150}
            />
          </VStack>
        </Modal.Body>

        <Modal.Footer bgColor="white">
          <Text>tes</Text>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ContactInformation;
