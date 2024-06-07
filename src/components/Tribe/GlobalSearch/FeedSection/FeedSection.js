import { StyleSheet, Text, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import FeedItem from "./FeedItem";

const FeedSection = ({ feed, employeeUsername, navigation }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={{ fontWeight: "500", opacity: 0.5 }}>POSTS</Text>

      <View style={{ borderRadius: 10, paddingBottom: 14 }}>
        <FlashList
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          data={feed}
          onEndReachedThreshold={0.1}
          keyExtractor={(item, index) => index}
          estimatedItemSize={150}
          renderItem={({ item, index }) => (
            <FeedItem
              key={index}
              id={item?.id}
              employee_image={item?.employee_image}
              employee_name={item?.employee_name}
              created_at={item?.created_at}
              content={item?.content}
              employeeUsername={employeeUsername}
              navigation={navigation}
              file_path={item?.file_path}
              total_comment={item?.total_comment}
              total_like={item?.total_like}
              type={item?.type}
            />
          )}
        />
      </View>
    </View>
  );
};

export default FeedSection;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
    gap: 10,
  },
});
