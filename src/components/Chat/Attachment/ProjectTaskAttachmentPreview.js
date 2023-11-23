import { Flex, Icon, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ProjectTaskAttachmentPreview = ({ bandAttachment, setBandAttachment, bandAttachmentType }) => {
  return (
    <Flex px={5} py={5} bgColor="white" position="absolute" top="80px" bottom="60px" left={0} right={0}>
      <Flex flexDir="row" alignItems="center" justifyContent="space-between">
        <Text>{bandAttachment?.title}</Text>
        <Pressable onPress={() => setBandAttachment(null)}>
          <Icon as={<MaterialCommunityIcons name="close" />} size={5} />
        </Pressable>
      </Flex>
      <Flex mt={200} justifyContent="center" alignItems="center">
        {bandAttachmentType === "project" ? (
          <>
            <Icon as={<MaterialCommunityIcons name="lightning-bolt" />} size={100} />
            <Text>{bandAttachment?.title}</Text>
            <Text>#{bandAttachment?.project_no}</Text>
          </>
        ) : (
          <>
            <Icon as={<MaterialCommunityIcons name="checkbox-marked-circle-outline" />} size={100} />
            <Text>{bandAttachment?.title}</Text>
            <Text>#{bandAttachment?.task_no}</Text>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default ProjectTaskAttachmentPreview;
