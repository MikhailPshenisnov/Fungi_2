import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_SCREEN_PADDING } from './CustomTabBar';

const { width: screenWidth } = Dimensions.get('window');
const heroImageHeight = Math.max(250, Math.min(360, screenWidth * 0.86));

const FungiDetails = ({ route }) => {
  const { mushroom } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: TAB_BAR_SCREEN_PADDING + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <Image source={mushroom.imageSource} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{mushroom.title}</Text>
        <Text style={styles.subtitle}>{mushroom.latyn}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.descriptionText}>{mushroom.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Характеристики</Text>
          <Text style={styles.infoText}>Семейство: {mushroom.type}</Text>
          <Text style={styles.infoText}>Съедобность: съедобный гриб</Text>
          <Text style={styles.infoText}>Сезон: лето - осень</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  image: {
    width: '100%',
    height: heroImageHeight,
    resizeMode: 'cover',
  },
  content: {
    padding: 18,
  },
  title: {
    fontFamily: 'Raleway-Bold',
    fontSize: 26,
    lineHeight: 30,
    color: '#2D2D2D',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Raleway-Regular',
    fontSize: 15,
    lineHeight: 20,
    color: '#8B8B8B',
    fontStyle: 'italic',
    marginBottom: 18,
  },
  section: {
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 18,
    color: '#2D2D2D',
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: 'Raleway-Regular',
    color: '#4B4B4B',
    fontSize: 15,
    lineHeight: 22,
  },
  infoText: {
    fontFamily: 'Raleway-Regular',
    color: '#4B4B4B',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
});

export default FungiDetails;
