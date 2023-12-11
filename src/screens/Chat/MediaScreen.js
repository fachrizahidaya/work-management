import { useNavigation, useRoute } from "@react-navigation/core";
import { Flex, Icon, Pressable, Text } from "native-base";
import { SafeAreaView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MediaList from "../../components/Chat/Media/MediaList";

const MediaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { media, docs } = route.params;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <Flex direction="row" justifyContent="space-between" bg="white" p={4}>
        <Flex direction="row" alignItems="center" gap={4}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
          </Pressable>
        </Flex>
      </Flex>
      <MediaList media={media} docs={docs} />
    </SafeAreaView>
  );
};

export default MediaScreen;
