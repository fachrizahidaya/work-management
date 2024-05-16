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
  const [scanData, setScanData] = useState(false);

  const navigation = useNavigation();

  const barcodeScannedHandler = ({ type, data }) => {
    setScanData(data);
    console.log(type);
  };

  // useEffect(() => {
  //   async () => {
  //     const { status } = BarCodeScanner.requestPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   };
  // }, []);

  if (!hasPermission) {
    return (
      <View>
        <Text>Pleaase grant camera permission to app</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Data Entry" onPress={() => navigation.goBack()} />
      </View>

      {/* <BarCodeScanner style={StyleSheet} onBarCodeScanned={scanData ? null : barcodeScannedHandler} /> */}
      {/* <View style={{ paddingHorizontal: 14, paddingVertical: 16, gap: 10 }}> */}
      {/* {scanData &&  <Button onPress={() => setScanData(null)}>
          <Text style={{ color: "#FFFFFF" }}>Scan again?</Text>
        </Button>
      } */}
      {/* <StatusBar style='auto' /> */}

      {/* </View> */}
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
});
