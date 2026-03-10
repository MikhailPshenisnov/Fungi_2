import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ПУТИ К PNG ИКОНКАМ
const ICONS = {
  close: require('../assets/image/navbar/close.png'),
  flash: require('../assets/image/navbar/flash.png'),
  flashOff: require('../assets/image/navbar/flash_off.png'),
  gallery: require('../assets/image/navbar/gallery.png'),
  flip: require('../assets/image/navbar/flip.png'),
  capture: require('../assets/image/navbar/capture.png'),
};

// ПУТЬ К ИЗОБРАЖЕНИЮ ДЛЯ ПРЕВЬЮ КАМЕРЫ
const CAMERA_PREVIEW_IMAGE = require('../assets/image/podosinovik.jpg');

export default function AICameraScreen({ navigation }) {
  const [flashMode, setFlashMode] = React.useState(false);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleFlashToggle = () => {
    setFlashMode(!flashMode);
  };

  const handleGallery = () => {
    // Функция открытия галереи (добавите позже)
    console.log('Open gallery');
  };

  const handleCapture = () => {
    // Переход на экран классификатора с захваченным фото
    navigation.navigate('MushroomClassifier', {
      capturedImage: CAMERA_PREVIEW_IMAGE // Здесь будет реальное захваченное фото
    });
  };

  const handleFlipCamera = () => {
    // Функция переворота камеры (добавите позже)
    console.log('Flip camera');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Верхняя черная панель с кнопками */}
      <View style={styles.topBar}>
        <View style={styles.topControls}>
          {/* Кнопка закрытия */}
          <TouchableOpacity 
            style={styles.topButton}
            onPress={handleClose}
          >
            <Image source={ICONS.close} style={styles.iconStyle} />
          </TouchableOpacity>

          {/* Кнопка вспышки */}
          <TouchableOpacity 
            style={styles.topButton}
            onPress={handleFlashToggle}
          >
            <Image 
              source={flashMode ? ICONS.flash : ICONS.flashOff} 
              style={styles.iconStyle} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Область предварительного просмотра камеры */}
      <View style={styles.cameraPreview}>
        <Image 
          source={CAMERA_PREVIEW_IMAGE} 
          style={styles.previewImage}
          resizeMode="cover"
        />
      </View>

      {/* Нижняя черная панель с кнопками */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomControls}>
          {/* Кнопка галереи */}
          <TouchableOpacity 
            style={styles.sideButton}
            onPress={handleGallery}
          >
            <Image source={ICONS.gallery} style={styles.iconStyleLarge} />
          </TouchableOpacity>

          {/* Кнопка захвата фото */}
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={handleCapture}
          >
            <Image source={ICONS.capture} style={styles.captureImage} />
          </TouchableOpacity>

          {/* Кнопка переворота камеры */}
          <TouchableOpacity 
            style={styles.sideButton}
            onPress={handleFlipCamera}
          >
            <Image source={ICONS.flip} style={styles.iconStyleLarge} />
          </TouchableOpacity>
        </View>

        {/* Индикатор внизу экрана (белая полоска) */}
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Верхняя черная панель
  topBar: {
    height: 100,
    backgroundColor: '#000000',
    justifyContent: 'center',
    paddingTop: 10,
  },

  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  topButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconStyle: {
    width: 30,
    height: 30,
  },

  // Область предварительного просмотра камеры
  cameraPreview: {
    flex: 1,
    backgroundColor: '#000000',
  },

  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Нижняя черная панель
  bottomBar: {
    height: 180,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },

  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  sideButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconStyleLarge: {
    width: 35,
    height: 35,
  },

  // Центральная кнопка захвата
  captureButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureImage: {
    width: 80,
    height: 80,
  },

  // Индикатор домашней кнопки (белая полоска внизу)
  homeIndicator: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    marginLeft: -67.5,
    width: 135,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2.5,
  },
});