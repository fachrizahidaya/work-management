import React from "react";

import { SheetManager } from "react-native-actions-sheet";

import { View, Text, TouchableOpacity } from "react-native";

import Button from "../../../../shared/Forms/Button";
import Select from "../../../../shared/Forms/Select";
import { TextProps } from "../../../../shared/CustomStylings";

const FilterSheet = ({ members, setResponsibleId }) => {
  return (
    <View style={{ display: "flex", alignItems: "center", paddingHorizontal: 4, paddingVertical: 20 }}>
      <View style={{ width: "95%", display: "flex", gap: 15 }}>
        <Text style={[{ fontWeight: 500 }, TextProps]}>Member</Text>
        <Select
          placeHolder="Select member"
          items={
            <>
              <TouchableOpacity
                onPress={() => {
                  setResponsibleId("all");
                  SheetManager.hide("select-sheet");
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 500 }}>All Member</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setResponsibleId("");
                  SheetManager.hide("select-sheet");
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 500 }}>Not Assigned</Text>
              </TouchableOpacity>

              {members?.length > 0 &&
                members.map((member, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={(value) => {
                        setResponsibleId(value);
                        SheetManager.hide("select-sheet");
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: 500 }}>
                        {member?.member_name?.split(" ")[0] || member.responsible_name.split(" ")[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </>
          }
        />
        {/* <Select
          onValueChange={(value) => setResponsibleId(value)}
          defaultValue={responsibleId}
          dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
        >
          <Select.Item label="All Member" value="all" />
          <Select.Item label="Not Assigned" value="" />
          {members?.length > 0 &&
            members.map((member, index) => {
              return (
                <Select.Item
                  key={index}
                  label={member?.member_name?.split(" ")[0] || member.responsible_name.split(" ")[0]}
                  value={member.user_id || member.responsible_id}
                />
              );
            })}
        </Select> */}

        <Text style={[{ fontWeight: 500 }, TextProps]}>Label</Text>
        <Select placeHolder="Select label" />

        {/* <Select
          defaultValue={selectedLabel}
          onValueChange={(value) => onPressLabel(value)}
          dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
        >
          <Select.Item label="No Label" value="" />

          {labels?.data.map((label) => {
            return <Select.Item key={label.id} label={label.label_name} value={label.label_id} />;
          })}
        </Select> */}

        <Text style={[{ fontWeight: 500 }, TextProps]}>Due Date</Text>
        <Select placeHolder="No due date" />

        {/* <Select
          defaultValue={deadlineSort}
          onValueChange={(value) => setDeadlineSort(value)}
          dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
        >
          <Select.Item label="Closest" value="asc" />
          <Select.Item label="Latest" value="desc" />
        </Select> */}

        <Text style={[{ fontWeight: 500 }, TextProps]}>Priority</Text>
        <Select placeHolder="Select priority" />

        {/* <Select
          defaultValue={selectedPriority}
          onValueChange={(value) => setSelectedPriority(value)}
          dropdownIcon={<Icon as={<MaterialCommunityIcons name="chevron-down" />} size="lg" mr={2} />}
        >
          <Select.Item label="All Priority" value="" />
          <Select.Item label="Low" value="Low" />
          <Select.Item label="Medium" value="Medium" />
          <Select.Item label="High" value="High" />
        </Select> */}

        <Button
          styles={{ marginTop: 4 }}
          onPress={() => {
            setDeadlineSort("asc");
            setResponsibleId("");
            setSelectedLabel("");
            setSelectedPriority("");

            // Reset labels
            setSelectedLabel("");
            setSelectedLabelId(null);
          }}
        >
          <Text style={{ color: "white", fontWeight: 500 }}>Reset Filter</Text>
        </Button>
      </View>
    </View>
  );
};

export default FilterSheet;
