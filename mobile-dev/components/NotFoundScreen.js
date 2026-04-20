import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, TextInput, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function NotFoundScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Кастомный желтый хэдер */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#D2B48C" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Поиск"
            placeholderTextColor="#D2B48C"
          />
          <Feather name="search" size={20} color="#D2B48C" style={styles.searchIcon} />
        </View>
      </View>

      <View style={styles.content}>
        <Image 
          source={require('../assets/sad_mushroom.png')} 
          style={styles.image} 
          resizeMode="contain" 
        />
        
        <Text style={styles.title}>Ничего не нашлось</Text>
        <Text style={styles.subtitle}>Попробуйте найти что-нибудь другое</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBE4C4', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FBE4C4',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Raleway-Regular',
    color: '#333',
    paddingVertical: 0,
  },
  searchIcon: {
    marginLeft: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  }
});
