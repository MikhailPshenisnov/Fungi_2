import React from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';

const Card = ({ title, imageSource }) => {
    const handlePress = () => {
        Alert.alert("Карточка нажата", title);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <Image source={imageSource} style={styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#452929',
        borderRadius: 23,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        height: 150,
    },
    cardContent: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        margin: 15,
    },
    description: {
        fontSize: 14,
        color: '#fff',
    },
    image: {
        width: '50%',
        height: '100%',
        borderTopRightRadius: 23,
        borderBottomRightRadius: 23,
    },
});

export default Card;