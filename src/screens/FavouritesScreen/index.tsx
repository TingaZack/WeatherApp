import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchWeatherFav, removeFavourites } from "../../features/weather/weatherSlice";
import Carousel from 'react-native-snap-carousel';
import moment from "moment";
import { WeatherData } from "../../types";
import Toast from "react-native-toast-message";

const FavouritesScreen: React.FC = () => {
    const selector = useAppSelector(state => state);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchWeatherFav()).then(() => {
            setLoading(false);
        });
    }, [dispatch]);

    const handleRemoveFav = async (weatherData: WeatherData) => {
        setDeleting(true);
        try {
            await dispatch(removeFavourites(weatherData.id)).then(() => {
                showToast();
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setDeleting(false);
        }
    };

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Favourites',
            text2: 'Removed from your favorites list',
            visibilityTime: 3000,
        });
    };

    return (
        <View>
            {loading ? (
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            ) : deleting ? (
                <ActivityIndicator size="large" color="blue" />
            ) : selector.weather.favs.length > 0 ? (
                <View style={styles.container}>
                    <ScrollView>
                        {selector.weather.favs.map((weatherData: WeatherData) => (
                            <FavItemCard key={weatherData.id} weatherData={weatherData} handleRemoveFav={handleRemoveFav} />
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: "center" }}>
                    <Text>You currently do not have any favourites.</Text>
                </View>
            )}
        </View>
    );
};

const FavItemCard: React.FC<{ weatherData: WeatherData; handleRemoveFav: (weatherData: WeatherData) => void }> = ({ weatherData, handleRemoveFav }) => {
    const { width } = Dimensions.get('window');
    return (
        <View style={{ width: '100%' }}>
            <View>
                <Carousel
                    data={weatherData.photoApiEndpoint}
                    renderItem={({ item }: any) => (
                        <Image style={{ width: '95%', height: 250, borderTopLeftRadius: 16, borderTopRightRadius: 16, }} source={{ uri: item }} />
                    )}
                    sliderWidth={width}
                    itemWidth={width}
                />
                <Text style={{ position: "absolute", backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 5, borderRadius: 16, bottom: 8, right: 0 }}>{weatherData.formatted_address}</Text>
            </View>
            <View style={[styles.rowItem, { marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, }]}>
                <View>
                    <Text style={{ fontWeight: "bold", fontSize: 18, }}>{weatherData.main}</Text>
                    <Text style={{ fontSize: 16, }}>{moment(weatherData.date.toDate().toDateString()).format('DD MMM YYYY')}</Text>
                </View>
                <Text style={{ fontSize: 40, }}>{(weatherData.temp).toFixed(0)}℃</Text>
                <View>
                    <TouchableOpacity style={styles.favBtns} onPress={() => handleRemoveFav(weatherData)}>
                        <Image source={require('../../assets/Icons/removed.png')} style={{ height: 30, width: 30, }} />
                    </TouchableOpacity>
                </View>
            </View>
            {weatherData.main === 'Clear' && <Image source={require('../../assets/Icons/sunny.png')} resizeMode="cover" style={styles.weatherConditionImg} />}
            {weatherData.main === 'Clouds' && <Image source={require('../../assets/Icons/clouds.png')} resizeMode="cover" style={styles.weatherConditionImg} />}
            {weatherData.main === 'Rain' && <Image source={require('../../assets/Icons/rain.png')} resizeMode="cover" style={styles.weatherConditionImg} />}
        </View>
    );
};

export default FavouritesScreen;
