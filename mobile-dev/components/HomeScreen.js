import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from "react-native";

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>

      {/* Поиск */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Поиск"
          style={styles.searchInput}
        />
      </View>

      {/* Новые статьи */}
      <Text style={styles.sectionTitle}>Новые статьи</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>

        <View style={styles.articleCard}>
          <Image
            source={require("../assets/image/fox.jpg")}
            style={styles.articleImage}
          />

          <View style={styles.newBadge}>
            <Text style={styles.badgeText}>Новое</Text>
          </View>

          <Text style={styles.articleTitle}>
            Психоактивные грибы и где они обитают.
          </Text>

          <Text style={styles.meta}>
            24 мин ⭐ 4.8
          </Text>
        </View>

        <View style={styles.articleCard}>
          <Image
            source={require("../assets/image/white.jpg")}
            style={styles.articleImage}
          />

          <View style={styles.newBadge}>
            <Text style={styles.badgeText}>Новое</Text>
          </View>

          <Text style={styles.articleTitle}>
            Психоактивные грибы и где они обитают.
          </Text>

          <Text style={styles.meta}>
            24 мин ⭐ 4.8
          </Text>
        </View>

      </ScrollView>

      {/* Популярные грибы */}
      <Text style={styles.sectionTitle}>Популярные грибы</Text>

      <View style={styles.row}>

        <View style={styles.mushroomCard}>
          <Image
            source={require("../assets/image/white.jpg")}
            style={styles.mushroomImage}
          />
          <Text style={styles.mushroomName}>
            Подосиновик жёлто-бурый
          </Text>
          <Text style={styles.mushroomLatin}>
            Leccinum versipelle
          </Text>
        </View>

        <View style={styles.mushroomCard}>
          <Image
            source={require("../assets/image/fox.jpg")}
            style={styles.mushroomImage}
          />
          <Text style={styles.mushroomName}>
            Энтолома садовая
          </Text>
          <Text style={styles.mushroomLatin}>
            Leccinum versipelle
          </Text>
        </View>

      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#f4f4f4",
    padding:16
  },

  searchBox:{
    backgroundColor:"#e9d3b0",
    borderRadius:20,
    padding:10,
    marginBottom:20
  },

  searchInput:{
    backgroundColor:"#fff",
    borderRadius:15,
    padding:10
  },

  sectionTitle:{
    fontSize:20,
    fontWeight:"600",
    marginBottom:10
  },

  articleCard:{
    width:220,
    backgroundColor:"#fff",
    borderRadius:16,
    marginRight:14,
    paddingBottom:10,
    overflow:"hidden"
  },

  articleImage:{
    width:"100%",
    height:120
  },

  newBadge:{
    position:"absolute",
    top:90,
    left:10,
    backgroundColor:"#ff7a00",
    paddingHorizontal:8,
    borderRadius:10
  },

  badgeText:{
    color:"#fff",
    fontSize:12
  },

  articleTitle:{
    fontSize:14,
    padding:10
  },

  meta:{
    paddingLeft:10,
    color:"#888"
  },

  row:{
    flexDirection:"row",
    justifyContent:"space-between"
  },

  mushroomCard:{
    width:"48%",
    backgroundColor:"#fff",
    borderRadius:16,
    paddingBottom:10
  },

  mushroomImage:{
    width:"100%",
    height:120,
    borderTopLeftRadius:16,
    borderTopRightRadius:16
  },

  mushroomName:{
    padding:10,
    fontWeight:"600"
  },

  mushroomLatin:{
    paddingLeft:10,
    color:"#888"
  }

});

export default HomeScreen;