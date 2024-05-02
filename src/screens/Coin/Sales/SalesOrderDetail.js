import { useMemo, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { ActivityIndicator, Linking, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import Tabs from "../../../components/shared/Tabs";
import DetailList from "../../../components/Coin/shared/DetailList";
import ItemList from "../../../components/Coin/shared/ItemList";
import { useFetch } from "../../../hooks/useFetch";
import { useLoading } from "../../../hooks/useLoading";
import axiosInstance from "../../../config/api";
import { ErrorToastProps, TextProps } from "../../../components/shared/CustomStylings";
import Button from "../../../components/shared/Forms/Button";
import { useDisclosure } from "../../../hooks/useDisclosure";
import ItemDetail from "../../../components/Coin/shared/ItemDetail";

const SalesOrderDetail = () => {
  const [tabValue, setTabValue] = useState("Order Detail");
  const [itemDetailData, setItemDetailData] = useState(null);

  const routes = useRoute();
  const navigation = useNavigation();

  const { id } = routes.params;

  const { toggle: toggleProcessSO, isLoading: processSOIsLoading } = useLoading(false);

  const { toggle: toggleItemDetail, isOpen: itemDetailIsOpen } = useDisclosure(false);

  const { data, isLoading } = useFetch(`/acc/sales-order/${id}`);

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
    { name: "SO Number", data: data?.data?.so_no },
    { name: "Sales Order Date", data: dayjs(data?.data?.so_date).format("MM/DD/YYYY") },
    { name: "Sales Person", data: data?.data?.sales_person?.name },
    { name: "Customer", data: data?.data?.customer?.name },
    { name: "Terms of Payment", data: data?.data?.terms_payment?.name },
    { name: "Shipping Address", data: data?.data?.shipping_address },
    { name: "Shipping Date", data: dayjs(data?.data?.shipping_date).format("MM/DD/YYYY") },
    { name: "Courier", data: data?.data?.courier?.name },
    { name: "FoB", data: data?.data?.fob?.name },
    { name: "Notes", data: data?.data?.notes },
  ];

  const openItemDetailModalHandler = (value) => {
    toggleItemDetail();
    setItemDetailData(value);
  };

  const closeItemDetailModalHandler = () => {
    toggleItemDetail();
    setItemDetailData(null);
  };

  const downloadSalesOrderHandler = async () => {
    try {
      toggleProcessSO();
      const res = await axiosInstance.get(`/acc/sales-order/${id}/generate-sales-order`);
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${res.data.data}`);
      toggleProcessSO();
    } catch (err) {
      console.log(err);
      toggleProcessSO();
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Sales Order Detail" onPress={() => navigation.goBack()} />
        <Button height={35} padding={10} onPress={() => downloadSalesOrderHandler()} disabled={processSOIsLoading}>
          {!processSOIsLoading ? (
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
          <ItemList
            header={headerTableArr}
            currencyConverter={currencyConverter}
            data={data?.data?.sales_order_item}
            isLoading={isLoading}
            discount={currencyConverter.format(data?.data?.discount_amount) || `${data?.data?.discount_percent}%`}
            tax={currencyConverter.format(data?.data?.tax_amount)}
            sub_total={currencyConverter.format(data?.data?.subtotal_amount)}
            total_amount={currencyConverter.format(data?.data?.total_amount)}
            toggleModal={openItemDetailModalHandler}
          />
        </View>
      )}
      <ItemDetail
        visible={itemDetailIsOpen}
        backdropPress={toggleItemDetail}
        onClose={closeItemDetailModalHandler}
        data={itemDetailData}
        converter={currencyConverter}
      />
    </SafeAreaView>
  );
};

export default SalesOrderDetail;

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
