import { StyleSheet, Text, View } from "react-native";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const CustomerListItem = ({ name, phone, address, email }) => {
  const dataArr = [
    { title: "Phone", value: phone },
    { title: "Email", value: email },
    { title: "Address", value: address },
  ];

  return (
    <View
      style={{
        ...card.card,
        ...styles.content,
      }}
    >
      <View style={{ gap: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <AvatarPlaceholder name={name} isThumb={false} size="lg" />
          <Text style={[TextProps]}>{name}</Text>
        </View>
        <View style={{ gap: 5 }}>
          {dataArr.map((item, index) => {
            return (
              <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", gap: 5 }}>
                <Text style={[TextProps]}>{item.title} </Text>
                <Text style={[TextProps, { opacity: 0.5, textAlign: "right", width: "60%" }]}>{item.value}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default CustomerListItem;

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
  },
});
