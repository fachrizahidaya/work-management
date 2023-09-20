import React from "react";

import { Button, Modal, Text, useToast } from "native-base";

import { ErrorToast, SuccessToast } from "./ToastDialog";
import axiosInstance from "../../config/api";

const ConfirmationModal = ({
  isOpen,
  toggle,
  apiUrl,
  successMessage,
  color,
  hasSuccessFunc = false,
  onSuccess,
  header,
  description,
}) => {
  const toast = useToast();

  const onPressHandler = async () => {
    try {
      await axiosInstance.delete(apiUrl);
      toggle();
      toast.show({
        render: () => {
          return <SuccessToast message={successMessage} />;
        },
      });

      // If hasSuccessFunc passed then run the available onSuccess function
      if (hasSuccessFunc) {
        onSuccess();
      }
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
    <Modal isOpen={isOpen} onClose={toggle}>
      <Modal.Content h={200}>
        <Modal.CloseButton />
        <Modal.Header>{header}</Modal.Header>
        <Modal.Body>
          <Text>{description}</Text>
        </Modal.Body>

        <Modal.Footer>
          <Button.Group space={2}>
            <Button bgColor={color || "red.600"} onPress={onPressHandler}>
              Confirm
            </Button>

            <Button onPress={toggle}>Cancel</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmationModal;
