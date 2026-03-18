import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Encyclopedia from './Encyclopedia';

const EncyclopediaList = ({ encycdata, navigation }) => {

  const renderItem = ({ item }) => (
    <Encyclopedia
      {...item}
      navigation={navigation}
    />
  );

  return (

    <FlatList
      data={encycdata}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />

  );
};

const styles = StyleSheet.create({

  row: {
    justifyContent: 'space-between',
  },

});

export default EncyclopediaList;