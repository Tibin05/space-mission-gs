import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SensoresScreen from '../screens/SensoresScreen';
import SistemasScreen from '../screens/SistemasScreen';
import AlertasScreen from '../screens/AlertasScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#0a0a1a', borderTopColor: '#1a1a3e' },
          tabBarActiveTintColor: '#00d4ff',
          tabBarInactiveTintColor: '#555577',
          headerStyle: { backgroundColor: '#0a0a1a' },
          headerTintColor: '#00d4ff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}>
        <Tab.Screen name="Missão" component={HomeScreen} options={{ tabBarIcon: () => <Text>🚀</Text> }} />
        <Tab.Screen name="Sensores" component={SensoresScreen} options={{ tabBarIcon: () => <Text>📡</Text> }} />
        <Tab.Screen name="Sistemas" component={SistemasScreen} options={{ tabBarIcon: () => <Text>🛸</Text> }} />
        <Tab.Screen name="Alertas" component={AlertasScreen} options={{ tabBarIcon: () => <Text>🔔</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
