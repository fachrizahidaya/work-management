import dayjs from "dayjs";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SheetManager } from "react-native-actions-sheet";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";
import Tabs from "../../shared/Tabs";

const ReimbursementList = ({ data, tabs, tabValue, onChangeTab }) => {
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  return (
    <>
      <Tabs
        tabs={tabs}
        value={tabValue}
        onChange={onChangeTab}
        justify="space-evenly"
        flexDir="row"
        gap={2}
      />
      <View style={{ gap: 15 }}>
        <ScrollView style={{ maxHeight: 300 }}>
          <View style={styles.container}>
            {tabValue === "pending" ? (
              data.map((item) => {
                return (
                  <View
                    style={{
                      gap: 5,
                      borderTopColor: "#E8E9EB",
                      borderTopWidth: 1,
                      padding: 5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={[{ fontSize: 14 }, TextProps]}>
                        {item.title}
                      </Text>
                      <Pressable
                        style={{ marginRight: 1 }}
                        onPress={() =>
                          SheetManager.show("form-sheet", {
                            payload: {
                              children: (
                                <View
                                  style={{
                                    display: "flex",
                                    gap: 21,
                                    paddingHorizontal: 20,
                                    paddingVertical: 16,
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={async () => {
                                      await SheetManager.hide("form-sheet");
                                    }}
                                  >
                                    <Text style={[{ fontSize: 12 }, TextProps]}>
                                      Cancel Request
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ),
                            },
                          })
                        }
                      >
                        <MaterialCommunityIcons
                          name="dots-vertical"
                          size={15}
                          color="#3F434A"
                        />
                      </Pressable>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <Text style={[{ fontSize: 12 }, TextProps]}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={[{ fontSize: 12 }, TextProps]}>
                        {rupiah(item.total)}
                      </Text>

                      <MaterialCommunityIcons
                        name="attachment"
                        size={15}
                        color="#186688"
                        style={{ transform: [{ rotate: "-35deg" }] }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={[{ fontSize: 12 }, TextProps]}>
                        {dayjs(item.date).format("DD.MM.YYYY")}
                      </Text>
                      <Text style={[{ fontSize: 12 }, TextProps]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <ScrollView>
                <View style={styles.content}>
                  <EmptyPlaceholder height={250} width={250} text="No Data" />
                </View>
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ReimbursementList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8F8",
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 5,
  },
  content: {
    marginTop: 20,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
