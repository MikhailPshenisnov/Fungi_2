import React, { useState, useRef } from 'react';
import {
  View, TextInput, StyleSheet, TouchableOpacity,
  Text, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CardsList from './CardsList';

const HEADER_BG = '#FAF3E4';
const SCREEN_BG = '#FFFFFF';

const data = [
  {
    id: '1',
    title: 'Такие лучше не собирать. Биолог Сатаева — о съедобных, но опасных грибах',
    imageSource: require('../assets/image/card.png'),
    isNew: true,
    readTime: '24 мин',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Психоактивные грибы и где они обитают',
    imageSource: require('../assets/image/card.png'),
    isNew: false,
    readTime: '24 мин',
    rating: 4.8,
  },
  {
    id: '3',
    title: 'Как избежать опасных и ядовитых грибов',
    imageSource: require('../assets/image/card.png'),
    isNew: false,
    readTime: '18 мин',
    rating: 4.5,
  },
  {
    id: '4',
    title: 'Трюфели в твоём регионе: секреты поиска',
    imageSource: require('../assets/image/card.png'),
    isNew: false,
    readTime: '30 мин',
    rating: 4.7,
  },
];

const CardsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['Как собирать грибы?', 'Что взять в лес']);
  const inputRef = useRef(null);

  const filteredData = searchText
    ? data.filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()))
    : data;

  const handleFocus = () => setIsSearchActive(true);

  const handleBack = () => {
    setIsSearchActive(false);
    setSearchText('');
    inputRef.current?.blur();
  };

  const handleSubmit = () => {
    const trimmed = searchText.trim();
    if (trimmed && !searchHistory.includes(trimmed)) {
      setSearchHistory(prev => [trimmed, ...prev].slice(0, 10));
    }
  };

  const handleHistoryPress = (item) => {
    setSearchText(item);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Beige header with rounded bottom */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          {isSearchActive && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#888888" />
            </TouchableOpacity>
          )}
          <View style={styles.searchInputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Поиск"
              placeholderTextColor="#AAAAAA"
              value={searchText}
              onChangeText={setSearchText}
              onFocus={handleFocus}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />
            <Ionicons name="search" size={18} color="#AAAAAA" style={styles.searchIcon} />
          </View>
        </View>
      </View>

      {/* History — only when search is active and input is empty */}
      {isSearchActive && !searchText ? (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>История</Text>
            <TouchableOpacity onPress={() => setSearchHistory([])}>
              <Text style={styles.clearText}>Очистить</Text>
            </TouchableOpacity>
          </View>
          {searchHistory.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleHistoryPress(item)} style={styles.historyItem}>
              <Text style={styles.historyItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <CardsList cardsdata={filteredData} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SCREEN_BG,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: HEADER_BG,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontFamily: 'Inter-Regular',
  },
  searchIcon: {
    marginLeft: 6,
  },
  historyContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 18,
    color: '#1A1A1A',
  },
  clearText: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#E8A528',
  },
  historyItem: {
    paddingVertical: 10,
  },
  historyItemText: {
    fontFamily: 'Raleway-Regular',
    fontSize: 15,
    color: '#1A1A1A',
  },
});

export default CardsScreen;
