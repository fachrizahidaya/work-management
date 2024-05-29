import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../shared/Forms/Input";
import { TextProps } from "../../shared/CustomStylings";
import { FlashList } from "@shopify/flash-list";

const AWBScannedList = ({ reference, items }) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => reference.current?.show()}>
      <MaterialCommunityIcons name="format-list-bulleted" size={30} color="#FFFFFF" />

      <ActionSheet
        ref={reference}
        onClose={() => {
          reference.current?.hide();
          // setSearchInput("");
          // setInputToShow("");
        }}
        containerStyle={{ height: 550 }}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 16, gap: 21, paddingBottom: 40, flex: 1 }}>
          {/* <Input
              value={inputToShow}
              fieldName={fieldNameSearch}
              startIcon="magnify"
              endIcon={inputToShow && "close-circle-outline"}
              onPressEndIcon={() => {
                setInputToShow("");
                setSearchInput("");
              }}
              onChangeText={(value) => {
                handleSearch(value);
                setInputToShow(value);
              }}
              placeHolder="Search..."
              height={40}
            /> */}
          <FlashList
            data={items}
            estimatedItemSize={50}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => (
              <TouchableOpacity key={index}>
                <Text style={[TextProps]}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          {/* {items.map((item, index) => {
            return (
              <TouchableOpacity key={index}>
                <Text style={[TextProps]}>{item}</Text>
              </TouchableOpacity>
            );
          })} */}
        </View>
      </ActionSheet>
    </TouchableOpacity>
  );
};

export default AWBScannedList;

const styles = StyleSheet.create({
  wrapper: {
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
