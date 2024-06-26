import { memo } from "react";

import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import ContactListItem from "../ContactListItem/ContactListItem";

const GroupSection = ({
  groupChats,
  searchKeyword,
  searchResult,
  handleClickMore,
  onPinControl,
  navigation,
  userSelector,
}) => {
  return !searchKeyword ? (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "500", opacity: 0.5 }}>TEAMS</Text>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Group Participant")}>
          <MaterialIcons name="add" color="#3F434A" size={15} />
        </TouchableOpacity>
      </View>

      {groupChats.length > 0 &&
        groupChats.map((group) => (
          <ContactListItem
            chat={group}
            key={group.id}
            id={group.id}
            name={group.name}
            image={group.image}
            position={null}
            email={null}
            latest={group.latest_message}
            message={group.latest_message?.message}
            fileName={group.latest_message?.file_name}
            project={group.latest_message?.project_id}
            task={group.latest_message?.task_id}
            isDeleted={group.latest_message?.delete_for_everyone}
            time={group.latest_message?.created_time}
            timestamp={group.latest_message?.created_at}
            isRead={group.unread}
            isPinned={group?.pin_group}
            type="group"
            active_member={group?.active_member}
            onClickMore={handleClickMore}
            onPin={onPinControl}
            navigation={navigation}
            userSelector={userSelector}
          />
        ))}
    </>
  ) : (
    <>
      {searchResult?.length > 0 && (
        <>
          <View style={styles.header}>
            <Text style={{ fontWeight: "500", opacity: 0.5 }}>TEAMS</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Group Participant")}>
              <MaterialIcons name="add" color="black" size={15} />
            </TouchableOpacity>
          </View>

          {searchResult.map((group) => {
            return (
              <ContactListItem
                chat={group}
                key={group.id}
                id={group.id}
                name={group.name}
                image={group.image}
                position={null}
                email={null}
                message={group.latest_message?.message}
                fileName={group.latest_message?.file_name}
                project={group.latest_message?.project_id}
                task={group.latest_message?.task_id}
                isDeleted={group.latest_message?.delete_for_everyone}
                time={group.latest_message?.created_time}
                timestamp={group.latest_message?.created_at}
                isRead={group.unread}
                isPinned={group?.pin_group}
                type="group"
                active_member={group?.active_member}
                onClickMore={handleClickMore}
                onPin={onPinControl}
                searchKeyword={searchKeyword}
                navigation={navigation}
                userSelector={userSelector}
              />
            );
          })}
        </>
      )}
    </>
  );
};

export default memo(GroupSection);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: "#f1f2f3",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 8,
  },
});
