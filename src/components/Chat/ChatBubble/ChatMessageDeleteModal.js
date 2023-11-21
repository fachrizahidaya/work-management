import { Button, Modal, Text } from "native-base";
import React from "react";

const ChatMessageDeleteModal = ({
  id,
  deleteModalIsOpen,
  toggleDeleteModal,
  deleteMessage,
  isLoading,
  setIsLoading,
  myMessage,
}) => {
  return (
    <Modal isOpen={deleteModalIsOpen} onClose={toggleDeleteModal}>
      <Modal.Content>
        <Modal.Header>Delete message?</Modal.Header>
        <Modal.Body gap={1} alignItems="center" display="flex" flexDirection="row" justifyContent="center">
          <Button onPress={toggleDeleteModal}>
            <Text fontSize={12} fontWeight={400} color="#FFFFFF">
              Cancel
            </Text>
          </Button>
          <Button
            onPress={async () => {
              await deleteMessage(id, "me", setIsLoading);
              !isLoading && toggleDeleteModal();
            }}
          >
            <Text fontSize={12} fontWeight={400} color="#FFFFFF">
              Delete for Me
            </Text>
          </Button>

          {myMessage && (
            <Button
              onPress={async () => {
                await deleteMessage(id, "everyone", setIsLoading);
                !isLoading && toggleDeleteModal();
              }}
            >
              <Text fontSize={12} fontWeight={400} color="#FFFFFF">
                Delete for Everyone
              </Text>
            </Button>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ChatMessageDeleteModal;
