import React, { useEffect } from "react";
import { Dimensions, Platform, StatusBar, View } from "react-native";

import Modal from "react-native-modal";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SuccessModal = ({ isOpen, toggle, topElement, bottomElement, onSuccess, multipleModal = false }) => {
  const deviceWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        toggle();
        if (multipleModal) {
          onSuccess(false);
        } else {
          null;
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <>
      <StatusBar animated={true} backgroundColor={isOpen ? "#176688" : null} />
      <Modal
        isVisible={isOpen}
        deviceHeight={Platform.OS === "ios" ? 150 : 125}
        deviceWidth={deviceWidth}
        animationIn={"slideInDown"}
        animationOut={"slideOutUp"}
        backdropColor="#176688"
        backdropOpacity={1}
        hideModalContentWhileAnimating={true}
        useNativeDriver={false}
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 10,
          gap: 10,
          flex: 0.2,
        }}
      >
        <View
          style={{
            alignItems: "center",
            gap: 5,
            paddingTop: Platform.OS === "ios" ? 30 : null,
          }}
        >
          {topElement}
          {bottomElement}
        </View>
        <MaterialCommunityIcons onPress={() => toggle()} name="chevron-up" color="#FFFFFF" size={20} />
      </Modal>
    </>
  );
};

export default SuccessModal;
