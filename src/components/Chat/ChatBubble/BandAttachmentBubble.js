import { useNavigation } from "@react-navigation/native";

import { Flex, Icon, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BandAttachmentBubble = ({ id, type, number_id, title, myMessage }) => {
  const navigation = useNavigation();

  const generateUrl = (id, type) => {
    if (type === "Project") {
      return navigation.navigate("Project Detail", { projectId: id });
    } else {
      return navigation.navigate("Task Detail", { taskId: id });
    }
  };

  return (
    <Pressable
      onPress={() => generateUrl(id, type)}
      gap={1}
      px={2}
      py={2}
      width={260}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      borderRadius={5}
      backgroundColor={!myMessage ? "#f1f1f1" : "#1b536b"}
    >
      {type === "Project" && (
        <Icon
          as={<MaterialCommunityIcons name="lightning-bolt" />}
          size={5}
          color={!myMessage ? "#000000" : "#FFFFFF"}
        />
      )}
      {type === "Task" && (
        <Icon
          as={<MaterialCommunityIcons name="checkbox-marked-circle-outline" />}
          size={5}
          color={!myMessage ? "#000000" : "#FFFFFF"}
        />
      )}

      <Flex>
        <Text fontSize={12} fontWeight={400} color={!myMessage ? "#000000" : "#FFFFFF"}>
          {title}
        </Text>
        <Text fontSize={10} fontWeight={400} color={!myMessage ? "#000000" : "#FFFFFF"}>
          #{number_id}
        </Text>
      </Flex>
    </Pressable>
  );
};

export default BandAttachmentBubble;
