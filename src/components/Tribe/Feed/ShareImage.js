import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { TextProps } from "../../shared/CustomStylings";

const ShareImage = ({
  reference,
  navigation,
  postRefetch,
  loggedEmployeeId,
  loggedEmployeeImage,
  loggedEmployeeName,
  loggedEmployeeDivision,
  toggleSuccess,
  setImage,
  image,
  toggleFullScreen,
  type,
}) => {
  return (
    <ActionSheet ref={reference} onClose={() => reference.current?.hide()} size="full">
      <View
        style={{
          display: "flex",
          gap: 21,
          paddingHorizontal: 20,
          paddingVertical: 16,
          paddingBottom: 40,
        }}
      >
        <View
          style={{
            gap: 1,
            backgroundColor: "#F5F5F5",
            borderRadius: 10,
          }}
        >
          {type === "Feed" && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("New Feed", {
                  postRefetchHandler: postRefetch,
                  loggedEmployeeId: loggedEmployeeId,
                  loggedEmployeeImage: loggedEmployeeImage,
                  loggedEmployeeName: loggedEmployeeName,
                  loggedEmployeeDivision: loggedEmployeeDivision,
                  toggleSuccess: toggleSuccess,
                  imageToShare: image,
                  setImageToShare: setImage,
                });
                toggleFullScreen(false);
                reference.current?.hide();
              }}
              style={{
                ...styles.containerApproval,
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
              }}
            >
              <Text style={[{ fontSize: 16, fontWeight: "400" }, TextProps]}>New Feed</Text>
            </TouchableOpacity>
          )}
          {type === "Chat" && (
            <TouchableOpacity
              //   onPress={ () => {
              //     responseHandler("Rejected", item);
              //  reference.current?.hide()
              //   }}
              style={{
                ...styles.containerApproval,
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF",
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontWeight: "400",
                  },
                  TextProps,
                ]}
              >
                Nest
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ActionSheet>
  );
};

export default ShareImage;

const styles = StyleSheet.create({
  containerApproval: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    height: 50,
    padding: 10,
    borderRadius: 10,
  },
});
