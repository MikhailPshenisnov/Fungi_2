import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Card = ({ title, imageSource, isNew, readTime, rating }) => {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>Новое</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.title} numberOfLines={3}>{title}</Text>
        <View style={styles.footer}>
          <Text style={styles.meta}>
            {readTime} {'  '}
            <Text style={styles.star}>★</Text>
            {'  '}{rating}
          </Text>
          <TouchableOpacity onPress={() => setBookmarked(!bookmarked)} style={styles.bookmarkButton}>
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color="#C4A882"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
    aspectRatio: 361 / 279,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 8,
  },
  imageContainer: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  newBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#E8A528',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Raleway-Medium',
    fontSize: 12,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  title: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    fontFamily: 'Raleway-Regular',
    fontSize: 13,
    color: '#888888',
  },
  star: {
    color: '#E8A528',
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5EDD8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Card;
