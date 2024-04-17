import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useCheckAccess from "../../../hooks/useCheckAccess";
import { TextProps } from "../CustomStylings";
import { useDisclosure } from "../../../hooks/useDisclosure";
import SuccessModal from "../Modal/SuccessModal";

const CoinAddNewSheet = (props) => {
  const [requestType, setRequestType] = useState("");

  const navigation = useNavigation();

  const createCustomerAccess = useCheckAccess("create", "Customer");
  const createSupplierAccess = useCheckAccess("create", "Suppliers");

  const { isOpen: newCustomerModalIsOpen, toggle: toggleNewCustomerModal } = useDisclosure(false);
  const { isOpen: newSupplierModalIsOpen, toggle: toggleNewSupplierModal } = useDisclosure(false);

  const items = [
    {
      title: `New Customer ${createCustomerAccess ? "" : "(No access)"}`,
      screen: () => {
        createCustomerAccess
          ? navigation.navigate("New Customer", {
              setRequestType: setRequestType,
              toggleSuccessModal: toggleNewCustomerModal,
            })
          : navigation.navigate("Dashboard");
        props.reference.current?.hide();
      },
    },
    // {
    //   title: `New Supplier ${createSupplierAccess ? "" : "(No access)"}`,
    //   screen: () => {
    //     createSupplierAccess
    //       ? navigation.navigate("New Supplier", {
    //           setRequestType: setRequestType,
    //           toggleSuccessModal: toggleNewSupplierModal,
    //         })
    //       : navigation.navigate("Dashboard");
    //     props.reference.current?.hide();
    //   },
    // },
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
                onPress={item.screen}
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
      <SuccessModal
        isOpen={newCustomerModalIsOpen}
        toggle={toggleNewCustomerModal}
        type={requestType}
        title="Customer added!"
        description="Data has successfully added"
      />
      <SuccessModal
        isOpen={newSupplierModalIsOpen}
        toggle={toggleNewSupplierModal}
        type={requestType}
        title="Supplier added!"
        description="Data has successfully added"
      />
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
