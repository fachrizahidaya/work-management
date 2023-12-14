import React from "react";

import { Image, TouchableOpacity, View, Text } from "react-native";

import { useDisclosure } from "../../hooks/useDisclosure";
import UserPreviewModal from "./UserPreviewModal";

const AvatarPlaceholder = ({ image, name, email, size, borderRadius, isThumb = true, isPressable, style }) => {
  const { isOpen, toggle } = useDisclosure(false);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  const userInitialGenerator = () => {
    const nameArray = name?.split(" ");
    let alias = "";

    if (nameArray?.length >= 2) {
      alias = nameArray[0][0] + nameArray[1][0];
    } else {
      alias = nameArray[0][0];
    }

    return alias;
  };

  return (
    <>
      {image ? (
        <>
          {isPressable ? (
            <TouchableOpacity onPress={() => isPressable && toggle()} style={style}>
              <Image
                source={{
                  uri: isThumb
                    ? `${process.env.EXPO_PUBLIC_API}/image/${image}/thumb`
                    : `${process.env.EXPO_PUBLIC_API}/image/${image}`,
                }}
                style={{
                  width: size === "xs" ? 20 : size === "sm" ? 22 : size === "md" ? 24 : 26,
                  height: size === "xs" ? 20 : size === "sm" ? 22 : size === "md" ? 24 : 26,
                  resizeMode: "contain",
                  backgroundColor: "transparent",
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={{
                uri: isThumb
                  ? `${process.env.EXPO_PUBLIC_API}/image/${image}/thumb`
                  : `${process.env.EXPO_PUBLIC_API}/image/${image}`,
              }}
              size={size || "xs"}
              bg="transparent"
              style={[
                style,
                {
                  width: size === "xs" ? 20 : size === "sm" ? 22 : size === "md" ? 24 : 26,
                  height: size === "xs" ? 20 : size === "sm" ? 22 : size === "md" ? 24 : 26,
                  resizeMode: "contain",
                  backgroundColor: "transparent",
                  borderRadius: 50,
                },
              ]}
            />
          )}
        </>
      ) : (
        <>
          {isPressable ? (
            <TouchableOpacity onPress={() => isPressable && toggle()} style={style}>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: size === "xs" ? 20 : size === "sm" ? 22 : size === "md" ? 24 : 26,
                  backgroundColor: stringToColor(name),
                  borderRadius: borderRadius,
                }}
              >
                <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
                  {name ? userInitialGenerator() : "KSS"}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                style,
                {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: size === "xs" ? 20 : size === "sm" ? 22 : size === "md" ? 24 : 26,
                  backgroundColor: stringToColor(name),
                  borderRadius: borderRadius,
                },
              ]}
            >
              <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
                {name ? userInitialGenerator() : "KSS"}
              </Text>
            </View>
          )}
        </>
      )}

      {/* {isOpen && (
        <UserPreviewModal
          isOpen={isOpen}
          onClose={toggle}
          name={name}
          image={image}
          email={email}
          stringToColor={stringToColor}
          userInitialGenerator={userInitialGenerator}
        />
      )} */}
    </>
  );
};

export default AvatarPlaceholder;
