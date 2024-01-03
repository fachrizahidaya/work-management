import { useNavigation } from "@react-navigation/native";

import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import ContactListItem from "../ContactListItem/ContactListItem";

const PersonalSection = ({
  personalChats,
  searchKeyword,
  searchResult,
  onSwipeControl,
  onPinControl,

  reference,
}) => {
  const navigation = useNavigation();

  return !searchKeyword ? (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "500", opacity: 0.5 }}>PEOPLE</Text>

        <TouchableOpacity style={styles.addButton} onPress={() => reference.current?.show()}>
          <MaterialIcons name="add" color="black" size={15} />
        </TouchableOpacity>
      </View>

      {personalChats.length > 0 &&
        personalChats.map((personal) => {
          return (
            <ContactListItem
              chat={personal}
              type="personal"
              key={personal.id}
              id={personal.id}
              userId={personal?.user?.id}
              name={personal.user?.name}
              image={personal.user?.image}
              position={personal.user?.user_type}
              email={personal.user?.email}
              message={personal.latest_message?.message}
              fileName={personal.latest_message?.file_name}
              project={personal.latest_message?.project_id}
              task={personal.latest_message?.task_id}
              isDeleted={personal.latest_message?.delete_for_everyone}
              time={personal.latest_message?.created_time}
              timestamp={personal.latest_message?.created_at}
              isRead={personal.unread}
              isPinned={personal?.pin_personal}
              active_member={0}
              onSwipe={onSwipeControl}
              onPin={onPinControl}
            />
          );
        })}
    </>
  ) : (
    <>
      {searchResult?.length > 0 && (
        <>
          <View style={styles.header}>
            <Text style={{ fontWeight: "500", opacity: 0.5 }}>PEOPLE</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("New Chat")}>
              <MaterialIcons name="add" color="black" size={15} />
            </TouchableOpacity>
          </View>

          {searchResult.map((personal) => (
            <ContactListItem
              type="personal"
              key={personal.id}
              id={personal.id}
              userId={personal.user?.id}
              name={personal.user?.name}
              image={personal.user?.image}
              message={personal.latest_message?.message}
              fileName={personal.latest_message?.file_name}
              project={personal.latest_message?.project_id}
              task={personal.latest_message?.task_id}
              isDeleted={personal.latest_message?.delete_for_everyone}
              time={personal.latest_message?.created_time}
              isRead={personal.unread}
              timestamp={personal.latest_message?.created_at}
              searchKeyword={searchKeyword}
            />
          ))}
        </>
      )}
    </>
  );
};

export default PersonalSection;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  addButton: {
    backgroundColor: "#f1f2f3",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 8,
  },
});
