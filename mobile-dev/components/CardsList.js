import { FlatList, StyleSheet } from 'react-native';
import Card from './Card';

const CardsList = ({ cardsdata }) => {
  return (
    <FlatList
      data={cardsdata}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card
          title={item.title}
          imageSource={item.imageSource}
          isNew={item.isNew}
          readTime={item.readTime}
          rating={item.rating}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingTop: 12,
    paddingBottom: 110,
  },
});

export default CardsList;
