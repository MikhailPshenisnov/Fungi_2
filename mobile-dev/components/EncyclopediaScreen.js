import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EncyclopediaList from './EncyclopediaList';
import { scale } from '../utils/scale';

import { mushrooms } from '../data/mushrooms';
import { mushroomImages } from '../data/images';

const EncyclopediaScreen = ({ navigation }) => {

  const [searchText, setSearchText] = useState('');

  // соединяем данные и изображения
  const data = mushrooms.map(item => ({
    ...item,
    imageSource: mushroomImages[item.image]
  }));

  // поиск
  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.latyn.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>

          <TextInput
            style={styles.searchInput}
            placeholder="Поиск"
            placeholderTextColor="#8F8F8F"
            value={searchText}
            onChangeText={setSearchText}
          />

          <Ionicons
            name="search"
            size={scale(20)}
            color="#C7A97B"
          />

        </View>
      </View>

      <EncyclopediaList
        encycdata={filteredData}
        navigation={navigation}
      />

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(16),
  },

  searchContainer: {
    backgroundColor: '#FFE8C4',
    padding: scale(10),

    borderBottomLeftRadius: scale(22),
    borderBottomRightRadius: scale(22),

    marginBottom: scale(15),

    marginLeft: -scale(16),
    marginRight: -scale(16),

    paddingHorizontal: scale(16),
  },

  searchInputWrapper: {
    backgroundColor: '#FFF',
    borderRadius: scale(18),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    height: scale(44),
  },

  searchInput: {
    flex: 1,
    fontSize: scale(16),
    fontFamily: 'Raleway-Medium',
  },

});

export default EncyclopediaScreen;