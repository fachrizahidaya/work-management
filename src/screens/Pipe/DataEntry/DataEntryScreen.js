import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";

import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import PageHeader from "../../../components/shared/PageHeader";
import { card } from "../../../styles/Card";
import { TextProps } from "../../../components/shared/CustomStylings";
import Button from "../../../components/shared/Forms/Button";

const DataEntryScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [type, setType] = useState(null);

  const navigation = useNavigation();

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    setType(type);
  };

  const handleScanBarcodeAgain = () => {
    setScanned(false);
    setData(null);
    setType(null);
  };

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarcodeScannerPermissions();
  }, []);

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
      <View style={styles.wrapper}>
        <BarCodeScanner style={styles.scanner} onBarCodeScanned={scanned ? undefined : handleBarcodeScanned} />
        <View style={{}}>
          <Text>{data ? data : ""}</Text>
          <Text>{type ? type : ""}</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 14, paddingVertical: 16, gap: 10 }}>
        {scanned && (
          <Button onPress={() => handleScanBarcodeAgain()}>
            <Text style={{ color: "#FFFFFF" }}>Tap to Scan again</Text>
          </Button>
        )}
        <StatusBar style="auto" />
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  scanner: {
    height: 500,
    width: 500,
  },
});
