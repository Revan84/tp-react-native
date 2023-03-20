import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
    const currentLocation = await Location.getCurrentPositionAsync({});
    return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
    };
};
