import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function ProfileScreen({ navigation }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Верхний блок */}
      <View style={styles.topBlock}>
        <Image
          source={require("../assets/Hero.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Изучай Грибы С Fungi</Text>

        <Text style={styles.description}>
          <Text style={styles.descriptionBold}>FUNGI</Text>
          <Text style={styles.descriptionRegular}>
            {" "}– электронная энциклопедия о грибах, которая предоставляет
            пользователям информацию о залежах грибов, их приготовлении,
            интересных фактах и многом другом
          </Text>
        </Text>
      </View>

      {/* Кнопки */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Registration")} // Переход на экран регистрации
      >
        <Text style={styles.buttonText}>Зарегистрироваться</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Login")} // Переход на экран входа
      >
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topBlock: {
    width: "100%",
    backgroundColor: "#FFE8C4",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },

  image: {
    width: 353,
    height: 296,
    marginTop: 20,
  },

  title: {
    fontFamily: "Raleway-Bold",
    fontWeight: "700",
    color: "#323142",
    fontSize: 24,
    textAlign: "center",
    lineHeight: 26,
    width: 353,
    marginTop: 20,
  },

  description: {
    width: 353,
    color: "#323142",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 18,
    opacity: 0.8,
  },
  
  descriptionBold: {
    fontFamily: "Raleway-Bold",
    fontSize: 12,
    color: "#323142",
    letterSpacing: 0.2,
    lineHeight: 18,
    color: "#323142",
    opacity: 0.8,
  },
  
  descriptionRegular: {
    fontFamily: "Raleway-Medium", 
    fontSize: 12,
    color: "#323142",
    letterSpacing: 0.2,
    lineHeight: 18,
    color: "#323142",
    opacity: 0.8,
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

  secondaryButton: {
    width: 353,
    height: 63,
    borderRadius: 16,
    backgroundColor: "#FFE8C4",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
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
});
