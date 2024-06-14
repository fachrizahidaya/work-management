import { Image, StyleSheet, Text, View } from "react-native";

import { card } from "../../../styles/Card";
import { TextProps } from "../../shared/CustomStylings";

const CourierItem = ({ name, prefix, image }) => {
  return (
    <View style={[card.card, styles.content]}>
      <Text style={[TextProps]}>
        {name} - {prefix}
      </Text>
      <Image
        style={styles.image}
        source={{
          uri: `${process.env.EXPO_PUBLIC_API}/image/${image}`,
        }}
        alt="Courier Image"
        resizeMethod="auto"
        fadeDuration={0}
      />
    </View>
  );
};

export default CourierItem;

const styles = StyleSheet.create({
  content: {
    marginVertical: 4,
    marginHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  image: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
});
