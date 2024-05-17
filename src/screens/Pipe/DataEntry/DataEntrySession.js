import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../../components/shared/PageHeader";
import Button from "../../../components/shared/Forms/Button";

const DataEntrySession = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(null);
  const [courierImage, setCourierImage] = useState(null);
  const [courierName, setCourierName] = useState(null);

  const navigation = useNavigation();

  const couriers = [
    { name: "Shopee Xpress", image_source: require("../../../assets/vectors/spx.png"), courier_code: "SPX" },
    { name: "JNE", image_source: require("../../../assets/vectors/jne.png"), courier_code: "TLJR" },
    { name: "SiCepat", image_source: require("../../../assets/vectors/sicepat.png"), courier_code: "004" },
    { name: "J&T Express", image_source: require("../../../assets/vectors/jt-express.png"), courier_code: "JP" },
    { name: "J&T Cargo", image_source: require("../../../assets/vectors/jt-cargo.png"), courier_code: "200" },
  ];

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    handleCheckCourier(data);
  };

  const handleScanBarcodeAgain = () => {
    setScanned(false);
    setData(null);
    setCourierName(null);
    setCourierImage(null);
  };

  const handleCheckCourier = (awb) => {
    const courier = couriers.find((courier) => awb.includes(courier.courier_code));
    if (courier) {
      setCourierName(courier.name);
      setCourierImage(courier.image_source);
    } else {
      setCourierName(null);
      setCourierImage("not-found");
    }
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
        <PageHeader title="Data Scan" onPress={() => navigation.goBack()} />
      </View>

      <View style={{ alignItems: "center", justifyContent: "center", gap: 5 }}>
        {courierImage &&
          (courierImage !== "not-found" ? (
            <Image source={courierImage} alt="courier" style={styles.image} />
          ) : (
            <Text>Not Found</Text>
          ))}

        <Text>{courierName ? `${courierName}` : ""}</Text>
        <Text>{data ? `AWB: ${data}` : ""}</Text>
        <BarCodeScanner style={styles.scanner} onBarCodeScanned={scanned ? undefined : handleBarcodeScanned} />
        {scanned && (
          <Button padding={10} onPress={() => handleScanBarcodeAgain()}>
            <Text style={{ color: "#FFFFFF" }}>Tap to Scan again</Text>
          </Button>
        )}
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
    height: 100,
    width: 250,
    resizeMode: "cover",
    alignSelf: "center",
    borderWidth: 1,
  },
});
