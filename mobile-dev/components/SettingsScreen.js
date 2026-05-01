import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_SCREEN_PADDING } from "./CustomTabBar";

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + 12,
          paddingBottom: TAB_BAR_SCREEN_PADDING + insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Настройки</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>Уведомления</Text>
          <Text style={styles.cardSubtitle}>Получать уведомления</Text>
        </View>

        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "#DADADA", true: "#E8C397" }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.cardColumn}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Данные и память</Text>
          <Text style={styles.storageText}>3,8 гб / 5 гб</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.cardSubtitle}>Очистить кэш</Text>
      </View>

      <View style={styles.cardColumn}>
        <Text style={styles.cardTitle}>О приложении</Text>
        <Text style={styles.cardSubtitle}>Версия: 1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },

  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
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
    fontFamily: "Raleway-Bold",
    fontSize: 24,
    color: "#323142",
  },

  headerSpacer: {
    width: 36,
  },

  card: {
    minHeight: 64,
    borderRadius: 14,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardColumn: {
    borderRadius: 14,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontFamily: "Raleway-Bold",
    fontSize: 16,
    color: "#323142",
  },

  cardSubtitle: {
    marginTop: 4,
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#828282",
  },

  storageText: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#323142",
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DADADA",
    overflow: "hidden",
    marginTop: 8,
  },

  progressFill: {
    width: "62%",
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#E8C397",
  },
});