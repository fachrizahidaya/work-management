import { Button, Image, Modal, Text, VStack } from "native-base";
import React from "react";

const ReturnConfirmationModal = ({ isOpen, toggle, onPress, description }) => {
  return (
    <Modal isOpen={isOpen} onClose={toggle} size="xl">
      <Modal.Content>
        <Modal.Body bgColor="white">
          <VStack alignItems="center">
            <Image
              source={require("../../assets/vectors/confirmation.jpg")}
              alt="confirmation"
              resizeMode="contain"
              h={150}
              w={150}
            />
            <Text textAlign="center">{description}</Text>
          </VStack>
        </Modal.Body>

        <Modal.Footer bgColor="white">
          <Button.Group space={2} width="full">
            <Button onPress={toggle} bgColor={"red.600"} flex={1}>
              Cancel
            </Button>

            <Button bgColor={"primary.600"} onPress={onPress} flex={1}>
              Confirm
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ReturnConfirmationModal;
