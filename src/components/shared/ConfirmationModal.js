import React from "react";

import { Button, Modal, Spinner, Text, useToast } from "native-base";

import { ErrorToast, SuccessToast } from "./ToastDialog";
import axiosInstance from "../../config/api";
import { useLoading } from "../../hooks/useLoading";

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
  const { isLoading: isDeleting, toggle: toggleIsDeleting } = useLoading(false);

  const onPressHandler = async () => {
    try {
      toggleIsDeleting();
      await axiosInstance.delete(apiUrl);
      toggle();
      toggleIsDeleting();
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
      toggleIsDeleting();
      toast.show({
        render: () => {
          return <ErrorToast message={error.response.data.message} />;
        },
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={!isDeleting && toggle}>
      <Modal.Content h={200}>
        <Modal.CloseButton />
        <Modal.Header>{header}</Modal.Header>
        <Modal.Body>
          <Text>{description}</Text>
        </Modal.Body>

        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              bgColor={isDeleting ? "coolGray.500" : color ? color : "red.600"}
              onPress={onPressHandler}
              startIcon={isDeleting && <Spinner size="sm" color="white" />}
            >
              Confirm
            </Button>

            <Button
              disabled={isDeleting}
              onPress={!isDeleting && toggle}
              bgColor={isDeleting ? "coolGray.500" : "primary.600"}
            >
              Cancel
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmationModal;
