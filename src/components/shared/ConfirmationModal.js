import React from "react";

import { Button, Modal, Text, useToast } from "native-base";

import { ErrorToast, SuccessToast } from "./ToastDialog";
import axiosInstance from "../../config/api";

const ConfirmationModal = ({ isOpen, setIsOpen, apiUrl, successMessage, color, onSuccess }) => {
  const toast = useToast();

  const onPressHandler = async () => {
    try {
      await axiosInstance.delete(apiUrl);
      setIsOpen(false);
      onSuccess();
      toast.show({
        render: () => {
          return <SuccessToast message={successMessage} />;
        },
      });
    } catch (error) {
      console.log(error);
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content h={200}>
        <Modal.CloseButton />
        <Modal.Header>Delete Project</Modal.Header>
        <Modal.Body>
          <Text>Are you sure to delete this project?</Text>
        </Modal.Body>

        <Modal.Footer>
          <Button.Group space={2}>
            <Button bgColor={color} onPress={onPressHandler}>
              Confirm
            </Button>

            <Button onPress={() => setIsOpen(false)}>Cancel</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmationModal;
