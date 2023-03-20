import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from '../screens/MapScreen';
import { PhotoScreen } from '../screens/PhotoScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Map') {
                    iconName = focused ? 'map' : 'map-outline';
                } else if (route.name === 'Photo') {
                    iconName = focused ? 'camera' : 'camera-outline';
                } else if (route.name === 'Library') {
                    iconName = focused ? 'image' : 'image-outline';
                }

                return <MaterialCommunityIcons focused={focused} name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#031926',
            tabBarInactiveTintColor: '#9DBEBB',
            tabBarStyle: {
                backgroundColor: '#ECECEC',
            },
        })}
    >
        <Tab.Screen name="Map" component={MapScreen} initialParams={{ photoUris: [] }} />
        <Tab.Screen name="Photo" component={PhotoScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
    </Tab.Navigator>
);

