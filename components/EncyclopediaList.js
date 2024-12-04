import React from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';

const EncyclopediaList = ({ cardsdata }) => {
  const handlePress = (title) => {
    Alert.alert("Карточка нажата", title);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cardsdata.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(item.title)} style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.iconContainer}>
              <Image source={require('../assets/image/icon1.png')} style={styles.icon} />
              <Image source={require('../assets/image/icon2.png')} style={styles.icon} />
            </View>
          </View>
          <Image source={item.imageSource} style={styles.image} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#452929',
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    height: 180,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  type: {
    fontSize: 13,
    color: '#c79078',
    fontWeight: 'bold',
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 15
  },
  description: {
    fontSize: 14,
    color: '#9A796E',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  image: {
    width: '50%',
    height: '100%',
    borderTopRightRadius: 23,
    borderBottomRightRadius: 23,
  },
});

export default EncyclopediaList;
