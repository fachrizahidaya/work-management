import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { SheetManager } from "react-native-actions-sheet";

import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../../../hooks/useDisclosure";
import ConfirmationModal from "../../../../shared/ConfirmationModal";
import useCheckAccess from "../../../../../hooks/useCheckAccess";
import { TextProps } from "../../../../shared/CustomStylings";

const MenuSection = ({ selectedTask, openEditForm, disabled, onTakeTask }) => {
  const navigation = useNavigation();
  const { isOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const editCheckAccess = useCheckAccess("update", "Tasks");
  const deleteCheckAccess = useCheckAccess("delete", "Tasks");

  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        onPress={() =>
          SheetManager.show("form-sheet", {
            payload: {
              children: (
                <View style={{ display: "flex", gap: 21, paddingHorizontal: 20, paddingVertical: 16 }}>
                  <TouchableOpacity
                    onPress={async () => {
                      await onTakeTask();
                      SheetManager.hide("form-sheet");
                    }}
                  >
                    <Text style={TextProps}>Take task</Text>
                  </TouchableOpacity>
                  {editCheckAccess && (
                    <TouchableOpacity
                      onPress={() => {
                        SheetManager.hide("form-sheet");
                        openEditForm();
                      }}
                    >
                      <Text style={TextProps}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  {deleteCheckAccess && (
                    <TouchableOpacity
                      onPress={async () => {
                        await SheetManager.hide("form-sheet");
                        toggleDeleteModal();
                      }}
                    >
                      <Text style={{ color: "red" }}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ),
            },
          })
        }
      >
        <MaterialCommunityIcons name="dots-vertical" size={20} style={{ opacity: disabled ? 0.5 : 1 }} />
      </TouchableOpacity>

      <ConfirmationModal
        isOpen={isOpen}
        toggle={toggleDeleteModal}
        apiUrl={`/pm/tasks/${selectedTask?.id}`}
        successMessage="Task deleted"
        header="Delete Task"
        description={`Are you sure to delete ${selectedTask?.title}?`}
        hasSuccessFunc={true}
        onSuccess={() => navigation.goBack()}
      />
    </>
  );
};

export default memo(MenuSection);
