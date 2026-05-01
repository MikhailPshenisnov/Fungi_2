import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_SCREEN_PADDING } from "./CustomTabBar";

export default function UserProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Профиль</Text>

          <TouchableOpacity style={styles.headerIconButton}>
            <Image
              source={require("../assets/IconSettings.png")}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileBlock}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require("../assets/3d_avatar_24.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.name}>Леонид Лесовик</Text>
          <Text style={styles.email}>example@example.su</Text>
        </View>

        <MenuItem
          title="Мой профиль"
          icon={require("../assets/List.png")}
          onPress={() => navigation.navigate("MobileAccount")}
        />

        <Text style={styles.sectionTitle}>Контент</Text>

        <MenuItem
          title="Избранное"
          subtitle="Сохраняйте статьи, рецепты и заметки, чтобы вернуться позже."
          icon={require("../assets/Heart.png")}
          onPress={() => {}}
        />

        <MenuItem
          title="Стать автором"
          icon={require("../assets/UserPlus.png")}
          variant="accent"
          onPress={() => {}}
        />

        <Text style={styles.sectionTitle}>Система</Text>

        <MenuItem
          title="Настройки"
          icon={require("../assets/IconSettings.png")}
          onPress={() => navigation.navigate("Settings")}
        />

        <MenuItem
          title="О приложении"
          icon={require("../assets/Info.png")}
          onPress={() => {}}
        />

        <MenuItem
          title="Удалить аккаунт"
          icon={require("../assets/Trash.png")}
          variant="danger"
          onPress={() => setDeleteModalVisible(true)}
        />
      </ScrollView>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>

            <View style={styles.warningCircle}>
              <Text style={styles.warningText}>!</Text>
            </View>

            <Text style={styles.modalTitle}>
              Вы уверены, что хотите удалить аккаунт?
            </Text>

            <Text style={styles.modalSubtitle}>
              Восстановить будет нельзя
            </Text>

            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>УДАЛИТЬ АККАУНТ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>ОТМЕНИТЬ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MenuItem({ title, subtitle, icon, variant = "default", onPress }) {
  const isAccent = variant === "accent";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.menuItem,
        isAccent && styles.menuItemAccent,
        isDanger && styles.menuItemDanger,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuTextBlock}>
        <Text style={styles.menuTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>

      <Image
        source={icon}
        style={[
          styles.menuIcon,
          isAccent && styles.menuIconAccent,
          isDanger && styles.menuIconDanger,
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    paddingHorizontal: 16,
  },

  header: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  headerSpacer: {
    width: 32,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Raleway-SemiBold",
    fontSize: 16,
    color: "#323142",
  },

  headerIconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  headerIcon: {
    width: 20,
    height: 20,
    tintColor: "#323142",
  },

  profileBlock: {
    alignItems: "center",
    marginBottom: 18,
  },

  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    overflow: "hidden",
    marginBottom: 10,
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontFamily: "Raleway-Bold",
    fontSize: 18,
    color: "#323142",
    marginBottom: 4,
  },

  email: {
    fontFamily: "Raleway-Regular",
    fontSize: 15,
    color: "#828282",
  },

  sectionTitle: {
    fontFamily: "Raleway-Medium",
    fontSize: 16,
    color: "#323142",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },

  menuItem: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  menuItemAccent: {
    backgroundColor: "#FFE8C4",
  },

  menuItemDanger: {
    backgroundColor: "#FFC8BE",
  },

  menuTextBlock: {
    flex: 1,
    paddingRight: 10,
  },

  menuTitle: {
    fontFamily: "Raleway-Bold",
    fontSize: 16,
    color: "#323142",
  },

  menuSubtitle: {
    marginTop: 3,
    fontFamily: "Raleway-Regular",
    fontSize: 11,
    lineHeight: 14,
    color: "#828282",
  },

  menuIcon: {
    width: 24,
    height: 24,
    tintColor: "#A8A8B5",
  },

  menuIconAccent: {
    tintColor: "#B28550",
  },

  menuIconDanger: {
    tintColor: "#D41414",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(50, 49, 66, 0.35)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 36,
    paddingBottom: 24,
    alignItems: "center",
  },

  modalCloseButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
  },

  modalCloseText: {
    fontSize: 22,
    color: "#323142",
    marginTop: -2,
  },

  warningCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFE3DF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  warningText: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FF3B30",
    color: "#FF3B30",
    textAlign: "center",
    lineHeight: 27,
    fontFamily: "Raleway-Bold",
    fontSize: 22,
  },

  modalTitle: {
    maxWidth: 280,
    textAlign: "center",
    fontFamily: "Raleway-Bold",
    fontSize: 18,
    lineHeight: 22,
    color: "#323142",
    marginBottom: 6,
  },

  modalSubtitle: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#A0A0A0",
    marginBottom: 24,
  },

  deleteButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: "#FFC8BE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 3,
  },

  deleteButtonText: {
    fontFamily: "Raleway-Bold",
    fontSize: 13,
    color: "#323142",
  },

  cancelButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: "#FFE8C4",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  cancelButtonText: {
    fontFamily: "Raleway-Bold",
    fontSize: 13,
    color: "#323142",
  },
});