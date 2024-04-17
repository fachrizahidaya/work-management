import { useNavigation } from "@react-navigation/native";

import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";

const EmployeeSection = ({ employee }) => {
  const navigation = useNavigation();

  return (
    <>
      <Text style={{ fontWeight: "500", opacity: 0.5 }}>EMPLOYEES</Text>
      <ScrollView style={styles.wrapper}>
        {employee.map((item) => (
          <Pressable
            style={styles.item}
            key={item.id}
            onPress={() => navigation.navigate("Employee Profile", { employeeId: item?.id })}
          >
            <View style={styles.icon}>
              <MaterialCommunityIcons name="account-outline" size={20} color={"#8A9099"} />
            </View>
            <Text>{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
};

export default EmployeeSection;

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    gap: 10,
    maxHeight: 300,
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
    marginVertical: 3,
  },
});
