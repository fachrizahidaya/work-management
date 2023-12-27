import { StyleSheet, View, Text } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const EmployeeTeammates = ({ teammates, reference }) => {
  return (
    <ActionSheet ref={reference} onClose={() => reference.current?.hide()}>
      <View style={styles.wrapper}>
        <View style={{ width: "95%", gap: 10 }}>
          {teammates?.data.map((item, index) => {
            return (
              <View key={index} style={styles.content}>
                <AvatarPlaceholder
                  image={item?.image}
                  name={item?.name}
                  size="md"
                  borderRadius="full"
                  isThumb={false}
                />
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "500", color: "#3F434A" }}>
                    {item?.name.length > 30 ? item?.name.split(" ")[0] : item?.name}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "400", color: "#20A144" }}>{item?.position_name}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ActionSheet>
  );
};

export default EmployeeTeammates;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});
