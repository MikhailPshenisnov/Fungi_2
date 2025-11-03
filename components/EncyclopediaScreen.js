import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import EncyclopediaList from './EncyclopediaList';

// Данные для энциклопедии 
const data = [

  { type: 'Болетовые (Boletaceae)',
    title: 'Белый гриб', 
    description: 'Boletus edulis', 
    imageSource: require('./../assets/image/white.jpg') },

  { type: 'Лисичковые',
    title: 'Лисичка обыкновенная', 
    description: 'Cantharellus cibarius', 
    imageSource: require('./../assets/image/fox.jpg') },

  { type: 'Шампиньоновые',
    title: 'Шампиньон полевой', 
    description: 'Agaricus campestris', 
    imageSource: require('./../assets/image/shampinon.jpg') },
];

const EncyclopediaScreen = () => {
  // Добавляем состояние для поиска
  const [searchText, setSearchText] = useState('');

  // Фильтрация данных
  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🔎 Добавляем поле поиска */}
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />
      
      {}
      <EncyclopediaList encycdata={filteredData} /> {}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10, 
  },
  searchInput: {
    backgroundColor: '#573737',
    borderRadius: 5,
    padding: 10,
    color: '#fff',
    marginBottom: 10,
  },
});

export default EncyclopediaScreen;