import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import EncyclopediaList from './EncyclopediaList';


const data = [
  { 
    type: 'Болетовые (Boletaceae)',
    title: 'Белый гриб', 
    latyn: 'Boletus edulis', 
    description: `  Отличается массивной трубчатой шляпкой от
коричневого до почти белого цвета. Его мякоть
не темнеет на срезе и имеет приятный грибной аромат.
Ценится выше всех других грибов за превосходный вкус и
питательность. Растет в хвойных и лиственных лесах.`,
    imageSource: require('./../assets/image/white.jpg') 
  },
  { 
    type: 'Лисичковые',
    title: 'Лисичка обыкновенная', 
    latyn: 'Cantharellus cibarius', 
    description: `  Узнаваема по ярко-желтой воронковидной
шляпке с волнистыми краями. Главное отличие — пластинки
в виде складок, нисходящих по ножке. Гриб почти никогда не
бывает червивым и хорошо подходит для жарки и маринования.
Чаще всего встречается в хвойных и смешанных лесах большими группами.`,
    imageSource: require('./../assets/image/fox.jpg') 
  },
  { 
    type: 'Шампиньоновые',
    title: 'Шампиньон полевой', 
    latyn: 'Agaricus campestris', 
    description: `  Имеет белую или кремовую шляпку,
которая с возрастом из округлой становится зонтиковидной.
Важный признак — пластинки у зрелого гриба темно-коричневые,
почти черные. Обладает характерным анисовым или миндальным ароматом.
Растет на открытых пространствах: на лугах, пастбищах или в парках.`,
    imageSource: require('./../assets/image/shampinon.jpg') 
  },
];

const EncyclopediaScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');


  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск..."
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />
      
      <EncyclopediaList 
        encycdata={filteredData} 
        navigation={navigation} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10, 
  },
  searchInput: {
    backgroundColor: '#573737',
    borderRadius: 5,
    padding: 10,
    color: '#fff',
    marginBottom: 10,
  },
});

export default EncyclopediaScreen;