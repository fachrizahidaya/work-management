import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
// import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";

import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import Button from "../../../components/shared/Forms/Button";
import DataEntrySessions from "../../../components/Pipe/DataEntry/DataEntrySessions";

const DataEntryScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);

  const arrData = [
    { date: "2024-05-17", shift: 1, person_in_charge: "Riza" },
    { date: "2024-05-18", shift: 2, person_in_charge: "Huda" },
  ];

  const navigation = useNavigation();

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
  };

  const handleScanBarcodeAgain = () => {
    setScanned(false);
    setData(null);
  };

  // useEffect(() => {
  //   const getBarcodeScannerPermissions = async () => {
  //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   };

  //   getBarcodeScannerPermissions();
  // }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>Access denied</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Data Entry" onPress={() => navigation.goBack()} />
      </View>
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => {
          navigation.navigate("New Feed", params);
        }}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.wrapper}>
        <FlashList
          data={arrData}
          estimatedItemSize={50}
          renderItem={({ item }) => (
            <DataEntrySessions date={item?.date} shift={item?.shift} pic={item?.person_in_charge} />
          )}
        />

        {/* <BarCodeScanner style={styles.scanner} onBarCodeScanned={scanned ? undefined : handleBarcodeScanned} /> */}
        {/* <View style={{ alignItems: "center" }}>
          <Text>{data ? data : ""}</Text>
        </View> */}
      </View>
      {/* <View style={{ paddingHorizontal: 14, paddingVertical: 16, gap: 10 }}>
        {scanned && (
          <Button onPress={() => handleScanBarcodeAgain()}>
            <Text style={{ color: "#FFFFFF" }}>Tap to Scan again</Text>
          </Button>
        )}
        <StatusBar style="auto" />
      </View> */}
    </SafeAreaView>
  );
};

export default DataEntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 14,
  },
  scanner: {
    height: 500,
    width: 500,
  },
  addIcon: {
    backgroundColor: "#377893",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 30,
    right: 15,
    zIndex: 2,
    borderRadius: 30,
    shadowOffset: 0,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});
