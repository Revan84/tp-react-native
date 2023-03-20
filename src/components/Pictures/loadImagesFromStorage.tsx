import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadImagesFromStorage = async () => {
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
    return uris;
};



