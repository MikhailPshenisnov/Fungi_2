import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EncyclopediaList from './EncyclopediaList';
import { scale } from '../utils/scale';

import { mushrooms } from '../data/mushrooms';
import { mushroomImages } from '../data/images';

const HISTORY_KEY = 'SEARCH_HISTORY';

const EncyclopediaScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState([]);

 
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.log('Ошибка загрузки истории', e);
    }
  };

  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.log('Ошибка сохранения истории', e);
    }
  };

  const handleSubmit = () => {
    if (searchText.trim() === '') return;

    const newHistory = [
      searchText,
      ...history.filter(item => item !== searchText),
    ].slice(0, 10);

    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const data = mushrooms.map(item => ({
    ...item,
    imageSource: mushroomImages[item.image]
  }));

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.latyn.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>

      {/* 🔍 Поиск */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>

          {isFocused && (
            <View style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={scale(22)}
                color="#C7A97B"
                onPress={() => {
                  setIsFocused(false);
                  setSearchText('');
                }}
              />
            </View>
          )}

          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск"
              placeholderTextColor="#8F8F8F"
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setIsFocused(true)}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />

            <Ionicons
              name="search"
              size={scale(20)}
              color="#C7A97B"
            />
          </View>

        </View>
      </View>

      {isFocused && searchText === '' ? (
        
        <View>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>История</Text>

            <Text style={styles.clearText} onPress={clearHistory}>
              Очистить
            </Text>
          </View>

          {history.map((item, index) => (
            <Text
              key={index}
              style={styles.historyItem}
              onPress={() => setSearchText(item)}
            >
              {item}
            </Text>
          ))}
        </View>
      ) : (
       
        <EncyclopediaList
          encycdata={filteredData}
          navigation={navigation}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(16),
  },
  backButton: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(16), 

    backgroundColor: '#FFF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: scale(8),
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

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInputWrapper: {
    backgroundColor: '#FFF',
    borderRadius: scale(18),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    height: scale(44),
    flex: 1,
  },

  searchInput: {
    flex: 1,
    fontSize: scale(16),
    fontFamily: 'Raleway-Medium',
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10),
  },

  historyTitle: {
    fontSize: scale(18),
    fontFamily: 'Raleway-Bold',
  },

  clearText: {
    color: '#C7A97B',
  },

  historyItem: {
    fontSize: scale(16),
    paddingVertical: scale(6),
    fontFamily: 'Raleway-Medium',
  },

});

export default EncyclopediaScreen;