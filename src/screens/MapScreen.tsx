// screens/MapScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, Share, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { RouteProp } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    Map: { photoUris: { uri: string; location: { latitude: number; longitude: number } }[] };
    Photo: { newPhotoData?: { uri: string; location: { latitude: number; longitude: number } } };
    Library: {
        newPhotoUri?: string;
    };
};

type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

type Props = {
    route: MapScreenRouteProp;
};


export const MapScreen: React.FC<Props> = (props) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { photoUris } = props.route.params;

    const onShare = async (photoUri: string) => {
        try {
            await Share.share({
                message: `Check out this photo I took: ${photoUri}`,
                url: photoUri,
            });
        } catch (error) {
            console.log('Error sharing the photo:', error);
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);


    if (errorMsg) {
        return (
            <View>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View>
                <Text>Getting user location...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {photoUris.map((photoData, index) => (
                    <Marker
                        key={index}
                        coordinate={photoData.location}
                        title="Photo"
                    >
                        <Callout>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={{ uri: photoData.uri }} style={{ width: 140, height: 140 }} />
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center' }}>Photo taken at this location</Text>
                                </View>
                                <TouchableOpacity onPress={() => onShare(photoData.uri)}>
                                    <AntDesign name='sharealt' size={24} color="blue" />
                                </TouchableOpacity>

                            </View>
                        </Callout>

                    </Marker>
                ))}

                {/* Add this Marker to show your current location */}
                <Marker
                    key="current_location"
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="My Location"
                    pinColor="blue" // You can customize the pin color
                />
            </MapView>

        </View>
    );
};