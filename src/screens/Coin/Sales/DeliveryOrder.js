import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import { SafeAreaView, StyleSheet, View } from "react-native";

import PageHeader from "../../../components/shared/PageHeader";
import { useFetch } from "../../../hooks/useFetch";
import DeliveryOrderList from "../../../components/Coin/DeliveryOrder/DeliveryOrderList";
import DeliveryOrderFilter from "../../../components/Coin/DeliveryOrder/DeliveryOrderFilter";

const DeliveryOrder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [deliveryOrder, setDeliveryOrder] = useState([]);

  const navigation = useNavigation();

  const fetchDeliveryOrderParameters = {
    page: currentPage,
    search: searchInput,
    limit: 20,
  };

  const { data, isFetching, isLoading, refetch } = useFetch(
    `/acc/delivery-order`,
    [currentPage, searchInput],
    fetchDeliveryOrderParameters
  );

  const fetchMoreDeliveryOrder = () => {
    if (currentPage < data?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const searchDeliveryOrderHandler = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    setDeliveryOrder([]);
    setFilteredDataArray([]);
  }, [searchInput]);

  useEffect(() => {
    if (data?.data?.data.length) {
      if (!searchInput) {
        setDeliveryOrder((prevData) => [...prevData, ...data?.data?.data]);
        setFilteredDataArray([]);
      } else {
        setFilteredDataArray((prevData) => [...prevData, ...data?.data?.data]);
        setDeliveryOrder([]);
      }
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Delivery Order" onPress={() => navigation.goBack()} />
        <DeliveryOrderFilter
          handleSearch={searchDeliveryOrderHandler}
          inputToShow={inputToShow}
          setInputToShow={setInputToShow}
          setSearchInput={setSearchInput}
        />
      </View>
      <DeliveryOrderList
        data={deliveryOrder}
        filteredData={filteredDataArray}
        isLoading={isLoading}
        hasBeenScrolled={hasBeenScrolled}
        setHasBeenScrolled={setHasBeenScrolled}
        fetchMore={fetchMoreDeliveryOrder}
        isFetching={isFetching}
        refetch={refetch}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default DeliveryOrder;

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
  },
});
