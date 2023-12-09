import { FlashList } from "@shopify/flash-list";
import { Box, Flex, Pressable, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import MediaItem from "./MediaItem";

const MediaList = ({ media, docs }) => {
  return (
    <Flex flex={1} mt={5} px={2} py={3} bg="#FFFFFF">
      <FlashList
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={200}
        data={media}
        numColumns={6}
        renderItem={({ item, index }) => (
          <Box flex={1}>
            <MediaItem key={index} image={item?.file_name} path={item?.file_path} />
          </Box>
        )}
      />
      <FlashList
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={200}
        data={docs}
        renderItem={({ item, index }) => (
          <Box flex={1}>
            <MediaItem key={index} image={item?.file_name} path={item?.file_path} type={item?.mime_type} />
          </Box>
        )}
      />
    </Flex>
  );
};

export default MediaList;
