import React, { useRef, useState, useEffect } from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';
import { TouchableOpacity } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';

import { loadImagesFromStorage } from '../components/Pictures/loadImagesFromStorage';
import { requestCameraPermission } from '../components/Camera/requestCameraPermission';
import { getCurrentLocation } from '../components/Location/getCurrentLocation';
import { storeImage } from '../components/Pictures/storeImage';



type RootStackParamList = {
    Map: { photoUris: { uri: string; location: { latitude: number; longitude: number } }[] };
    Photo: { newPhotoData?: { uri: string; location: { latitude: number; longitude: number }; date: string } };
    Library: {
        newPhotoUri?: string;
    };
};

type PhotoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Photo'>;
type PhotoScreenRouteProp = RouteProp<RootStackParamList, 'Photo'>;

type Props = {
    navigation: PhotoScreenNavigationProp;
    route: PhotoScreenRouteProp;
};

export const PhotoScreen: React.FC<Props> = ({ navigation }) => {
    const [type, setType] = useState<CameraType>(CameraType.back);
    const cameraRef = useRef<Camera>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [photoUris, setPhotoUris] = useState<{ uri: string; location: { latitude: number; longitude: number } }[]>([]);

    useEffect(() => {
        (async () => {
            const hasPermission = await requestCameraPermission();
            setHasPermission(hasPermission);
            const uris = await loadImagesFromStorage();
            setPhotoUris(uris);
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const photo = await cameraRef.current.takePictureAsync(options);
            console.log('Photo:', photo.uri);

            const currentLocation = await getCurrentLocation();
            const currentDate = new Date();
            const photoData = {
                uri: photo.uri,
                location: currentLocation,
                date: currentDate.toISOString(),
            };

            await storeImage(photoData);
            setPhotoUris([photoData, ...photoUris]);
            navigation.navigate('Map', { photoUris: [photoData, ...photoUris] });
        }
    };

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    };

    return (
        <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} ref={cameraRef} type={type}>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, alignSelf: 'center' }}>
                    <TouchableOpacity onPress={takePicture} style={{ backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 10, padding: 2, borderRadius: 50, marginBottom: 25 }}>
                        <Entypo name="circle" size={60} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, right: 0, marginRight: 5, alignSelf: 'center' }}>

                    <TouchableOpacity onPress={toggleCameraType} style={{ backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.8, shadowRadius: 10, padding: 10, borderRadius: 50, marginBottom: 25, marginRight: 5 }}>
                        <AntDesign name='swap' size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </Camera>

        </View>
    );
};
