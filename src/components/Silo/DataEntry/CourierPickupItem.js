import { Image, StyleSheet, Text, View } from "react-native";

import { card } from "../../../styles/Card";

const CourierPickupItem = ({ awb, courier, image }) => {
  return (
    <View style={[card.card, { marginVertical: 4, gap: 2 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          style={styles.image}
          source={{
            uri: `${process.env.EXPO_PUBLIC_API}/image/${image}`,
          }}
          alt="Courier Image"
          resizeMethod="auto"
          fadeDuration={0}
        />
        <Text>{courier}</Text>
      </View>
      <Text>{awb}</Text>
    </View>
  );
};

export default CourierPickupItem;

const styles = StyleSheet.create({
  image: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
});
