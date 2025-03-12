import React from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';

const EncyclopediaList = ({ type, title, description, imageSource }) => {
    const handlePress = () => {
        Alert.alert("Карточка нажата", title);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.type}>{type}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <View style={styles.iconContainer}>
                    <Image source={require('../assets/image/icon1.png')} style={styles.icon} />
                    <Image source={require('../assets/image/icon2.png')} style={styles.icon} />
                </View>
            </View>
            <Image source={imageSource} style={styles.image} />
        </TouchableOpacity>
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
