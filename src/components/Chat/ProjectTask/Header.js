import React from "react";
import dayjs from "dayjs";

import { Pressable, Text, View } from "react-native";
import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TextProps } from "../../shared/CustomStylings";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const Header = ({ navigation, title, deadline, owner_name, owner_image, type }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Pressable
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <MateriaCommunitylIcons name="chevron-left" size={20} color="#3F434A" />
          </Pressable>
          <MateriaCommunitylIcons name="circle-slice-2" size={25} color="#3F434A" />
          <View>
            <Text
              style={[
                {
                  fontSize: 14,
                  fontWeight: "500",
                },
                TextProps,
              ]}
            >
              {title?.length > 20 ? title.slice(0, 20) + "..." : title}
            </Text>
            <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>
              Due {dayjs(deadline).format("DD MMMM YYYY")}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            justifyContent: "flex-end",
          }}
        >
          <Text style={[{ fontSize: 10 }, TextProps]}>{type === "project" ? "Created by" : "Assigned to"}</Text>
          <AvatarPlaceholder name={owner_name} image={owner_image} />
          <Text style={[{ fontSize: 10 }, TextProps]}>{owner_name?.split(" ")[0]}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
