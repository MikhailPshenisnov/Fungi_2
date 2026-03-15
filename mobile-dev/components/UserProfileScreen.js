import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function UserProfileScreen({ navigation }) {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

            {/* НАВИГАТОРБАР */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                <View style={{ width: 24 }}></View>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.profile}>Профиль</Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={require("../assets/IconSettings.png")}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* АВАТАРКА С КНОПКОЙ КАМЕРЫ */}
            <View style={styles.avatarContainer}>
                <Image
                source={require("../assets/3d_avatar_24.png")} // Замените на путь к вашему изображению аватарки
                style={styles.avatar}
                resizeMode="cover"
                />
                <TouchableOpacity style={styles.cameraButton}>
                <Image
                    source={require("../assets/IconCamera.png")} // Замените на путь к вашему изображению иконки камеры
                    style={styles.cameraIcon}
                    resizeMode="contain"
                />
                </TouchableOpacity>
            </View>

            {/* Имя Почта */}
            <View style={{ alignItems: "center" }}>
                <Text style={styles.mainName}>Леонид Лесовик</Text>
                <Text style={styles.mainEmail}>examle@example.su</Text>
            </View>

            {/* ЛИЧНЫЕ ДАННЫЕ */}
            <View>
                <Text style={styles.title}>Личные данные</Text>

                {/* ИМЯ */}
                <Text style={styles.section}>Имя</Text>
                <View style={styles.infoBlock}>
                    <Image
                        source={require("../assets/IconUser.png")}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                    <Text style={styles.info}>Леонид Лесовик</Text>
                    <TouchableOpacity style={{ marginLeft: "auto" }}>
                        <Image
                            source={require("../assets/iconPen.png")}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/*EMAIL*/}
                <Text style={styles.section}>Email</Text>
                <View style={styles.infoBlock}>
                    <Image
                        source={require("../assets/IconEmail.png")}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                    <Text style={styles.info}>examle@example.su</Text>
                    <TouchableOpacity style={{ marginLeft: "auto" }}>
                        <Image
                            source={require("../assets/iconPen.png")}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* БЕЗОПАСТНОСТЬ */}
            <View>
                <Text style={styles.title}>Безопастность</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.section}>Пароль</Text>
                    <Text style={styles.section}>изменён 17.11.2025</Text>
                </View>

                <View style={styles.infoBlock}>
                    <Image
                        source={require("../assets/IconLock.png")}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                    <Text style={styles.info}>********</Text>
                    <TouchableOpacity 
                        style={{ marginLeft: "auto" }}>
                        <Text style={styles.bottomLink}>Изменить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
    fontFamily: "Raleway-Bold",
    fontWeight: "700",
    color: "#323142",
    fontSize: 24,
    textAlign: "left",
    lineHeight: 26,
    width: 353,
    marginTop: 20,
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
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
  },
  info: {
    fontFamily: "Raleway-SemiBold",
    color: "#323142",
    fontSize: 18
  },
  bottomLink: {
    fontFamily: "Raleway-SemiBold",
    color: "#B28550",
    fontSize: 18,
  },
  mainName: {
    fontFamily: "Raleway-Bold",
    color: "#323142",
    fontSize: 20,
    marginBottom: 5
  },
  mainEmail: {
    fontFamily: "Raleway-SemiBold",
    color: "#828282",
    fontSize: 18,
    marginBottom: 20
  },
  profile: {
    fontFamily: "Raleway-SemiBold",
    color: "#323142",
    fontSize: 16
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  avatar: {
    width: 157, // Размер аватарки
    height: 157,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: 30,
    backgroundColor: "#FFE8C4",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    width: 24,
    height: 24,
  },
});