import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useGetSubMenu } from "../../../hooks/useGetSubMenu";
import { TextProps } from "../CustomStylings";

const CoinScreenSheet = (props) => {
  const navigation = useNavigation();
  const menuSelector = useSelector((state) => state.user_menu);
  const { mergedMenu } = useGetSubMenu(menuSelector.user_menu);
  const excludeSubscreen = [
    "Document Number",
    "Bank",
    "Terms Of Payment",
    "Tax",
    "Currency",
    "Courier",
    "FOB",
    "COA",
    "Units",
    "Item Categories",
    "Brands",
    "Items",
    "Warehouses",
    "Stock Adjustments",
    "Stock Opname Order",
    "Stock Opname",
    "Transfer Item",
    "Suppliers",
    "Customer Category",
    "Sales Person",
  ];
  const filteredMenu = mergedMenu.filter((item) => !excludeSubscreen.includes(item.name));

  return (
    <ActionSheet ref={props.reference}>
      <View
        style={{
          paddingBottom: 40,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            maxHeight: 500,
            // paddingBottom: 40
          }}
        >
          {/* {filteredMenu?.map((item, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  navigation.navigate(item.name);
                  props.reference.current?.hide();
                }}
                style={{
                  ...styles.wrapper,
                  borderBottomWidth: 1,
                  borderColor: "#E8E9EB",
                }}
              >
                <View style={styles.flex}>
                  <View style={styles.item}>
                    <MaterialCommunityIcons
                      size={20}
                      name={item.mobile_icon ? item.mobile_icon : item.icon}
                      color="#3F434A"
                    />
                  </View>
                  <Text style={[{ fontSize: 14 }, TextProps]}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            );
          })} */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Purchase");
              props.reference.current?.hide();
            }}
            style={{
              ...styles.wrapper,
              borderBottomWidth: 1,
              borderColor: "#E8E9EB",
            }}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name="cart-outline" color="#3F434A" />
              </View>
              <Text style={[{ fontSize: 14 }, TextProps]}>Purchase</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Sales");
              props.reference.current?.hide();
            }}
            style={{
              ...styles.wrapper,
              borderBottomWidth: 1,
              borderColor: "#E8E9EB",
            }}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name="currency-usd" color="#3F434A" />
              </View>
              <Text style={[{ fontSize: 14 }, TextProps]}>Sales</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("Delivery");
              props.reference.current?.hide();
            }}
            style={{
              ...styles.wrapper,
              borderBottomWidth: 1,
              borderColor: "#E8E9EB",
            }}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name="shopping-outline" color="#3F434A" />
              </View>
              <Text style={[{ fontSize: 14 }, TextProps]}>Delivery</Text>
            </View>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("Customer");
              props.reference.current?.hide();
            }}
            style={{
              ...styles.wrapper,
              borderBottomWidth: 1,
              borderColor: "#E8E9EB",
            }}
          >
            <View style={styles.flex}>
              <View style={styles.item}>
                <MaterialCommunityIcons size={20} name="account-outline" color="#3F434A" />
              </View>
              <Text style={[{ fontSize: 14 }, TextProps]}>Customer</Text>
            </View>
          </TouchableOpacity> */}
        </ScrollView>
      </View>
    </ActionSheet>
  );
};

export default CoinScreenSheet;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  flex: {
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
  text: {
    fontWeight: "800",
    color: "black",
  },
});
