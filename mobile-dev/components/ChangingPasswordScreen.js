import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function ChangingPasswordScreen({ navigation }) {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
            {/* НАВИГАТОРБАР */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity>
                    <Image
                        source={require("../assets/Back.png")}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.profile}>Профиль</Text>
                </View>
                <View style={{ width: 26 }}></View>
            </View>

            {/* ИЗМЕНЕНИЕ ПАРОЛЯ */}
            <View style={{ flex: 1, top: "50%" }}>
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.title}>Изменение пароля</Text>
                </View>

                <View>
                    <Text style={styles.section}>Введите Текущий пароль</Text>
                    <View style={styles.infoBlock}>
                        <Image
                            source={require("../assets/IconLock.png")}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                        <Text style={styles.info}>Текущий пароль</Text>
                        <TouchableOpacity
                            style={{ marginLeft: "auto" }}>
                            <Image
                                source={require("../assets/IconEye.png")}
                                style={styles.iconEye}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.section}>Введите Новый пароль</Text>
                    <View style={styles.infoBlock}>
                        <Image
                            source={require("../assets/IconLock.png")}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                        <Text style={styles.info}>Новый пароль</Text>
                        <TouchableOpacity
                            style={{ marginLeft: "auto" }}>
                            <Image
                                source={require("../assets/IconEye.png")}
                                style={styles.iconEye}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                        style={styles.primaryButton}>
                        <Text style={styles.buttonText}>Подтвердить</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
    fontFamily: "Raleway-Bold",
    fontWeight: "700",
    color: "#323142",
    fontSize: 24,
  },
  section: {
    fontFamily: "Raleway-Regular",
    color: "#828282",
    fontSize: 14,
    textAlign: "left",
    marginTop: 20,
    paddingBottom: 5,
  },
  infoBlock: {
    flexDirection: "row",
    height: 64,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  info: {
    fontFamily: "Raleway-SemiBold",
    color: "#C2C3CB",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  primaryButton: {
    width: 353,
    height: 63,
    borderRadius: 16,
    backgroundColor: "#FFE8C4",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    boxShadow: "0px 4px 4px #00000040", 
    elevation: 5,
  },
  buttonText: {
    fontFamily: "Raleway-Bold",
    fontWeight: "700",
    fontSize: 16,
    color: "#323142",
    letterSpacing: 0.5,
    textAlign: "center",
    textTransform: "uppercase",
  },
  profile: {
    fontFamily: "Raleway-SemiBold",
    color: "#323142",
    fontSize: 16
  },
  icon: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
    container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
  },
})