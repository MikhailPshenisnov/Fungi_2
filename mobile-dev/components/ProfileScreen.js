import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, SafeAreaView } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView 
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
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

        {/* Контейнер для кнопок */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Registration")}
          >
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>
        </View>
        
        {/* Дополнительное пространство внизу для прокрутки */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
  },
  
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
    width: screenWidth * 0.9,
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
    width: screenWidth * 0.9,
    marginTop: 20,
  },

  description: {
    width: screenWidth * 0.9,
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
    opacity: 0.8,
  },
  
  descriptionRegular: {
    fontFamily: "Raleway-Medium", 
    fontSize: 12,
    color: "#323142",
    letterSpacing: 0.2,
    lineHeight: 18,
    opacity: 0.8,
  },
  
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  primaryButton: {
    width: "100%",
    height: 63,
    borderRadius: 16,
    backgroundColor: "#FFE8C4",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  secondaryButton: {
    width: "100%",
    height: 63,
    borderRadius: 16,
    backgroundColor: "#FFE8C4",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  
  bottomSpace: {
    height: 200, // Большое пространство внизу для прокрутки
  },
});