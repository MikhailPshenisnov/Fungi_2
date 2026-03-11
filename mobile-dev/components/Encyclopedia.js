import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { scale } from '../utils/scale';

const Encyclopedia = ({
  type,
  title,
  latyn,
  description,
  imageSource,
  DontEat,
  RedBook,
  navigation
}) => {

  const dontEatIcon = require('../assets/image/Encyclopedia/donteat.svg');
  const redBookIcon = require('../assets/image/Encyclopedia/redbook.svg');

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

      <View style={styles.imageWrapper}>

        <Image source={imageSource} style={styles.image} />

        {DontEat && (
          <Image source={dontEatIcon} style={styles.badgeLeft} />
        )}

        {!RedBook && (
          <Image source={redBookIcon} style={styles.badgeRight} />
        )}

      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.latyn}>{latyn}</Text>
      </View>

    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({

  card: {

    width: scale(172),
    height: scale(230),

    backgroundColor: '#FFF',
    borderRadius: scale(16),

    marginBottom: scale(14),

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    elevation: 8,

    overflow: 'hidden',
  },
  
  imageWrapper: {
  position: 'relative',
},

  badgeLeft: {
    position: 'absolute',
    bottom: scale(8),
    left: scale(8),

    width: scale(36),
    height: scale(23),

    resizeMode: 'contain',
  },

  badgeRight: {
    position: 'absolute',
    bottom: scale(8),
    left: scale(48),

    width: scale(36),
    height: scale(23),

    resizeMode: 'contain',
  },

  image: {

    width: scale(172),
    height: scale(140),

  },

  textContainer: {

    paddingHorizontal: scale(12),
    paddingTop: scale(10),

  },

  title: {

    fontSize: scale(16),
    lineHeight: scale(20),

    fontFamily: 'Raleway-SemiBold',

    color: '#333',

  },

  latyn: {

    marginTop: scale(4),

    fontSize: scale(14),
    lineHeight: scale(20),

    fontFamily: 'Raleway-Medium',

    color: '#333',
    opacity: 0.6,

  },

});

export default Encyclopedia;