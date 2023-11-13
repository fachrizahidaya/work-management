import { useNavigation } from "@react-navigation/native";
import { Flex, Icon, Image, Pressable, Text } from "native-base";
import { Linking } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BandAttachmentBubble = ({ id, type, number_id, title }) => {
  const navigation = useNavigation();

  const generateUrl = (id, type) => {
    if (type === "Project") {
      return navigation.navigate(`${process.env.EXPO_PUBLIC_API}/band/project/${id}/project-tasks`, "_blank");
    } else {
      return navigation.navigate(`${process.env.EXPO_PUBLIC_API}/band/task-list?taskId=${id}`, "_blank");
    }
  };

  return (
    <Pressable
      gap={1}
      px={1}
      py={2}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-evenly"
      borderRadius={10}
      backgroundColor="#1b536b"
    >
      {type === "Project" && <Icon as={<MaterialCommunityIcons name="lightning-bolt" />} size={5} color="#FFFFFF" />}
      {type === "Task" && <Icon as={<MaterialCommunityIcons name="check-underline" />} size={5} color="#FFFFFF" />}

      {/* <Image
        source={
          getFileExt() === "doc"
            ? require(doc)
            : getFileExt() === "pdf"
            ? require(pdf)
            : getFileExt() === "xls" || getFileExt() === "xlsx"
            ? require(xls)
            : getFileExt() === "ppt" || getFileExt() === "pptxs"
            ? require(ppt)
            : null
        }
        alignSelf="center"
        h={10}
        w={10}
        resizeMode="cover"
        alt={`${file_type} format`}
      /> */}

      <Flex>
        <Text fontSize={12} fontWeight={400} color="#FFFFFF">
          {title}
        </Text>
        <Text fontSize={10} fontWeight={400} color="#FFFFFF">
          #{number_id}
        </Text>
      </Flex>
    </Pressable>
  );
};

export default BandAttachmentBubble;
