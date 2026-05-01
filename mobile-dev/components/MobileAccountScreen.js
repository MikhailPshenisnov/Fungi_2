import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_SCREEN_PADDING } from "./CustomTabBar";

export default function MobileAccountScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 8,
            paddingBottom: TAB_BAR_SCREEN_PADDING + insets.bottom,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Профиль</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.avatarBlock}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require("../assets/3d_avatar_24.png")}
              style={styles.avatar}
              resizeMode="cover"
            />

            <TouchableOpacity style={styles.cameraButton}>
              <Image
                source={require("../assets/IconCamera.png")}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>Леонид Лесовик</Text>
          <Text style={styles.email}>example@example.su</Text>
        </View>

        <Text style={styles.blockTitle}>Личные данные</Text>

        <Text style={styles.label}>Имя</Text>
        <InfoRow
          icon={require("../assets/IconUser.png")}
          text="Леонид Лесовик"
          actionIcon={require("../assets/iconPen.png")}
        />

        <Text style={styles.label}>Email</Text>
        <InfoRow
          icon={require("../assets/IconEmail.png")}
          text="example@example.su"
        />

        <Text style={styles.blockTitle}>Безопасность</Text>

        <Text style={styles.label}>Пароль</Text>
        <InfoRow
          icon={require("../assets/IconLock.png")}
          text="********"
        />
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, text, actionIcon }) {
  return (
    <View style={styles.infoRow}>
      <Image source={icon} style={styles.infoIcon} resizeMode="contain" />

      <Text style={styles.infoText}>{text}</Text>

      {!!actionIcon && (
        <TouchableOpacity style={styles.actionButton}>
          <Image source={actionIcon} style={styles.actionIcon} resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    paddingHorizontal: 20,
  },

  header: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },

  backText: {
    fontSize: 38,
    lineHeight: 38,
    color: "#323142",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Raleway-SemiBold",
    fontSize: 16,
    color: "#323142",
  },

  headerSpacer: {
    width: 36,
  },

  avatarBlock: {
    alignItems: "center",
    marginBottom: 26,
  },

  avatarWrapper: {
    width: 132,
    height: 132,
    borderRadius: 66,
    position: "relative",
    marginBottom: 12,
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 66,
  },

  cameraButton: {
    position: "absolute",
    right: -2,
    bottom: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFE8C4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  cameraIcon: {
    width: 20,
    height: 20,
  },

  name: {
    fontFamily: "Raleway-Bold",
    fontSize: 18,
    color: "#323142",
    marginBottom: 4,
  },

  email: {
    fontFamily: "Raleway-Regular",
    fontSize: 16,
    color: "#828282",
  },

  blockTitle: {
    fontFamily: "Raleway-Bold",
    fontSize: 24,
    color: "#323142",
    marginBottom: 12,
  },

  label: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#828282",
    marginBottom: 6,
  },

  infoRow: {
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  infoIcon: {
    width: 22,
    height: 22,
    marginRight: 14,
    tintColor: "#B8B8C4",
  },

  infoText: {
    flex: 1,
    fontFamily: "Raleway-SemiBold",
    fontSize: 16,
    color: "#323142",
  },

  actionButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  actionIcon: {
    width: 20,
    height: 20,
    tintColor: "#323142",
  },
});