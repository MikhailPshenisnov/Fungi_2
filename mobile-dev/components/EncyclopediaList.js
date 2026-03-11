import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Encyclopedia from './Encyclopedia';

const EncyclopediaList = ({ encycdata, navigation, bottomInset = 0, onCardPress }) => {
  return (
    <View style={styles.cardContainer}>
      <FlatList
        data={encycdata}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomInset }]}
        renderItem={({ item }) => (
          <Encyclopedia
            type={item.type}
            title={item.title}
            latyn={item.latyn}
            description={item.description}
            imageSource={item.imageSource}
            navigation={navigation}
            onPress={() => onCardPress(item)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 16,
  },
  column: {
    gap: 12,
    marginBottom: 12,
  },
});

export default EncyclopediaList;
