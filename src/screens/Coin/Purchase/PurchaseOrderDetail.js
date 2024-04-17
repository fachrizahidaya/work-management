import { useMemo, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import Tabs from "../../../components/shared/Tabs";
import { useFetch } from "../../../hooks/useFetch";
import ItemList from "../../../components/Coin/PurchaseOrder/ItemList";
import DetailList from "../../../components/Coin/PurchaseOrder/DetailList";
import Button from "../../../components/shared/Forms/Button";
import axiosInstance from "../../../config/api";
import { useLoading } from "../../../hooks/useLoading";
import { ErrorToastProps, TextProps } from "../../../components/shared/CustomStylings";

const PurchaseOrderDetail = () => {
  const [tabValue, setTabValue] = useState("Order Detail");

  const routes = useRoute();
  const navigation = useNavigation();

  const { toggle: toggleProcessPO, isLoading: processPOIsLoading } = useLoading(false);

  const { id } = routes.params;

  const { data, isLoading } = useFetch(`/acc/po/${id}`);

  const currencyConverter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

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
    { name: "PO Number", data: data?.data?.po_no },
    { name: "Purchase Date", data: dayjs(data?.data?.po_date).format("MM/DD/YYYY") },
    { name: "Supplier", data: data?.data?.supplier?.name },
    { name: "Terms of Payment", data: data?.data?.terms_payment?.name },
    { name: "Shipping Address", data: data?.data?.shipping_address },
    { name: "Shipping Date", data: dayjs(data?.data?.shipping_date).format("MM/DD/YYYY") },
    { name: "Courier", data: data?.data?.courier?.name },
    { name: "FoB", data: data?.data?.fob },
    { name: "Notes", data: data?.data?.notes },
  ];

  const downloadPurchaseOrderHandler = async () => {
    try {
      toggleProcessPO();
      const res = await axiosInstance.get(`/acc/po/${id}/generate-po`);
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${res.data.data}`);
      toggleProcessPO();
    } catch (err) {
      console.log(err);
      toggleProcessPO();
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Purchase Order Detail" onPress={() => navigation.goBack()} />
        <Button height={35} padding={10} onPress={() => downloadPurchaseOrderHandler()} disabled={processPOIsLoading}>
          {!processPOIsLoading ? (
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
        <View style={styles.wrapper}>
          <ItemList
            header={headerTableArr}
            currencyConverter={currencyConverter}
            data={data?.data?.po_item}
            isLoading={isLoading}
            discount={currencyConverter.format(data?.data?.discount_amount) || `${data?.data?.discount_percent}%`}
            tax={currencyConverter.format(data?.data?.tax)}
            sub_total={currencyConverter.format(data?.data?.subtotal_amount)}
            total_amount={currencyConverter.format(data?.data?.total_amount)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default PurchaseOrderDetail;

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
  wrapper: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 10,
    gap: 10,
    flex: 1,
  },
});
