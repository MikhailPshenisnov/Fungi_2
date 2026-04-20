import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function AboutUsScreen({ navigation }) {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

            {/* НАВИГАТОРБАР */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20, alignItems: "center"}}>
                <TouchableOpacity>
                    <Image
                        source={require("../assets/back_icon.png")}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.ofungi}>О Fungi</Text>
                </View>
                <View style={{ width: 24 }}></View>
            </View>

            <View style={styles.block}>
                <Text style={styles.textAbout}>Fungi - электронная энциклопедия о грибах, которая предоставляет пользователям информацию о залежах грибов, их приготовлении, интересных фактах и многом другом</Text>
            </View>

            <View>
                <TouchableOpacity style={styles.buttons}>
                    <View style={styles.buttonBlock}></View>
                    <Text style={styles.buttonsText}>Политика конфиденциальности</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons}>
                    <View style={styles.buttonBlock}></View>
                    <Text style={styles.buttonsText}>Авторское право</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons}>
                    <View style={styles.buttonBlock}></View>
                    <Text style={styles.buttonsText}>Пользовательское соглашение</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Image
                    source={require("../assets/Hero.png")}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
  },
  ofungi: {
    fontFamily: "Raleway-Bold",
    color: "#323142",
    fontSize: 24
  },
  block: {
    width: "100%",
    backgroundColor: "#FFE8C4",
    borderRadius: 17,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 17,
    paddingLeft: 17,
    alignItems: "center",
    boxShadow: "0px 2px 2px #00000040", 
  },
  textAbout: {
    fontFamily: "Raleway-Regular",
    color: "#323142",
    fontSize: 16,
    includeFontPadding: false,
    lineHeight: 23,
    textAlignVertical: 'center'
  },
  buttonsText: {
    fontFamily: "Raleway-Medium",
    color: "#323142",
    fontSize: 16
  },
  buttonBlock: {
    backgroundColor: "#FFE8C4",
    borderRadius: 25,
    alignItems: "center",
    height: 25,
    width: 8,
    marginRight: 10
  },
  buttons: {
    flexDirection: "row",
    marginTop: 25,
    marginLeft: 10,
    alignItems: "center",
  },
  image: {
    width: 353,
    height: 296,
    marginTop: 30,
  },
});