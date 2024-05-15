import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import GroupListItem from "./GroupListItem";

const GroupSection = ({
  groupChats,
  navigation,
  message,
  project,
  task,
  file_path,
  file_name,
  file_size,
  mime_type,
  forwardScreen,
}) => {
  return (
    <View style={{ marginTop: 10, flex: 1 }}>
      {forwardScreen ? null : (
        <View style={styles.header}>
          <Text style={{ fontWeight: "500", opacity: 0.5 }}>GROUP</Text>
        </View>
      )}

      <FlashList
        estimatedItemSize={200}
        data={groupChats}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: 10 }}>
            <GroupListItem
              key={index}
              name={item?.name}
              image={item?.image}
              user_id={null}
              room_id={item?.id}
              active_member={item?.active_member}
              userType={null}
              email={null}
              type="group"
              navigation={navigation}
              message={message}
              project={project}
              task={task}
              file_path={file_path}
              file_name={file_name}
              file_size={file_size}
              mime_type={mime_type}
            />
          </View>
        )}
      />
    </View>
  );
};

export default GroupSection;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
