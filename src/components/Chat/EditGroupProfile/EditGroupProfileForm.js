import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FormButton from "../../shared/FormButton";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import Input from "../../shared/Forms/Input";

const EditGroupProfileForm = ({
  imageAttachment,
  name,
  image,
  pickImageHandler,
  setImageAttachment,
  formik,
  onEdit,
  editName,
}) => {
  return (
    <View style={styles.content}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!imageAttachment ? (
            <AvatarPlaceholder size="xl" name={name} image={!imageAttachment ? image : imageAttachment.uri} />
          ) : (
            <Image
              source={{
                uri: `${imageAttachment?.uri}`,
              }}
              alt="profile picture"
              style={{
                width: 80,
                height: 80,
                resizeMode: "contain",
                borderRadius: 40,
              }}
            />
          )}
          <Pressable
            style={styles.editPicture}
            onPress={!imageAttachment ? () => pickImageHandler(setImageAttachment) : () => setImageAttachment(null)}
          >
            <MaterialCommunityIcons name={!imageAttachment ? "camera-outline" : "close"} size={20} color="#3F434A" />
          </Pressable>
        </View>

        {editName ? (
          <Input
            numberOfLines={2}
            value={formik.values.name}
            onChangeText={(value) => formik.setFieldValue("name", value)}
            defaultValue={name}
            endIcon="close"
            onPressEndIcon={() => {
              onEdit();
              formik.setFieldValue("name", name);
            }}
          />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }} numberOfLines={2}>
              {name}
            </Text>
            <MaterialCommunityIcons name="pencil" size={20} color="#3F434A" onPress={onEdit} />
          </View>
        )}
      </View>
      {imageAttachment || formik.values.name !== name ? (
        <FormButton onPress={formik.handleSubmit}>
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#FFFFFF" }}>Save</Text>
        </FormButton>
      ) : (
        <FormButton opacity={0.5} onPress={null}>
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#FFFFFF" }}>Save</Text>
        </FormButton>
      )}
    </View>
  );
};

export default EditGroupProfileForm;

const styles = StyleSheet.create({
  editPicture: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#C6C9CC",
    shadowOffset: 0,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
});
