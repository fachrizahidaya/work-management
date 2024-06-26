import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import PersonalListItem from "./PersonalListItem";

const PersonalSection = ({
  personalChats,
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
          <Text style={{ fontWeight: "500", opacity: 0.5 }}>PERSONAL</Text>
        </View>
      )}

      <FlashList
        estimatedItemSize={200}
        data={personalChats}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0.1}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: 10 }}>
            <PersonalListItem
              key={index}
              name={item?.user?.name}
              image={item?.user?.image}
              user_id={item?.user?.id}
              room_id={item?.id}
              active_member={0}
              userType={item?.user?.user_type}
              email={item?.user?.email}
              type="personal"
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

export default PersonalSection;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
