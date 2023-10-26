import React, { memo } from "react";

import { Button, Image, Modal, Spinner, Text, VStack, useToast } from "native-base";

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
  body = {},
  isDelete = true,
  isPatch = false,
  placement,
}) => {
  const toast = useToast();
  const { isLoading: isDeleting, toggle: toggleIsDeleting } = useLoading(false);

  const onPressHandler = async () => {
    try {
      toggleIsDeleting();
      if (isDelete) {
        await axiosInstance.delete(apiUrl);
      } else if (isPatch) {
        await axiosInstance.patch(apiUrl);
      } else {
        await axiosInstance.post(apiUrl, body);
      }
      toggle();
      toggleIsDeleting();
      toast.show({
        render: ({ id }) => {
          return <SuccessToast message={successMessage} close={() => toast.close(id)} />;
        },
        placement: placement ? placement : "bottom",
      });

      // If hasSuccessFunc passed then run the available onSuccess function
      if (hasSuccessFunc) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      toggleIsDeleting();
      toast.show({
        render: ({ id }) => {
          return <ErrorToast message={error.response.data.message} close={() => toast.close(id)} />;
        },
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={!isDeleting && toggle} size="xl">
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
            <Button
              bgColor={isDeleting ? "coolGray.500" : color ? color : "red.600"}
              onPress={onPressHandler}
              startIcon={isDeleting && <Spinner size="sm" color="white" />}
              flex={1}
            >
              Confirm
            </Button>

            <Button
              disabled={isDeleting}
              onPress={!isDeleting && toggle}
              bgColor={isDeleting ? "coolGray.500" : "primary.600"}
              flex={1}
            >
              Cancel
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default memo(ConfirmationModal);
