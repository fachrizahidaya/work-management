import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import MediaItem from "./MediaItem";
import DocItem from "./DocItem";
import EmptyPlaceholder from "../../shared/EmptyPlaceholder";

const MediaList = ({ media, docs, tabValue, toggleFullScreen }) => {
  const { width } = Dimensions.get("window");
  const height = (width * 100) / 63;

  return (
    <View style={styles.container}>
      {tabValue === "photos" ? (
        media.length > 0 ? (
          <>
            <FlashList
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              estimatedItemSize={200}
              data={media}
              numColumns={5}
              renderItem={({ item, index }) => (
                <MediaItem key={index} path={item?.file_path} toggleFullScreen={toggleFullScreen} />
              )}
            />
          </>
        ) : (
          <ScrollView>
            <EmptyPlaceholder height={250} width={250} text="No Data" />
          </ScrollView>
        )
      ) : docs.length > 0 ? (
        <FlashList
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0.1}
          estimatedItemSize={200}
          data={docs}
          renderItem={({ item, index }) => (
            <View style={{ gap: 10 }}>
              <DocItem
                key={index}
                image={item?.file_name}
                path={item?.file_path}
                type={item?.mime_type}
                size={item?.file_size}
              />
            </View>
          )}
        />
      ) : (
        <ScrollView>
          <EmptyPlaceholder height={250} width={250} text="No Data" />
        </ScrollView>
      )}
    </View>
  );
};

export default MediaList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
  },
});
