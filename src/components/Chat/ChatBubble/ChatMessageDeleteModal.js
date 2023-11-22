import { Button, Modal, Spinner, Text } from "native-base";
import React from "react";

const ChatMessageDeleteModal = ({
  id,
  deleteModalIsOpen,
  toggleDeleteModal,
  deleteMessage,
  myMessage,
  isLoadingForMe,
  setIsLoadingForMe,
  isLoadingForEveryone,
  setIsLoadingForEveryone,
  isLoading,
  setIsLoading,
  isDeleted,
}) => {
  return (
    <Modal size="xl" isOpen={deleteModalIsOpen} onClose={toggleDeleteModal}>
      <Modal.Content>
        <Modal.Header>Delete message?</Modal.Header>
        <Modal.Body gap={1} alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <Button variant="outline" onPress={toggleDeleteModal}>
            <Text fontSize={12} fontWeight={400} color="primary.600">
              Cancel
            </Text>
          </Button>

          <Button
            variant="outline"
            onPress={async () => {
              setIsLoadingForMe(true);
              await deleteMessage(id, "me", setIsLoadingForMe);
              toggleDeleteModal();
            }}
          >
            <Text fontSize={12} fontWeight={400} color="primary.600">
              {isLoadingForMe ? <Spinner color="primary.600" /> : "Delete for Me"}
            </Text>
          </Button>

          {myMessage && !isDeleted && (
            <Button
              variant="outline"
              onPress={async () => {
                setIsLoadingForEveryone(true);
                await deleteMessage(id, "everyone", setIsLoadingForEveryone);
                toggleDeleteModal();
              }}
            >
              <Text fontSize={12} fontWeight={400} color="primary.600">
                {isLoadingForEveryone ? <Spinner color="primary.600" /> : "Delete for Everyone"}
              </Text>
            </Button>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ChatMessageDeleteModal;
