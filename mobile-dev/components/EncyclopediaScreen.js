import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EncyclopediaList from './EncyclopediaList';
import { TAB_BAR_SCREEN_PADDING } from './CustomTabBar';

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
  {
    type: 'Болетовые (Boletaceae)',
    title: 'Подосиновик желто-бурый',
    latyn: 'Leccinum versipelle',
    description: `  Узнается по оранжево-коричневой шляпке и плотной мякоти.
Часто растет рядом с березами и осинами, хорошо подходит для жарки и сушки.`,
    imageSource: require('./../assets/image/white.jpg')
  },
  {
    type: 'Болетовые (Boletaceae)',
    title: 'Подберезовик обыкновенный',
    latyn: 'Leccinum scabrum',
    description: `  � аспространенный гриб с серо-коричневой шляпкой и длинной ножкой.
Предпочитает березовые рощи и смешанные леса.`,
    imageSource: require('./../assets/image/fox.jpg')
  },
  {
    type: 'Шампиньоновые',
    title: 'Шампиньон лесной',
    latyn: 'Agaricus silvaticus',
    description: `  Лесной шампиньон с приятным ароматом и темнеющими пластинками.
Встречается в хвойных лесах и на лесных опушках.`,
    imageSource: require('./../assets/image/shampinon.jpg')
  },
];

const initialHistory = ['Энтолома', 'Шампиньон'];

const EncyclopediaScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState(initialHistory);

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((item) =>
      item.title.toLowerCase().includes(query) ||
      item.latyn.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );
  }, [searchText]);

  const handleSelectHistory = (item) => {
    setSearchText(item);
    Keyboard.dismiss();
    setIsSearchFocused(false);
  };

  const handleCardPress = (item) => {
    setSearchHistory((prev) => {
      const next = [item.title, ...prev.filter((entry) => entry !== item.title)];
      return next.slice(0, 5);
    });

    navigation.navigate('FungiDetails', {
      mushroom: item,
    });
  };

  const showHistory = isSearchFocused && searchText.trim().length === 0;

  return (
    <View style={styles.container}>
      <View style={[styles.headerBlock, { paddingTop: Math.max(insets.top, 12) }]}> 
        <View style={styles.searchRow}>
          {isSearchFocused ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                Keyboard.dismiss();
                setIsSearchFocused(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>{"<"}</Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск"
              placeholderTextColor="#A6A19A"
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setIsSearchFocused(true)}
            />
            <Text style={styles.searchIcon}>{"o"}</Text>
          </View>
        </View>
      </View>

      {showHistory ? (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>История</Text>
            {searchHistory.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchHistory([])} activeOpacity={0.8}>
                <Text style={styles.clearText}>Очистить</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {searchHistory.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.historyItem}
              onPress={() => handleSelectHistory(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.historyItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <EncyclopediaList
          encycdata={filteredData}
          navigation={navigation}
          bottomInset={TAB_BAR_SCREEN_PADDING + insets.bottom}
          onCardPress={handleCardPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  headerBlock: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#EACFA5',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8EFE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    lineHeight: 20,
    color: '#B28042',
  },
  searchInputWrapper: {
    flex: 1,
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: '#F8EFE2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 12,
  },
  searchInput: {
    flex: 1,
    minHeight: 36,
    color: '#323142',
    fontFamily: 'Raleway-Medium',
    fontSize: 14,
    paddingVertical: 0,
  },
  searchIcon: {
    fontSize: 18,
    color: '#D3A25E',
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 24,
    color: '#323142',
  },
  clearText: {
    fontFamily: 'Raleway-Medium',
    fontSize: 14,
    color: '#E0B77D',
  },
  historyItem: {
    paddingVertical: 8,
  },
  historyItemText: {
    fontFamily: 'Raleway-Medium',
    fontSize: 16,
    color: '#323142',
  },
});

export default EncyclopediaScreen;


