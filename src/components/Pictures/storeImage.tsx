import AsyncStorage from "@react-native-async-storage/async-storage";


export const storeImage = async (
    photoData: {
        uri: string;
        location: { latitude: number; longitude: number };
        date: string;
    }
) => {
    try {
        const key = `photo-${Date.now()}`;
        await AsyncStorage.setItem(key, JSON.stringify(photoData));
    } catch (error) {
        console.error('Error saving image:', error);
    }
};