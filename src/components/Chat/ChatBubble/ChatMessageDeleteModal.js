import { Button, Modal, Spinner, Text } from "native-base";

const ChatMessageDeleteModal = ({
  id,
  deleteModalChatIsOpen,
  toggleDeleteModalChat,
  deleteMessage,
  myMessage,
  isLoading,
  isDeleted,
}) => {
  return (
    <Modal size="xl" isOpen={deleteModalChatIsOpen} onClose={toggleDeleteModalChat}>
      <Modal.Content>
        <Modal.Header>Delete message?</Modal.Header>
        <Modal.Body gap={1} alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
          <Button variant="outline" onPress={toggleDeleteModalChat}>
            <Text fontSize={12} fontWeight={400} color="primary.600">
              Cancel
            </Text>
          </Button>

          <Button
            variant="outline"
            onPress={async () => {
              await deleteMessage(id, "me");
            }}
          >
            <Text fontSize={12} fontWeight={400} color="primary.600">
              {isLoading ? <Spinner color="primary.600" /> : "Delete for Me"}
            </Text>
          </Button>

          {myMessage && !isDeleted && (
            <Button
              variant="outline"
              onPress={async () => {
                await deleteMessage(id, "everyone");
              }}
            >
              <Text fontSize={12} fontWeight={400} color="primary.600">
                {isLoading ? <Spinner color="primary.600" /> : "Delete for Everyone"}
              </Text>
            </Button>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ChatMessageDeleteModal;