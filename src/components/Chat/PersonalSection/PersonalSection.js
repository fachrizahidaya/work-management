import { StyleSheet, TouchableOpacity, View, Text, Pressable } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import ContactListItem from "../ContactListItem/ContactListItem";

const PersonalSection = ({
  personalChats,
  searchKeyword,
  searchResult,
  clickMoreHandler,
  onPinControl,
  navigation,
  userSelector,
}) => {
  const menuOptions = [
    {
      id: 1,
      name: "New Chat",
      onPress: () => {
        navigation.navigate("New Chat");
        SheetManager.hide("form-sheet");
      },
    },
  ];

  return !searchKeyword ? (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "500", opacity: 0.5 }}>PEOPLE</Text>

        <Pressable
          style={{ ...styles.addButton, marginRight: 1 }}
          onPress={() =>
            SheetManager.show("form-sheet", {
              payload: {
                children: (
                  <View
                    style={{
                      display: "flex",
                      gap: 21,
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      paddingBottom: -20,
                    }}
                  >
                    <View
                      style={{
                        gap: 1,
                        backgroundColor: "#F5F5F5",
                        borderRadius: 10,
                      }}
                    >
                      {menuOptions.map((option, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={option.onPress}
                            style={{
                              ...styles.container,
                              justifyContent: "space-between",
                              borderBottomWidth: 1,
                              borderBottomColor: "#FFFFFF",
                            }}
                          >
                            <Text style={{ fontSize: 16, fontWeight: "400" }}>{option.name}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <TouchableOpacity
                      style={{ justifyContent: "center", ...styles.container }}
                      onPress={() => SheetManager.hide("form-sheet")}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "400",
                          color: "#176688",
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                ),
              },
            })
          }
        >
          <MaterialIcons name="add" size={15} color="#3F434A" />
        </Pressable>
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
              latest={personal.latest_message}
              fileName={personal.latest_message?.file_name}
              project={personal.latest_message?.project_id}
              task={personal.latest_message?.task_id}
              isDeleted={personal.latest_message?.delete_for_everyone}
              time={personal.latest_message?.created_time}
              timestamp={personal.latest_message?.created_at}
              isRead={personal.unread}
              isPinned={personal?.pin_personal}
              active_member={0}
              onClickMore={clickMoreHandler}
              onPin={onPinControl}
              navigation={navigation}
              userSelector={userSelector}
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

          {searchResult.map((personal) => {
            return (
              <ContactListItem
                chat={personal}
                type="personal"
                key={personal.id}
                id={personal.id}
                userId={personal.user?.id}
                name={personal.user?.name}
                image={personal.user?.image}
                position={personal.user?.user_type}
                email={personal.user?.email}
                message={personal.latest_message?.message}
                latest={personal.latest_message}
                fileName={personal.latest_message?.file_name}
                project={personal.latest_message?.project_id}
                task={personal.latest_message?.task_id}
                isDeleted={personal.latest_message?.delete_for_everyone}
                time={personal.latest_message?.created_time}
                isRead={personal.unread}
                timestamp={personal.latest_message?.created_at}
                isPinned={personal?.pin_personal}
                active_member={0}
                onClickMore={clickMoreHandler}
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

export default PersonalSection;

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
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
