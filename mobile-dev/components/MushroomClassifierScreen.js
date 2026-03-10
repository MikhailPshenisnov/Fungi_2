import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';

const MushroomClassifierScreen = ({ route, navigation }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Получаем захваченное фото из параметров навигации
    useEffect(() => {
        if (route.params?.capturedImage) {
            setSelectedImage(route.params.capturedImage);
        }
    }, [route.params?.capturedImage]);

    // Функция для кнопки ФАЙЛ
    const handleFilePress = () => {
        Alert.alert(
            "Выберите действие",
            "Откуда загрузить фото?",
            [
                { text: "Камера", onPress: () => navigation.goBack() }, // Вернуться к камере
                { text: "Галерея", onPress: () => selectImageFromGallery() },
                { text: "Отмена", style: "cancel" }
            ]
        );
    };

    // Имитация загрузки изображения из галереи
    const selectImageFromGallery = () => {
        setSelectedImage(require('../assets/image/white.jpg'));
    };

    // Функция для кнопки URL
    const handleUrlPress = () => {
        Alert.prompt(
            "URL изображения",
            "Введите ссылку на фото гриба",
            [
                { text: "Отмена", style: "cancel" },
                {
                    text: "Загрузить",
                    onPress: (url) => {
                        if (url) {
                            setSelectedImage({ uri: url });
                        }
                    }
                }
            ]
        );
    };

    // Сброс выбранного изображения
    const handleReset = () => {
        setSelectedImage(null);
    };

    // Классификация гриба
    const handleClassify = () => {
        Alert.alert("Классификация", "Ищем информацию о грибе...");
    };

    return (
        <View style={styles.container}>
            {/* Надпись Классификатор с отступом 91 от верха */}
            <Text style={styles.classifierLabel}>Классификатор грибов</Text>
            {/* Надпись "фото" в левом верхнем углу окошка */}
            <Text style={styles.photoLabel}>ФОТО</Text>

            {/* Квадратное окошко для фото */}
            <View style={styles.photoBox}>
                
                {/* Место для фото (занимает всю верхнюю часть) */}
                <View style={styles.photoArea}>
                    {selectedImage ? (
                        <Image
                            source={selectedImage}
                            style={styles.photoImage}
                        />
                        
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Image
                              source={require("../assets/image/icon1.png")}
                            />
                            <Text style={styles.photoText}>Загрузите изображение гриба</Text>
                        </View>
                    )}
                </View>

                {/* Кнопки ФАЙЛ и URL внутри окошка по нижнему краю */}
                <View style={styles.photoButtons}>
                    <TouchableOpacity
                        style={[styles.photoButton, styles.photoFileButton]}
                        onPress={handleFilePress}
                    >
                        <Text style={styles.photoFileButtonText}>ФАЙЛ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.photoButton, styles.photoUrlButton]}
                        onPress={handleUrlPress}
                    >
                        <Text style={styles.photoUrlButtonText}>URL</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Кнопка КЛАССИФИЦИРОВАТЬ - появляется только после загрузки фото */}
            {selectedImage && (
                <TouchableOpacity
                    style={styles.classifyButton}
                    onPress={handleClassify}
                >
                    <Text style={styles.classifyButtonText}>
                        КЛАССИФИЦИРОВАТЬ
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flex: 1,
        backgroundColor: '#ffffff',
        gap: 10,
    },
    // Стиль для надписи Классификатор
    classifierLabel: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000000',
        marginTop: 50,
        marginBottom: 10,
        marginLeft: 20,
    },
    // Квадратное окошко
    photoBox: {
        marginTop: 16,
        marginBottom: 5,
        alignSelf: 'center',
        width: 361,
        height: 508,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#8e8080',
        position: 'relative',
    },
    // Надпись "фото" в левом верхнем углу окошка
    photoLabel: {
        marginLeft: 20,
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
    // Верхняя часть окошка (80% высоты) - для фото
    photoArea: {
        height: '80%',
        backgroundColor: '#ffffff',
    },
    // Заглушка для фото
    photoPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoIcon: {
        fontSize: 60,
        color: '#666',
        marginBottom: 10,
    },
    photoText: {
        color: '#888',
        fontSize: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    // Загруженное фото
    photoImage: {
        marginTop: 10,
        width: 315,
        height: 394,
        alignSelf: 'center',
        resizeMode: 'cover',
        borderRadius: 25,
    },
    // Нижняя часть окошка (20% высоты) - для кнопок
    photoButtons: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        gap: 13,
        padding: 13,
    },
    // Кнопки внутри окошка
    photoButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoFileButton: {
        backgroundColor: '#FFE8C4',
        borderRadius: 25,
        width: 158,
        height: 70,
    },
    photoFileButtonText: {
        color: '#323142',
        fontSize: 14,
        fontWeight: '600',
    },
    photoUrlButton: {
        backgroundColor: '#FFE8C4',
        borderRadius: 25,
        width: 158,
        height: 70,
    },
    photoUrlButtonText: {
        color: '#323142',
        fontSize: 14,
        fontWeight: '600',
    },
    // Большая кнопка классификации
    classifyButton: {
        backgroundColor: '#FFE8C4',
        width: 361, 
        height: 60,
        borderRadius: 25,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    classifyButtonText: {
        color: '#323142',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MushroomClassifierScreen;
