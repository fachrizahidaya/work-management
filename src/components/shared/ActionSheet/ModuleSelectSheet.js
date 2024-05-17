import React from "react";

import { useDispatch, useSelector } from "react-redux";

import ActionSheet from "react-native-actions-sheet";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { setModule } from "../../../redux/reducer/module";
import { TextProps } from "../CustomStylings";

/**
 * @function ModuleSelectSheet
 * @param {boolean} isOpen - Whether the module selection slider is open or closed.
 */
const ModuleSelectSheet = (props) => {
  const dispatch = useDispatch();
  // Get user data from the Redux store
  const userSelector = useSelector((state) => state.auth);

  return (
    <ActionSheet ref={props.reference}>
      <View style={styles.container}>
        {userSelector?.user_module &&
          userSelector.user_module
            .filter(
              (item) => item.module_name === "BAND" || item.module_name === "TRIBE" || item.module_name === "PIPE"
              // || item.module_name === "COIN"
            )
            .map((item, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.wrapper}
                  onPress={() => {
                    dispatch(setModule(item.module_name));
                    props.reference.current?.hide();
                  }}
                >
                  <View style={styles.flex}>
                    <Image
                      source={{
                        uri: `${item.module_image}ICON.png`,
                      }}
                      alt={item.module_name}
                      style={styles.image}
                    />
                    <View style={styles.flex}>
                      <Text style={TextProps}>
                        {item.module_name.charAt(0).toUpperCase() + item.module_name.slice(1).toLowerCase()}
                      </Text>
                      <Text style={TextProps}> | {item.module_label}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
      </View>
    </ActionSheet>
  );
};

export default ModuleSelectSheet;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 30,
    width: 30,
    borderRadius: 50,
    resizeMode: "contain",
    marginRight: 15,
  },
  item: {
    backgroundColor: "#f7f7f7",
    borderRadius: 5,
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
