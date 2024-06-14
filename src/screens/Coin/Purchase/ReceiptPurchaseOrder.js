import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaView, StyleSheet, View } from "react-native";

import { useFetch } from "../../../hooks/useFetch";
import CardSkeleton from "../../../components/Coin/shared/CardSkeleton";
import ReceiptPurchaseOrderList from "../../../components/Coin/ReceiptPurchaseOrder/ReceiptPurchaseOrderList";
import ReceiptPurchaseOrderFilter from "../../../components/Coin/ReceiptPurchaseOrder/ReceiptPurchaseOrderFilter";
import PageHeader from "../../../components/shared/PageHeader";

const ReceiptPurchaseOrder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [receiptPurchaseOrder, setReceiptPurchaseOrder] = useState([]);

  const navigation = useNavigation();

  const fetchReceiptPurchaseOrderParameters = {
    page: currentPage,
    search: searchInput,
    limit: 20,
  };

  const { data, isLoading, isFetching, refetch } = useFetch(
    `/acc/po-receipt`,
    [currentPage, searchInput],
    fetchReceiptPurchaseOrderParameters
  );

  const fetchMoreReceiptPurchaseOrder = () => {
    if (currentPage < data?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const searchReceiptPurchaseOrderHandler = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 2; i++) {
      skeletons.push(<CardSkeleton key={i} />);
    }
    return skeletons;
  };

  useEffect(() => {
    setFilteredDataArray([]);
  }, [searchInput]);

  useEffect(() => {
    if (data?.data?.data?.length) {
      if (!searchInput) {
        setReceiptPurchaseOrder((prevData) => [...prevData, ...data?.data?.data]);
        setFilteredDataArray([]);
      } else {
        setFilteredDataArray((prevData) => [...prevData, ...data?.data?.data]);
        setReceiptPurchaseOrder([]);
      }
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Receipt Purchase Order" onPress={() => navigation.goBack()} />
        <ReceiptPurchaseOrderFilter
          handleSearch={searchReceiptPurchaseOrderHandler}
          inputToShow={inputToShow}
          setInputToShow={setInputToShow}
          setSearchInput={setSearchInput}
        />
      </View>
      <ReceiptPurchaseOrderList
        data={receiptPurchaseOrder}
        isLoading={isLoading}
        isFetching={isFetching}
        refetch={refetch}
        renderSkeletons={renderSkeletons}
        fetchMore={fetchMoreReceiptPurchaseOrder}
        filteredData={filteredDataArray}
        hasBeenScrolled={hasBeenScrolled}
        setHasBeenScrolled={setHasBeenScrolled}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default ReceiptPurchaseOrder;

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
