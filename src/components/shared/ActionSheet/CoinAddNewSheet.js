import { useNavigation } from "@react-navigation/native";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useCheckAccess from "../../../hooks/useCheckAccess";
import { TextProps } from "../CustomStylings";

const CoinAddNewSheet = (props) => {
  const navigation = useNavigation();
  const createCustomerAccess = useCheckAccess("create", "Customer");
  const createSupplierAccess = useCheckAccess("create", "Suppliers");

  const items = [
    {
      title: `New Customer ${createCustomerAccess ? "" : "(No access)"}`,
      screen: createCustomerAccess ? "New Customer" : "Dashboard",
    },
    {
      title: `New Supplier ${createSupplierAccess ? "" : "(No access)"}`,
      screen: createSupplierAccess ? "New Supplier" : "Dashboard",
    },
  ];

  return (
    <>
      <ActionSheet ref={props.reference}>
        <View style={styles.container}>
          {items.map((item, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                borderColor="#E8E9EB"
                borderBottomWidth={1}
                style={{
                  ...styles.wrapper,
                  borderBottomWidth: 1,
                  borderColor: "#E8E9EB",
                }}
                onPress={() => {
                  navigation.navigate(item.screen);
                  props.reference.current?.hide();
                }}
              >
                <View style={styles.flex}>
                  <View style={styles.item}>
                    <MaterialCommunityIcons name="plus" size={20} color="#3F434A" />
                  </View>
                  <Text key={idx} style={[{ fontSize: 14 }, TextProps]}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ActionSheet>
    </>
  );
};

export default CoinAddNewSheet;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 21,
  },
  item: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
