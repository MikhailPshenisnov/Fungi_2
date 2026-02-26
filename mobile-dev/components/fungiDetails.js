import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';


const FungiDetails = ({ route }) => {
  const { mushroom } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>{mushroom.title}</Text>
        <Text style={styles.subtitle}>
          {mushroom.type} - {mushroom.latyn.toLowerCase()}
        </Text>
      </View>

      {/* Изображение */}
      <Image source={mushroom.imageSource} style={styles.image} />

      {/* Описание */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Описание</Text>
        <Text style={styles.descriptionText}>{mushroom.description}</Text>
      </View>

      {/* Дополнительная информация (можно добавить позже) */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Характеристики</Text>
        <Text style={styles.infoText}>• Съедобный гриб</Text>
        <Text style={styles.infoText}>• Сезон: лето-осень</Text>
        <Text style={styles.infoText}>• Место обитания: хвойные и смешанные леса</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    backgroundColor: '#452929',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: '#c79078',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    marginTop: 1,
  },
  descriptionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    
    textAlign: 'left',
    flexWrap: 'wrap',
    color: '#cccccc',
    fontSize: 16,
    lineHeight: 24,

  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#2a2a2a',
    marginTop: 1,
  },
  infoTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default FungiDetails;