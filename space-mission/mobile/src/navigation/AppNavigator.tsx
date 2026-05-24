// src/navigation/AppNavigator.tsx
// Configura a navegação com abas na parte inferior da tela

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import SensoresScreen from '../screens/SensoresScreen';
import SistemasScreen from '../screens/SistemasScreen';
import AlertasScreen from '../screens/AlertasScreen';

// Tipos das rotas (TypeScript)
export type RootTabParamList = {
  Home: undefined;
  Sensores: undefined;
  Sistemas: undefined;
  Alertas: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    // NavigationContainer: envolve toda a navegação do app
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#0a0a1a',
            borderTopColor: '#1a1a3e',
          },
          tabBarActiveTintColor: '#00d4ff',
          tabBarInactiveTintColor: '#555577',
          headerStyle: { backgroundColor: '#0a0a1a' },
          headerTintColor: '#00d4ff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}>

        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Missão', tabBarLabel: 'Missão' }}
        />
        <Tab.Screen
          name="Sensores"
          component={SensoresScreen}
          options={{ title: 'Sensores', tabBarLabel: 'Sensores' }}
        />
        <Tab.Screen
          name="Sistemas"
          component={SistemasScreen}
          options={{ title: 'Sistemas', tabBarLabel: 'Sistemas' }}
        />
        <Tab.Screen
          name="Alertas"
          component={AlertasScreen}
          options={{ title: 'Alertas', tabBarLabel: 'Alertas' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
