import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';


import EncyclopediaScreen from './components/EncyclopediaScreen';
import CardsScreen from './components/CardsScreen'; 
import ProfileScreen from './components/ProfileScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function EncyclopediaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Encyclopedia" 
        component={EncyclopediaScreen} 
        options={{ 
          title: 'Энциклопедия',
          headerStyle: { backgroundColor: '#452929' },
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
          headerStyle: { backgroundColor: '#452929' },
          headerTintColor: '#ffffff',
        }}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconSource;

            if (route.name === 'Энциклопедия') {
              iconSource = focused 
                ? require('./assets/image/encyclopedia2.png')
                : require('./assets/image/encyclopedia.png');
            } else if (route.name === 'Карточки') {
              iconSource = focused 
                ? require('./assets/image/cards2.png')
                : require('./assets/image/cards.png');
            } else if (route.name === 'Профиль') {
              iconSource = focused 
                ? require('./assets/image/profile2.png')
                : require('./assets/image/profile.png');
            }

            return <Image source={iconSource} style={{ width: size, height: size }} />;
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: {
            backgroundColor: '#452929',
            paddingBottom: 5,
            paddingTop: 5,
          },
          
        })}
      >
        <Tab.Screen 
          name="Энциклопедия" 
          component={EncyclopediaStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Карточки" 
          component={CardsStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Профиль" 
          component={ProfileScreen}
          options={{ 
            headerStyle: { backgroundColor: '#452929' },
            headerTintColor: '#ffffff',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;