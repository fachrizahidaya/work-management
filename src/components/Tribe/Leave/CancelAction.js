import { Actionsheet } from "native-base";
import React from "react";

const CancelAction = ({ actionIsOpen, onDeselect, toggleCancelModal }) => {
  return (
    <Actionsheet isOpen={actionIsOpen} onClose={onDeselect}>
      <Actionsheet.Content>
        <Actionsheet.Item onPress={toggleCancelModal}>Cancel Request</Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default CancelAction;
