import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Encyclopedia = ({ type, title, latyn, description, imageSource, navigation }) => {
    const handlePress = () => {
        navigation.navigate('FungiDetails', { 
            mushroom: {
                type,
                title, 
                latyn,
                description,
                imageSource
            }
        });
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.type}>{type}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.latyn}>{latyn}</Text>
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
  card: {
    backgroundColor: '#452929',
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'stretch', 
    marginVertical: 10,
    minHeight: 150, 
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 15, 
    justifyContent: 'center', 
  },
  type: {
    fontSize: 13,
    color: '#c79078',
    fontWeight: 'bold',
    paddingBottom: 8, 
  },
  title: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 8, 
  },
  latyn: {
    fontSize: 12, 
    color: '#9A796E',
    marginVertical: 3, 
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8, 
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  image: {
    width: 100, 
    height: '100%',
    borderTopRightRadius: 23,
    borderBottomRightRadius: 23,
  },
});

export default Encyclopedia;