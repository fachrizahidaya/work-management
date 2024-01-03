import React from "react";

import { SheetManager } from "react-native-actions-sheet";

import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MemberListItem = ({
  member,
  name,
  image,
  email,
  totalProjects,
  totalTasks,
  master,
  loggedInUser,
  openRemoveMemberModal,
}) => {
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  const userInitialGenerator = () => {
    const nameArray = name?.split(" ");
    let alias = "";

    if (nameArray?.length >= 2) {
      alias = nameArray[0][0] + nameArray[1][0];
    } else {
      alias = nameArray[0][0];
    }

    return alias;
  };

  return (
    <View style={styles.card}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          position: "relative",
        }}
      >
        {image ? (
          <Image
            style={{ height: 63, width: 63, resizeMode: "contain", borderRadius: 10 }}
            source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${image}` }}
            alt={`${name} avatar`}
          />
        ) : (
          <View
            style={{
              height: 63,
              width: 63,
              backgroundColor: stringToColor(name),
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: 500, fontSize: 20, color: "white" }}>{userInitialGenerator()}</Text>
          </View>
        )}

        <View style={{ display: "flex" }}>
          <Text style={{ width: 125, fontWeight: 500 }} numberOfLines={2}>
            {name}
          </Text>

          {master === name && <MaterialCommunityIcons name="shield-account-variant" size={20} color="#FFD240" />}
        </View>

        <View style={{ position: "absolute", bottom: 0, right: 0, display: "flex", flexDirection: "row", gap: 10 }}>
          <View style={{ display: "flex", alignItems: "center" }}>
            <Text style={{ fontWeight: 500, opacity: 0.5 }}>Task</Text>
            <Text style={{ fontWeight: 500 }}>{totalTasks}</Text>
          </View>

          <View style={{ borderWidth: 1, borderColor: "#E8E9EB" }} />

          <View style={{ display: "flex", alignItems: "center" }}>
            <Text style={{ fontWeight: 500, opacity: 0.5 }}>Project</Text>
            <Text style={{ fontWeight: 500 }}>{totalProjects}</Text>
          </View>
        </View>

        {loggedInUser === master && (
          <>
            {name !== master && (
              <Pressable
                style={{ position: "absolute", top: -15, right: -5, borderRadius: 50 }}
                onPress={() =>
                  SheetManager.show("form-sheet", {
                    payload: {
                      children: (
                        <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                          <TouchableOpacity
                            onPress={async () => {
                              await SheetManager.hide("form-sheet");
                              openRemoveMemberModal(member);
                            }}
                          >
                            <Text style={{ fontWeight: 500, color: "red" }}>Remove Member</Text>
                          </TouchableOpacity>
                        </View>
                      ),
                    },
                  })
                }
              >
                <MaterialCommunityIcons name="dots-vertical" size={20} />
              </Pressable>
            )}
          </>
        )}
      </View>

      <View style={{ borderWidth: 1, borderColor: "#E8E9EB" }} />

      <View style={{ display: "flex", gap: 10 }}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: 500 }}>Email:</Text>
          <Text style={{ fontWeight: 500 }}>{email}</Text>
        </View>
      </View>
    </View>
  );
};

export default MemberListItem;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    gap: 23,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
});
