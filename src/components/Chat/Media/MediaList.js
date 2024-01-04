import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import MediaItem from "./MediaItem";

const MediaList = ({ media, docs }) => {
  return (
    <View style={styles.container}>
      <FlashList
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={200}
        data={media}
        numColumns={6}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 }}>
            <MediaItem key={index} image={item?.file_name} path={item?.file_path} />
          </View>
        )}
      />
      <FlashList
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        estimatedItemSize={200}
        data={docs}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 }}>
            <MediaItem key={index} image={item?.file_name} path={item?.file_path} type={item?.mime_type} />
          </View>
        )}
      />
    </View>
  );
};

export default MediaList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
  },
});
