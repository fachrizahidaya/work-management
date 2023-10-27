import React from "react";

import { Modal, Text, VStack } from "native-base";

import AvatarPlaceholder from "./AvatarPlaceholder";

const UserPreviewModal = ({ isOpen, onClose, name, image, email }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Content>
        <Modal.Body bgColor="white">
          <VStack alignItems="center" space={2}>
            <AvatarPlaceholder name={name} image={image} isThumb={false} size="lg" />
            <VStack alignItems="center">
              <Text textAlign="center" fontSize={20}>
                {name || "Something went wrong"}
              </Text>
              <Text fontWeight={400}>{email || "Something went wrong"}</Text>
            </VStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default UserPreviewModal;
