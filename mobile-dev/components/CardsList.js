import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Card from './Card';

const CardsList = ({ cardsdata, bottomInset = 0 }) => {
  return (
    <View style={styles.cardContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomInset }]}
      >
        {cardsdata.map((item, index) => (
          <Card key={index} title={item.title} imageSource={item.imageSource} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#000',
    paddingBottom: 16,
  },
});

export default CardsList;
