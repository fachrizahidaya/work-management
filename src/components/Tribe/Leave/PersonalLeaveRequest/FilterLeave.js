import React, { useCallback } from "react";
import { SheetManager } from "react-native-actions-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Select from "../../../../components/shared/Forms/Select";
import { Pressable, View } from "react-native";

const FilterLeave = ({ filterYear, setFilterYear, filterType, setFilterType }) => {
  return (
    <>
      <Pressable
        style={{ padding: 5, borderWidth: 1, borderRadius: 10, borderColor: "#E8E9EB" }}
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
                    paddingBottom: 40,
                  }}
                >
                  <Select
                    value={filterYear}
                    placeHolder={filterYear ? filterYear : "Select Year"}
                    items={[
                      { value: 2024, label: 2024 },
                      { value: 2023, label: 2023 },
                    ]}
                    onChange={(value) => setFilterYear(value)}
                    hasParentSheet
                  />
                  <Select
                    value={filterType}
                    placeHolder={filterType ? filterType : "Select Type"}
                    items={[
                      { value: "personal", label: "Personal" },
                      { value: "team", label: "Team" },
                    ]}
                    onChange={(value) => setFilterType(value)}
                    hasParentSheet
                  />
                </View>
              ),
            },
          })
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <MaterialCommunityIcons name="tune-variant" size={20} color="#3F434A" />
        </View>
      </Pressable>
    </>
  );
};

export default FilterLeave;
