import { useMemo, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useFetch } from "../../../hooks/useFetch";
import Tabs from "../../../components/shared/Tabs";
import PageHeader from "../../../components/shared/PageHeader";
import DetailList from "../../../components/Coin/DeliveryOrder/DetailList";
import ItemList from "../../../components/Coin/DeliveryOrder/ItemList";
import axiosInstance from "../../../config/api";
import { useLoading } from "../../../hooks/useLoading";
import { ErrorToastProps, TextProps } from "../../../components/shared/CustomStylings";
import Button from "../../../components/shared/Forms/Button";

const DeliveryOrderDetail = () => {
  const [tabValue, setTabValue] = useState("Order Detail");

  const routes = useRoute();
  const navigation = useNavigation();

  const { id } = routes.params;

  const { toggle: toggleProcessDO, isLoading: processDOIsLoading } = useLoading(false);

  const { data, isLoading } = useFetch(`/acc/delivery-order/${id}`);

  const tabs = useMemo(() => {
    return [
      { title: `Order Detail`, value: "Order Detail" },
      { title: `Item List`, value: "Item List" },
    ];
  }, []);

  const onChangeTab = (value) => {
    setTabValue(value);
  };

  const headerTableArr = [{ name: "Item" }, { name: "Qty" }, { name: "Total Amount" }];

  const dataArr = [
    { name: "DO Number", data: data?.data?.do_no },
    { name: "Delivery Order Date", data: dayjs(data?.data?.do_date).format("MM/DD/YYYY") },
    { name: "Customer", data: data?.data?.customer?.name },
    { name: "Shipping Address", data: data?.data?.shipping_address },
    { name: "Shipping Date", data: dayjs(data?.data?.shipping_date).format("MM/DD/YYYY") },
    { name: "Courier", data: data?.data?.courier?.name },
    { name: "FoB", data: data?.data?.fob?.name },
    { name: "Notes", data: data?.data?.notes },
  ];

  const downloadDeliveryOrderHandler = async () => {
    try {
      toggleProcessDO();
      const res = await axiosInstance.get(`/acc/delivery-order/${id}/generate-delivery-order`);
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${res.data.data}`);
      toggleProcessDO();
    } catch (err) {
      console.log(err);
      toggleProcessDO();
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Delivery Order Detail" onPress={() => navigation.goBack()} />
        <Button height={35} padding={10} onPress={() => downloadDeliveryOrderHandler()} disabled={processDOIsLoading}>
          {!processDOIsLoading ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
              }}
            >
              <MaterialCommunityIcons name="tray-arrow-down" size={20} color="#FFFFFF" />
              <Text
                style={[
                  TextProps,
                  {
                    color: "#FFFFFF",
                    fontWeight: "500",
                  },
                ]}
              >
                Download
              </Text>
            </View>
          ) : (
            <ActivityIndicator />
          )}
        </Button>
      </View>
      <View style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 14 }}>
        <Tabs tabs={tabs} value={tabValue} onChange={onChangeTab} />
      </View>
      {tabValue === "Order Detail" ? (
        <View style={styles.content}>
          <DetailList data={dataArr} isLoading={isLoading} />
        </View>
      ) : (
        <View style={styles.content}>
          <ItemList header={headerTableArr} data={data?.data?.delivery_order_item} isLoading={isLoading} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default DeliveryOrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  header: {
    gap: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    marginVertical: 5,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 8,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 10,
    gap: 10,
    flex: 1,
  },
});
