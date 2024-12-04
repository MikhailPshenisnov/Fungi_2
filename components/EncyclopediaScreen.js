import React from 'react';
import { View, StyleSheet } from 'react-native';
import EncyclopediaList from './EncyclopediaList';

const data = [
  { type: 'Болетовые (Boletaceae)', 
    title: 'Подосиновик желто-бурый', 
    description: 'Léccinum versipélle',
    imageSource: require('../assets/image/podosinovik.jpg') },

  { type: 'Болетовые (Boletaceae)',
    title: 'Белый гриб', 
    description: 'Boletus edulis', 
    imageSource: require('../assets/image/white.jpg') },

  { type: 'Лисичковые',
    title: 'Лисичка обыкновенная', 
    description: 'Cantharellus cibarius', 
    imageSource: require('../assets/image/fox.jpg') },

  { type: 'Шампиньоновые',
    title: 'Шампиньон полевой', 
    description: 'Agaricus campestris', 
    imageSource: require('../assets/image/shampinon.jpg') },
];

const EncyclopediaScreen = () => {
  return (
    <View style={styles.container}>
      <EncyclopediaList cardsdata={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default EncyclopediaScreen;
