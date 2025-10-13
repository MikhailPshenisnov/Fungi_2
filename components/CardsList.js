import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Card from './Card'

const CardsList = ({ cardsdata }) => {
    return (
        <View style={styles.cardContainer}>
        <ScrollView>
          <View style={styles.container}>
            {cardsdata.map((item, index) => (
              <Card key={index} title={item.title} imageSource={item.imageSource} />
            ))}
          </View>
        </ScrollView>
      </View>
    );
};
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cardContainer: {
        justifyContent: 'center',
    },
});
  
export default CardsList;