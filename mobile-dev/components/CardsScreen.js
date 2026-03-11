import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CardsList from './CardsList';
import { TAB_BAR_SCREEN_PADDING } from './CustomTabBar';

const data = [
  {
    title: 'Как избежать опасных и ядовитых грибов',
    imageSource: require('../assets/image/card.png')
  },
  {
    title: 'Трюфели в твоем регионе: секреты поиска',
    imageSource: require('../assets/image/card.png')
  },
  {
    title: 'Советы по хранению засолке грибов',
    imageSource: require('../assets/image/card.png')
  },
  {
    title: 'Редкие и необычные грибы леса',
    imageSource: require('../assets/image/card.png')
  },
];

const CardsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      <CardsList cardsdata={filteredData} bottomInset={TAB_BAR_SCREEN_PADDING + insets.bottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchInput: {
    backgroundColor: '#573737',
    borderRadius: 5,
    padding: 10,
    color: '#fff',
    marginBottom: 10,
  },
});

export default CardsScreen;
