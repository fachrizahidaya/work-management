import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import { SafeAreaView, StyleSheet, View } from "react-native";

import PageHeader from "../../../components/shared/PageHeader";
import PurchaseOrderFilter from "../../../components/Coin/PurchaseOrder/PurchaseOrderFilter";
import PurchaseOrderList from "../../../components/Coin/PurchaseOrder/PurchaseOrderList";
import { useFetch } from "../../../hooks/useFetch";
import CardSkeleton from "../../../components/Coin/shared/CardSkeleton";

const PurchaseOrder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);
  const [inputToShow, setInputToShow] = useState("");
  const [hasBeenScrolled, setHasBeenScrolled] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState([]);

  const navigation = useNavigation();

  const fetchPurchaseOrderParameters = {
    page: currentPage,
    search: searchInput,
    limit: 20,
  };

  const { data, isFetching, isLoading } = useFetch(`/acc/po`, [currentPage, searchInput], fetchPurchaseOrderParameters);

  const fetchMorePurchaseOrder = () => {
    if (currentPage < data?.data?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const searchPurchaseOrderHandler = useCallback(
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
    setPurchaseOrder([]);
    setFilteredDataArray([]);
  }, [searchInput]);

  useEffect(() => {
    if (data?.data?.data.length) {
      if (!searchInput) {
        setPurchaseOrder((prevData) => [...prevData, ...data?.data?.data]);
        setFilteredDataArray([]);
      } else {
        setFilteredDataArray((prevData) => [...prevData, ...data?.data?.data]);
        setPurchaseOrder([]);
      }
    }
  }, [data]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <PageHeader title="Purchase Order" onPress={() => navigation.goBack()} />
          <PurchaseOrderFilter
            handleSearch={searchPurchaseOrderHandler}
            inputToShow={inputToShow}
            setInputToShow={setInputToShow}
            setSearchInput={setSearchInput}
          />
        </View>
        <PurchaseOrderList
          data={purchaseOrder}
          isLoading={isLoading}
          isFetching={isFetching}
          renderSkeletons={renderSkeletons}
          fetchMore={fetchMorePurchaseOrder}
          filteredData={filteredDataArray}
          hasBeenScrolled={hasBeenScrolled}
          setHasBeenScrolled={setHasBeenScrolled}
          navigation={navigation}
        />
      </SafeAreaView>
    </>
  );
};

export default PurchaseOrder;

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
