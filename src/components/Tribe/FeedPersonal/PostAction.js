import { Actionsheet } from "native-base";
import React from "react";

const PostAction = ({ actionIsOpen, toggleAction, toggleDeleteModal }) => {
  return (
    <Actionsheet isOpen={actionIsOpen} onClose={toggleAction}>
      <Actionsheet.Content>
        <Actionsheet.Item onPress={toggleDeleteModal}>Delete Post</Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default PostAction;
