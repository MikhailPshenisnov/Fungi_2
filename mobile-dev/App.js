import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';

import CustomTabBar  from './components/CustomTabBar';
import EncyclopediaScreen from './components/EncyclopediaScreen';
import CardsScreen from './components/CardsScreen'; 
import AICameraScreen from './components/AICameraScreen';
import MushroomClassifierScreen from './components/MushroomClassifierScreen';
import ProfileScreen from './components/ProfileScreen';
import FungiDetails from './components/fungiDetails';
import HomeScreen from './components/HomeScreen';

import { useFonts } from "expo-font";
import { useEffect } from "react";

import RegistrationScreen from './components/RegistrationScreen';
import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import TestProfileScreen from './components/TestProfileScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function EncyclopediaStack() {
  return (
   <Stack.Navigator
      screenOptions={{
        //анимация
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              
              transform: [
                {
                  translateX: current.progress.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [
                    layouts.screen.width,
                    layouts.screen.width * 0.2,
                    0
                  ],
                    }),
                },
              ],
            },
          };
        },
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 350 } },
          close: { animation: 'timing', config: { duration: 300 } },
        },
      }}
    >
      <Stack.Screen 
        name="Encyclopedia" 
        component={EncyclopediaScreen} 
        options={{ 
          title: 'Энциклопедия',
          headerStyle: { backgroundColor: '#452929' },
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
        }}
      />
      {/*ЭКРАН ДЕТАЛЕЙ */}
      <Stack.Screen 
        name="FungiDetails" 
        component={FungiDetails}
        options={{ 
          title: 'Детали гриба',
          headerStyle: { backgroundColor: '#452929' },
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
        }}
      />
    </Stack.Navigator>
  );
}


function CardsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Cards" 
        component={CardsScreen} 
        options={{ 
          title: 'Публикации',
          headerStyle: {
             backgroundColor: '#452929',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Registration" 
        component={RegistrationScreen} 
        options={{ title: "Регистрация", headerShown: false }} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      {/* ДОБАВЛЯЕМ ТЕСТОВЫЙ ПРОФИЛЬ */}
      <Stack.Screen 
        name="TestProfile" 
        component={TestProfileScreen}
        options={{ 
          title: "Тестовый профиль",
          headerStyle: { backgroundColor: '#452929' },
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
        }}
      />
    </Stack.Navigator>
  );
}


function AICamera() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AICamera" 
        component={AICameraScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="MushroomClassifier" 
        component={MushroomClassifierScreen}
        options={{
          title: 'Классификатор',
          headerStyle: { backgroundColor: '#452929' },
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
        }}
      />
    </Stack.Navigator>
  );
}


const App = () => {
  const [fontsLoaded] = useFonts({
    "Raleway-Regular": require("./assets/fonts/Raleway-Regular.ttf"),
    "Raleway-Bold": require("./assets/fonts/Raleway-Bold.ttf"),
    "Raleway-Medium": require("./assets/fonts/Raleway-Medium.ttf"),
    "Raleway-Semibold": require("./assets/fonts/Raleway-SemiBold.ttf"),
  });

  if (!fontsLoaded) return null;


  return (
    <>
    <StatusBar style="light" translucent={true} />  
    <NavigationContainer>
      <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, size }) => {
        let icon;

        if (route.name === "Главная") {
          icon = focused
            ? require("./assets/image/navbar/home_active.png")
            : require("./assets/image/navbar/home.png");
        }
        if (route.name === "Карточки") {
          icon = focused
            ? require("./assets/image/navbar/cards_active.png")
            : require("./assets/image/navbar/cards.png");
        }
        if (route.name === "Энциклопедия") {
          icon = focused
            ? require("./assets/image/navbar/encyclopedia_active.png")
            : require("./assets/image/navbar/encyclopedia.png");
        }
        if (route.name === "Профиль") {
          icon = focused
            ? require("./assets/image/navbar/profile_active.png")
            : require("./assets/image/navbar/profile.png");
        }

        return <Image source={icon} style={{ width: undefined, height: undefined }} />;
      },

      headerShown: false,
    })}
  >
    <Tab.Screen name="Главная" component={HomeScreen} />
    <Tab.Screen name="Карточки" component={CardsStack} />
    <Tab.Screen 
      name="Камера" 
      component={AICamera}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen name="Энциклопедия" component={EncyclopediaScreen} />
    <Tab.Screen name="Профиль" component={ProfileStack} />
  </Tab.Navigator>

    </NavigationContainer>
    </>
  );
};

export default App;