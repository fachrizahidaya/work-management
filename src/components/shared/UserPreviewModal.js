import React from "react";

import { Avatar, Modal, Text, VStack } from "native-base";

const UserPreviewModal = ({ isOpen, onClose, name, image, email, stringToColor, userInitialGenerator }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Content>
        <Modal.Body bgColor="white">
          <VStack alignItems="center" space={2}>
            {image ? (
              <Avatar
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API}/image/${image}`,
                }}
                size="lg"
                bg="transparent"
              />
            ) : (
              <Avatar size="lg" bgColor={stringToColor(name)}>
                {name ? userInitialGenerator() : "KSS"}
              </Avatar>
            )}
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
