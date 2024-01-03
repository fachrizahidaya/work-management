import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import Options from "../../../components/Setting/Account/Options";
import Button from "../../../components/shared/Forms/Button";

const AccountScreen = ({ route }) => {
  const { profile } = route.params;

  const userSelector = useSelector((state) => state.auth);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          paddingVertical: 14,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={20} />
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: 500 }}>My</Text>
          <Text style={{ fontSize: 16, fontWeight: 500, color: "#176688" }}>KSS</Text>
          <Text style={{ fontSize: 16, fontWeight: 500 }}>Account</Text>
        </View>
      </View>

      <ScrollView>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            marginVertical: 3,
          }}
        >
          <AvatarPlaceholder
            borderRadius="full"
            size="xl"
            name={userSelector?.name}
            image={userSelector?.image}
            isThumb={false}
          />
          <Text style={{ fontSize: 20, fontWeight: 700 }}>{userSelector?.name}</Text>
          <Text style={{ fontSize: 12, fontWeight: 400 }}>{profile?.data?.email}</Text>
        </View>
        <View
          style={{
            display: "flex",
            backgroundColor: "white",
            padding: 5,
            paddingBottom: 10,
            gap: 33,
          }}
        >
          <Options profile={profile} />

          <Pressable
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FAFAFA",
              borderRadius: 9,
              height: 42,
              paddingVertical: 8,
              paddingHorizontal: 12,
              opacity: 0.5,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#176688" }}>KSS</Text>
                <Text style={{ fontWeight: 400 }}>Drive | </Text>
                <Text style={{ fontWeight: 400, color: "#176688" }}>2 TB</Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontWeight: 400, color: "#176688" }}>Upgrade</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} />
            </View>
          </Pressable>

          <Button onPress={() => navigation.navigate("Log Out")} backgroundColor="#FAFAFA">
            <Text style={{ color: "#FF6262", fontWeight: "bold" }}>Log out</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
