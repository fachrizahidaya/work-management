import { Pressable, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const ContactDescription = ({ isLoading, navigation, name, image, email, concatenatedNames, params, type }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Pressable onPress={() => !isLoading && navigation.navigate("Chat List")}>
        <MaterialIcons name="chevron-left" size={20} color="#3F434A" />
      </Pressable>

      <Pressable onPress={() => navigation.navigate("User Detail", params)} style={{ flexDirection: "row", gap: 10 }}>
        <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />

        <View>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>{name?.length > 30 ? name?.split(" ")[0] : name}</Text>
          {type === "personal" ? (
            <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>{email}</Text>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    {
                      fontSize: 10,
                      width: 200,
                      overflow: "hidden",
                    },
                    TextProps,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {concatenatedNames}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default ContactDescription;
