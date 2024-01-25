import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TeamSection = ({ teams }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.wrapper}>
      <Text style={{ fontWeight: "500", opacity: 0.5 }}>TEAMS</Text>

      {teams.map((team) => (
        <Pressable
          style={styles.item}
          key={team.id}
          onPress={() => navigation.navigate("My Team", { passedTeam: team })}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons name="account-group" size={20} color={"#8A9099"} />
          </View>
          <Text>{team.name}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default TeamSection;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    gap: 10,
  },
  icon: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: "#E8E9EB",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#E9E9EB",
  },
});
