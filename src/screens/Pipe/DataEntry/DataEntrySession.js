import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../../components/shared/PageHeader";
import Button from "../../../components/shared/Forms/Button";

const DataEntrySession = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [courier, setCourier] = useState(null);
  const [courierName, setCourierName] = useState(null);
  const [couriers, setCouriers] = useState([
    { name: "Shopee Xpress", tag: "spx", courier_code: "SPX", qty: 0 },
    { name: "JNE", tag: "jne", courier_code: "TLJ", qty: 0 },
    { name: "SiCepat", tag: "sicepat", courier_code: "004", qty: 0 },
    {
      name: "J&T Express",
      tag: "jt-express",
      courier_code: "JP",
      qty: 0,
    },
    { name: "J&T Cargo", tag: "jt-cargo", courier_code: "200", qty: 0 },
  ]);

  const navigation = useNavigation();

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    handleCheckCourier(data);
  };

  const handleScanBarcodeAgain = () => {
    setScanned(false);
    setData(null);
    setCourierName(null);
    setCourier(null);
  };

  const handleCheckCourier = (awb) => {
    const awbPrefix = awb?.slice(0, 3);
    setCouriers((prevCouriers) => {
      const updatedCouriers = prevCouriers?.map((courier) => {
        if (awbPrefix.includes(courier.courier_code)) {
          setCourierName(courier.name);
          setCourier(courier.tag);
          return { ...courier, qty: courier.qty + 1 };
        }
        return courier;
      });
      const foundCourier = updatedCouriers.find((courier) => awbPrefix.includes(courier.courier_code));
      if (!foundCourier) {
        setCourierName(null);
        setCourier("not-found");
      }
      return updatedCouriers;
    });
  };

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarcodeScannerPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PageHeader title="Data Scan" onPress={() => navigation.goBack()} />
      </View>

      <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
        {courier === "not-found" && <Text>Not Found</Text>}

        <Text>{courierName ? `${courierName}` : ""}</Text>
        <Text>{data && courier !== "not-found" ? `AWB: ${data}` : ""}</Text>
        {hasPermission === false ? (
          <Text>Access denied</Text>
        ) : hasPermission === null ? (
          <Text>Please grant camera access</Text>
        ) : (
          <BarCodeScanner style={styles.scanner} onBarCodeScanned={scanned ? undefined : handleBarcodeScanned} />
        )}
        {scanned && (
          <Button padding={10} onPress={() => handleScanBarcodeAgain()}>
            <Text style={{ color: "#FFFFFF" }}>Tap to Scan again</Text>
          </Button>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: 5,
          }}
        >
          {couriers.map((item, index) => {
            return (
              <View key={index} style={{ alignItems: "center", gap: 10, padding: 5 }}>
                <Text>{item.name}</Text>
                <Text>{item.qty}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DataEntrySession;

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
  scanner: {
    height: "70%",
    width: "100%",
  },
  image: {
    height: 90,
    width: 250,
    resizeMode: "cover",
    alignSelf: "center",
    borderWidth: 1,
  },
  tableContainer: { flex: 1, padding: 16, paddingTop: 30 },
  tableHead: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
});
