import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Encyclopedia from './Encyclopedia';

const EncyclopediaList = ({ encycdata, navigation }) => {

    return (
        <View style={styles.cardContainer}>
            <ScrollView>
                <View style={styles.container}>
                    {encycdata.map((item, index) => (
                      <Encyclopedia 
                        key={index} 
                        type={item.type} 
                        title={item.title} 
                        latyn={item.latyn} 
                        description={item.description} 
                        imageSource={item.imageSource} 
                        navigation={navigation} 
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
        justifyContent: 'center',
    },
    errorText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default EncyclopediaList;