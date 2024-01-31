import React, { useCallback, useState } from "react";

import _ from "lodash";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";

import Input from "../../components/shared/Forms/Input";
import { useFetch } from "../../hooks/useFetch";
import GlobalSearchItems from "../../components/Band/GlobalSearch/GlobalSearchItems/GlobalSearchItems";

const GlobalSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [shownInput, setShownInput] = useState("");

  const { data, isFetching } = useFetch(searchInput && "/pm/global-search", [searchInput], {
    search: searchInput,
    sort: "desc",
  });

  const handleSearch = useCallback(
    _.debounce((value) => {
      setSearchInput(value);
    }, 500),
    []
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            display: "flex",
            gap: 15,
            marginHorizontal: 16,
            marginVertical: 13,
            justifyContent: "center",
            gap: 20,
          }}
        >
          <Input
            value={shownInput}
            placeHolder="Search..."
            startAdornment={
              <Pressable>
                <MaterialCommunityIcons name="magnify" size={20} color="#3F434A" />
              </Pressable>
            }
            onChangeText={(value) => {
              handleSearch(value);
              setShownInput(value);
            }}
            endAdornment={
              <View style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "center" }}>
                {shownInput && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchInput("");
                      setShownInput("");
                    }}
                  >
                    <MaterialCommunityIcons name="close" size={20} color="#3F434A" />
                  </TouchableOpacity>
                )}
              </View>
            }
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {!isFetching ? (
              <>
                {data?.project?.length > 0 || data?.task?.length || data?.team?.length ? (
                  <GlobalSearchItems data={data} keyword={searchInput} />
                ) : (
                  <Text style={styles.text}>No result</Text>
                )}
              </>
            ) : (
              <Text style={styles.text}>Data is being fetched...</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default GlobalSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    color: "#8A9099",
    textAlign: "center",
  },
});
