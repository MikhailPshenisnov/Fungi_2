import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import CardsList from './components/CardsList';
import EncyclopediaList from './components/EncyclopediaList';
import ProfileScreen from './components/ProfileScreen';

const data = [
  { title: 'Как избежать опасных и ядовитых грибов', imageSource: require('./assets/image/card.png') },
  { title: 'Трюфели в твоем регионе: секреты поиска', imageSource: require('./assets/image/card.png') },
  { title: 'Советы по хранению засолке грибов', imageSource: require('./assets/image/card.png') },
  { title: 'Редкие и необычные грибы леса', imageSource: require('./assets/image/card.png') },
];

const encycdata = [
  { type: 'Болетовые (Boletaceae)', 
    title: 'Подосиновик желто-бурый', 
    description: 'Léccinum versipélle',
    imageSource: require('./assets/image/podosinovik.jpg') },

  { type: 'Болетовые (Boletaceae)',
    title: 'Белый гриб', 
    description: 'Boletus edulis', 
    imageSource: require('./assets/image/white.jpg') },

  { type: 'Лисичковые',
    title: 'Лисичка обыкновенная', 
    description: 'Cantharellus cibarius', 
    imageSource: require('./assets/image/fox.jpg') },

  { type: 'Шампиньоновые',
    title: 'Шампиньон полевой', 
    description: 'Agaricus campestris', 
    imageSource: require('./assets/image/shampinon.jpg') },
];

const App = () => {
  const [activeScreen, setActiveScreen] = useState('Карточки');
  const [searchText, setSearchText] = useState('');

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredEncycData = encycdata.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Энциклопедия':
        return <EncyclopediaList encycdata={filteredEncycData} />;
      case 'Карточки':
        return <CardsList cardsdata={filteredData} />;
      case 'Профиль':
        return <ProfileScreen/>;
      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    switch (activeScreen) {
      case 'Энциклопедия':
        return 'Энциклопедия';
      case 'Карточки':
        return 'Публикации';
      case 'Профиль':
        return 'Профиль';
      default:
        return '';
    }
  };

  const getIconSource = (screen) => {
    if (screen === 'Энциклопедия') {
      return activeScreen === 'Энциклопедия'
        ? require('./assets/image/encyclopedia2.png')
        : require('./assets/image/encyclopedia.png');
    } else if (screen === 'Карточки') {
      return activeScreen === 'Карточки'
        ? require('./assets/image/cards2.png')
        : require('./assets/image/cards.png');
    } else if (screen === 'Профиль') {
      return activeScreen === 'Профиль'
        ? require('./assets/image/profile2.png')
        : require('./assets/image/profile.png');
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{getHeaderTitle()}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск..."
          value={searchText}
          onChangeText={setSearchText}
        />
        
      </View>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveScreen('Энциклопедия')}
        >
          <Image
            source={getIconSource('Энциклопедия')}
            style={[styles.tabIcon, activeScreen === 'Энциклопедия' && styles.activeTabIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveScreen('Карточки')}
        >
          <Image
            source={getIconSource('Карточки')}
            style={[styles.tabIcon, activeScreen === 'Карточки' && styles.activeTabIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveScreen('Профиль')}
        >
          <Image
            source={getIconSource('Профиль')}
            style={[styles.tabIcon, activeScreen === 'Профиль' && styles.activeTabIcon]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flex: 0.20, // 20% от высоты экрана
    backgroundColor: '#452929',
    paddingTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#573737',
    borderRadius: 5,
    padding: 10,
    width: '90%', // 90% от ширины экрана
    color: '#fff',
    marginTop: 10,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#452929',
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: '#452929', // Изменен цвет верхней границы
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    backgroundColor: '#452929',
    width: 35,
    height: 35,
    },
});

export default App;
