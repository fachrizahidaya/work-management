import { FlashList } from "@shopify/flash-list";
import { Box, Flex, Input, Modal, Text } from "native-base";
import React, { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";

const ProjectAttachment = ({
  projectListIsOpen,
  toggleProjectList,
  bandAttachmentType,
  setBandAttachmentType,
  onSelectBandAttachment,
}) => {
  const {
    data: projectList,
    isFetching: projectListIsFetching,
    refetch: refetchProjectList,
  } = useFetch("/chat/project");

  return (
    <Modal isOpen={projectListIsOpen} onClose={toggleProjectList} size="xl">
      <Modal.Content>
        <Modal.Header>Choose Project</Modal.Header>
        <Modal.Body>
          <Input placeholder="test" />
          <Box flex={1} height={300} mt={4}>
            <FlashList
              data={projectList?.data}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => (
                <Flex>
                  <Flex>
                    <Text>{item?.title}</Text>
                    <Text>{item?.project_no}</Text>
                  </Flex>
                </Flex>
              )}
            />
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ProjectAttachment;
