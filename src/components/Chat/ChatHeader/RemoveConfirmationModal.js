import { Button, Image, Modal, Spinner, Text, VStack } from "native-base";

const RemoveConfirmationModal = ({ isOpen, toggle, onPress, description, isLoading }) => {
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
            <Text textAlign="center">{description}</Text>
          </VStack>
        </Modal.Body>

        <Modal.Footer bgColor="white">
          <Button.Group space={2} width="full">
            <Button onPress={!isLoading && toggle} variant="outline" flex={1}>
              Cancel
            </Button>
            <Button disabled={isLoading} bgColor={"red.600"} onPress={onPress} flex={1}>
              {isLoading ? <Spinner color="#FFFFFF" /> : "Confirm"}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default RemoveConfirmationModal;
