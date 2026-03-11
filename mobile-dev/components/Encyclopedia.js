import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Encyclopedia = ({ title, latyn, imageSource, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.92}>
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.latyn} numberOfLines={1}>
          {latyn}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    maxWidth: 160,
    minWidth: 140,
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },

  imageWrapper: {
    width: '100%',
    height: 120,
    backgroundColor: '#E9E9E9',
    overflow: 'hidden',
  },

  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },

  cardContent: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    minHeight: 62,
  },

  title: {
    fontFamily: 'Raleway-Bold',
    fontSize: 15,
    lineHeight: 18,
    color: '#2D2D2D',
    marginBottom: 4,
  },

  latyn: {
    fontFamily: 'Raleway-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#8B8B8B',
    fontStyle: 'italic',
  },
});

export default Encyclopedia;