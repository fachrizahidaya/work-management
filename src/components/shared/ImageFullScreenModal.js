import { useRef, useState } from "react";

import { Linking, StyleSheet, TouchableOpacity, View, Image, Dimensions, Platform, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ShareImage from "../Tribe/Feed/ShareImage";

const ImageFullScreenModal = ({
  isFullScreen,
  setIsFullScreen,
  file_path,
  media,
  images,
  navigation,
  postRefetch,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  loggedEmployeeDivision,
  toggleSuccess,
  image,
  setImage,
  type,
  setSelectedPicture,
}) => {
  const { width } = Dimensions.get("screen");
  const height = (width / 100) * 60;
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

  const shareImageScreenSheetRef = useRef(null);

  const attachmentDownloadHandler = async (file_path) => {
    try {
      Linking.openURL(`${process.env.EXPO_PUBLIC_API}/download/${file_path}`, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        isVisible={isFullScreen}
        onBackdropPress={() => {
          setIsFullScreen(false);
          setSelectedPicture(null);
        }}
        backdropColor={media ? "black" : "#272A2B"}
        deviceHeight={deviceHeight}
        deviceWidth={deviceWidth}
        statusBarTranslucent={true}
      >
        {media ? (
          <View
            style={{
              width,
              height,
              position: "relative",
              alignItems: "center",
              justifyContent: "space-between",
              marginLeft: -20, // handler margin left
            }}
          >
            <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} style={{ width, height }}>
              {images.map((item, index) => (
                <>
                  <View>
                    <Image
                      key={index}
                      source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${item}` }}
                      alt="Feed Image"
                      style={{
                        ...styles.image,
                        width,
                        height,
                        resizeMode: "contain",
                        // transform: [{ scale }, { translateX }],
                      }}
                    />
                    {/* <Image
                  key={index}
                  source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${item}` }}
                  alt="Feed Image"
                  style={{ ...styles.image, width, height, resizeMode: "contain" }}
                /> */}
                    <View style={styles.actionGroupMedia}>
                      <TouchableOpacity style={{ padding: 5 }} onPress={() => attachmentDownloadHandler(item)}>
                        <MaterialCommunityIcons name="download" size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 5 }} onPress={() => setIsFullScreen(false)}>
                        <MaterialCommunityIcons name="close" size={20} color="#FF7272" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ))}
            </ScrollView>

            {/* <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            style={{ width, height: 40 }}
          >
            {images.map((item, index) => (
              <View>
                <Image
                  key={index}
                  source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${item}` }}
                  alt="Feed Image"
                  style={{ width: 80, height: 80, resizeMode: "contain" }}
                />
              </View>
            ))}
          </ScrollView> */}
          </View>
        ) : (
          <>
            <ReactNativeZoomableView
              maxZoom={1.5}
              minZoom={1}
              zoomStep={0.5}
              initialZoom={1}
              bindToBorders={true}
              captureEvent={true}
            >
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
                  alt="Feed Image"
                  style={{
                    ...styles.image,
                  }}
                />
              </View>
            </ReactNativeZoomableView>
            <View style={styles.actionGroup}>
              {/* <TouchableOpacity style={{ padding: 5 }} onPress={() => shareImageScreenSheetRef.current?.show()}>
                <MaterialCommunityIcons name="share-variant" size={30} color="#FFFFFF" />
              </TouchableOpacity> */}
              <TouchableOpacity style={{ padding: 5 }} onPress={() => attachmentDownloadHandler(file_path)}>
                <MaterialCommunityIcons name="download" size={30} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  setIsFullScreen(false);
                  setSelectedPicture(null);
                }}
              >
                <MaterialCommunityIcons name="close" size={30} color="#FF7272" />
              </TouchableOpacity>
            </View>
          </>
        )}
        {shareImageScreenSheetRef && (
          <ShareImage
            reference={shareImageScreenSheetRef}
            navigation={navigation}
            postRefetch={postRefetch}
            loggedEmployeeId={loggedEmployeeId}
            loggedEmployeeImage={loggedEmployeeImage}
            loggedEmployeeName={loggedEmployeeName}
            loggedEmployeeDivision={loggedEmployeeDivision}
            toggleSuccess={toggleSuccess}
            setImage={setImage}
            image={image}
            toggleFullScreen={setIsFullScreen}
            type={type}
          />
        )}
      </Modal>
    </>
  );
};

export default ImageFullScreenModal;

const styles = StyleSheet.create({
  imageBox: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    height: 600,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 600,
    resizeMode: "contain",
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    right: 0,
    top: 50,
    gap: 5,
  },
  actionGroupMedia: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    right: 10,
    top: 15,
    gap: 5,
  },
});
