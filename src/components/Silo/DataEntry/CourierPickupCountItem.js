import { Image, StyleSheet, Text, View } from "react-native";
import { TextProps } from "../../shared/CustomStylings";

const CourierPickupCountItem = ({ image, count }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: `${process.env.EXPO_PUBLIC_API}/image/${image}`,
        }}
        alt="Courier Image"
        resizeMethod="auto"
        fadeDuration={0}
      />

      <Text style={[TextProps]}>{count}</Text>
    </View>
  );
};

export default CourierPickupCountItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 3,
    marginHorizontal: 2,
  },
  image: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
});
