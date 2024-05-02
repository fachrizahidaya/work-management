import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { TextProps } from "../../shared/CustomStylings";

const DetailList = ({ data, isLoading }) => {
  return (
    <ScrollView>
      {!isLoading ? (
        data.map((item, index) => {
          return (
            <View key={index} style={{ marginVertical: 5, gap: 5 }}>
              <Text style={[TextProps]}>{item.name}</Text>
              <View style={styles.wrapper}>
                <Text style={[TextProps, { opacity: 0.5 }]}>{item.data ? item.data : "No Data"}</Text>
              </View>
            </View>
          );
        })
      ) : (
        <ActivityIndicator />
      )}
    </ScrollView>
  );
};

export default DetailList;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: "#E8E9EB",
    borderRadius: 10,
    padding: 10,
  },
});
