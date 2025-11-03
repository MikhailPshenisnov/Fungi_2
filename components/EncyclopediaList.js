// components/EncyclopediaList.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Encyclopedia from './Encyclopedia'; // 👈 Исправляем импорт!

const EncyclopediaList = ({encycdata}) => {
    return (
        <View style={styles.cardContainer}>
            <ScrollView>
                <View style={styles.container}>
                    {encycdata.map((item, index) => (
                      <Encyclopedia 
                        key={index} 
                        type={item.type} 
                        title={item.title} 
                        description={item.description} 
                        imageSource={item.imageSource} 
                      />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default EncyclopediaList;