import { Actionsheet } from "native-base";
import { StyleSheet, View, Text } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const EmployeeTeammates = ({ teammatesIsOpen, toggleTeammates, teammates }) => {
  return (
    <Actionsheet isOpen={teammatesIsOpen} onClose={toggleTeammates}>
      <Actionsheet.Content>
        <View style={{ width: "95%" }}>
          {teammates?.data.map((item, index) => {
            return (
              <Actionsheet.Item key={index} px={-1}>
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
              </Actionsheet.Item>
            );
          })}
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default EmployeeTeammates;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
