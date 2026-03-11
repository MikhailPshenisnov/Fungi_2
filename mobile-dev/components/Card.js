import React from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';

const Card = ({ title, imageSource }) => {
  const handlePress = () => {
    Alert.alert("Карточка нажата", String(title));
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.9}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Image source={imageSource} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#452929',
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: 2,
    marginVertical: 10,
    minHeight: 150,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 24,
    flexShrink: 1,
  },
  description: {
    fontSize: 14,
    color: '#fff',
  },
  image: {
    width: '42%',
    minWidth: 120,
    maxWidth: 160,
    height: '100%',
    borderTopRightRadius: 23,
    borderBottomRightRadius: 23,
  },
});

export default Card;
