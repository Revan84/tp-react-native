import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';


type RootStackParamList = {
    Map: {
        photoUris?: { uri: string; location: { latitude: number; longitude: number } }[];
        newPhotoData?: { uri: string; location: { latitude: number; longitude: number }; date: string };
    };
    Photo: { newPhotoData?: { uri: string; location: { latitude: number; longitude: number }; date: string } };
    Library: {
        newPhotoUri?: string;
    };
};

type LibraryScreenRouteProp = RouteProp<RootStackParamList, 'Library'>;

type Props = {

    route: LibraryScreenRouteProp;
};

export const LibraryScreen: React.FC<Props> = ({ route }) => {
    const [photoUris, setPhotoUris] = useState<{ uri: string; location: { latitude: number; longitude: number } | null; date: string | null }[]>([]);

    const loadImagesFromStorage = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(keys);
            const uris = result
                .map(item => {
                    try {
                        const parsed = JSON.parse(item[1] as string);
                        return parsed && typeof parsed === 'object' && 'uri' in parsed
                            ? { uri: parsed.uri, location: 'location' in parsed ? parsed.location : null, date: 'date' in parsed ? parsed.date : null }
                            : { uri: item[1] as string, location: null, date: null };
                    } catch (error) {
                        console.warn('Error parsing item:', item);
                        return { uri: item[1] as string, location: null, date: null };
                    }
                })
                .filter(value => value !== null);

            // Update the state with the loaded photos
            setPhotoUris(uris);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };


    const ImageWithLocation: React.FC<{ uri: string; location: { latitude: number; longitude: number } | null; date: string | null }> = ({
        uri,
        location,
        date,
    }) => {
        return (
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <View style={{ width: 180, height: 180, marginBottom: 2, borderRadius: 10, backgroundColor: 'black', borderColor: '#031926', borderWidth: 1, shadowColor: 'black', shadowRadius: 2, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.7 }}>
                    <Image source={{ uri }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                </View>
                {location ? (
                    <View style={{ flexDirection: 'column', padding: 4, marginBottom: 10, alignItems: 'center', backgroundColor: '#CBF1EE', borderRadius: 4, borderColor: '#031926', borderWidth: 1, shadowColor: 'black', shadowRadius: 2, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.5 }}>
                        <Text style={{ fontSize: 10, alignContent: 'center' }}>
                            Lat: {location.latitude.toFixed(6)},
                            Lon: {location.longitude.toFixed(6)}
                        </Text>
                    </View>
                ) : (
                    <Text>No location data</Text>
                )}
                {date ? (
                    <Text style={{ fontSize: 10, textAlign: 'center' }}>
                        {new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString()}
                    </Text>
                ) : (
                    <Text>No date data</Text>
                )}
            </View>
        );
    };

    const deleteAllPhotos = async () => {
        try {
            await AsyncStorage.clear();
            setPhotoUris([]);
            Alert.alert('Success', 'All photos have been deleted.');
        } catch (error) {
            console.error('Error deleting all photos:', error);
            Alert.alert('Error', 'Failed to delete all photos.');
        }
    };

    useEffect(() => {
        loadImagesFromStorage();
    }, [route.params?.newPhotoUri]);

    // New useEffect to refresh every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            loadImagesFromStorage();
        }, 5000);

        // Cleanup on component unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#9DBEBB33' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
                <TouchableOpacity onPress={deleteAllPhotos} style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: '#031926', padding: 10, borderRadius: 5, width: 180, alignItems: 'center' }}>
                    <AntDesign name='delete' size={24} color="white" style={{ marginRight: 8 }} />
                    <Text style={{ color: 'white' }}>Delete All Photos</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                style={{}}
                data={photoUris}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={{ justifyContent: 'space-evenly' }}

                renderItem={({ item }) => (

                    <View style={{ flex: 1 / 2, flexDirection: 'column' }}>
                        <TouchableOpacity style={{}}>
                            <ImageWithLocation uri={item.uri} location={item.location} date={item.date} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>

    );
};
