import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';

export default function ErrorScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Путь к картинке. Убедись, что файл sad_mushroom.png лежит в папке assets */}
        <Image 
          source={require('../assets/sad_mushroom.png')} 
          style={styles.image} 
          resizeMode="contain" 
        />
        
        <Text style={styles.title}>Не смогли загрузить</Text>
        <Text style={styles.subtitle}>Обновите или попробуйте позже</Text>

        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          onPress={() => {
            // Здесь будет логика перезагрузки, а пока просто возвращаемся назад
            if(navigation.canGoBack()) navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>ОБНОВИТЬ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    // Отступ снизу, чтобы контент не перекрывался твоим CustomTabBar
    paddingBottom: 100, 
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Raleway-Bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Raleway-Regular',
    color: '#888888',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FBE4C4', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontFamily: 'Raleway-Semibold',
    fontSize: 16,
    textTransform: 'uppercase',
  }
});
