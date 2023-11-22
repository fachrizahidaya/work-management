import { FlashList } from "@shopify/flash-list";
import { Box, Flex, Icon, Input, Modal, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import { TouchableOpacity } from "react-native";

const ProjectAttachment = ({
  projectListIsOpen,
  toggleProjectList,
  bandAttachmentType,
  setBandAttachmentType,
  onSelectBandAttachment,
  bandAttachment,
  setBandAttachment,
}) => {
  const {
    data: projectList,
    isFetching: projectListIsFetching,
    refetch: refetchProjectList,
  } = useFetch("/chat/project");

  const selectProjectHandler = (project) => {
    setBandAttachment(project);
    toggleProjectList();
  };

  return (
    <Modal isOpen={projectListIsOpen} onClose={toggleProjectList} size="xl">
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Choose Project</Modal.Header>
        <Modal.Body>
          <Input placeholder="Search here..." />
          <Box flex={1} height={300} mt={4}>
            <FlashList
              data={projectList?.data}
              estimatedItemSize={100}
              keyExtractor={(item, index) => index}
              onScrollBeginDrag={() => setHasBeenScrolled(!hasBeenScrolled)}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => (
                <Flex my={1} gap={2} flexDirection="row">
                  <Flex
                    rounded="full"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="#f1f1f1"
                    padding={1}
                  >
                    <Icon as={<MaterialCommunityIcons name="lightning-bolt" />} size={5} />
                  </Flex>
                  <TouchableOpacity onPress={() => selectProjectHandler(item)}>
                    <Text fontSize={14} fontWeight={400} color="#000000">
                      {item?.title}
                    </Text>
                    <Text fontSize={12} fontWeight={400} color="#b2b2b2">
                      #{item?.project_no}
                    </Text>
                  </TouchableOpacity>
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
