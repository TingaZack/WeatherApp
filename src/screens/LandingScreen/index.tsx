import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addCityWeatherToFavourtes, fetchWeatherForecast } from "../../features/weather/weatherSlice";
import GetLocation from 'react-native-get-location'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setWeatherData } from '../../features/weather/weatherSlice'; // Replace with the actual path
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStack } from "../../types";
import Toast from "react-native-toast-message";

type LandingScreenProps = {
    navigation: StackNavigationProp<RootStack, 'Landing'>;
};

export const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
    const cloudyBg = {
        styles: { backgroundColor: '#54717A', },
        img: require('../../assets/Images/forest_cloudy.png'),
    };
    const rainyBg = {
        styles: { backgroundColor: '#57575D', },
        img: require('../../assets/Images/forest_rainy.png'),
    };
    const sunnyBg = {
        styles: { backgroundColor: '#47AB2F', },
        img: require('../../assets/Images/forest_sunny.png'),
    };

    const defaultBg = {
        styles: { backgroundColor: 'whitesmoke', },
        img: require('../../assets/Images/2953962.jpg'),
    };

    const [coords, setCoords] = useState({ latitude: -26.248387319508478, longitude: 27.853800034649797 });
    const [weatherCondition, setWeatherCondition] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const selector = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    const dayOfTheWeek = (daysDate: string) => {
        const date = new Date(daysDate);
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeekIndex = date.getDay();
        const dayOfWeek = weekdays[dayOfWeekIndex];
        return dayOfWeek;
    };

    const WeatherStyle = (condition: string) => {
        switch (condition) {
            case 'Clear':
                setWeatherCondition(sunnyBg);
                break;
            case 'Clouds':
                setWeatherCondition(cloudyBg);
                break;
            case 'Rain':
                setWeatherCondition(rainyBg);
                break;
            default:
                setWeatherCondition(sunnyBg);
                break;
        }
    }

    // useEffect(() => {
    //     GetLocation.getCurrentPosition({
    //         enableHighAccuracy: true,
    //         timeout: 60000,
    //     })
    //         .then(location => {
    //             setCoords({ latitude: location.latitude, longitude: location.longitude })
    //         })
    //         .catch(error => {
    //             const { code, message } = error;
    //             console.warn(code, message);
    //         })
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const location = await GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 60000,
                });
                setCoords({ latitude: location.latitude, longitude: location.longitude });

                // Fetch weather data based on location
                const weatherData = await dispatch(fetchWeatherForecast({
                    latitude: location.latitude,
                    longitude: location.longitude,
                }));

                // Set the weather condition based on the fetched data
                WeatherStyle(selector.weather.currentWeather.main);

                setIsLoading(false); // Mark loading as complete
            } catch (error) {
                console.error('Error fetching weather data:', error);
                WeatherStyle(selector.weather.currentWeather.main);
                setIsLoading(false); // Mark loading as complete even if there's an error
            }
        };

        // Call the async function when the component mounts
        fetchData();
    }, []);

    useEffect(() => {

        const fetchData = async () => {
            try {
                // Perform asynchronous operation, e.g., fetch data
                await WeatherStyle(selector.weather.currentWeather.main);
                // Do something with the result
            } catch (error) {
                // Handle errors
                console.log('Error: ', error);
            }
        };
        fetchData();
        dispatch(fetchWeatherForecast({ latitude: coords.latitude, longitude: coords.longitude }))
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching weather data:', error);
                setIsLoading(false);
            });
    }, []);

    const handleAddFavourites = async () => {
        try {
            await dispatch(addCityWeatherToFavourtes(selector.weather.currentWeather));
            showToast();
        } catch (error) {
            console.error('Error adding favorite item:', error);
        }
    };

    const handleGoToFavourites = () => {
        navigation.navigate('Favourites');
    };

    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Favourites',
            text2: 'Weather location added to your favorites',
            visibilityTime: 3000,
        });
    };

    return (
        <>
            {isLoading ? <View style={{ height: '100%', justifyContent: "center", alignItems: "center", }}>
                <ActivityIndicator size="large" color="blue" />
            </View> : <View style={styles.container}>
                <View style={styles.weatherContainer}>
                    <Image source={  weatherCondition.img} resizeMode="cover" style={{ height: '100%', width: '100%', }} />
                    <View style={styles.weatherTemp}>
                        <Text style={styles.tempP}>{(selector.weather.currentWeather.temp).toFixed(1)}°</Text>
                        <Text style={styles.weatherCond}>{selector.weather.currentWeather.main}</Text>
                    </View>
                    <Text style={{ color: 'white', position: 'absolute', bottom: 8, right: 16, }}>Last updated: {selector.weather.lastUpdated}</Text>
                </View>
                <View style={[styles.weatherListContainer, weatherCondition.styles]}>
                    <View style={[styles.listItemsContainer, {
                        borderBottomColor: 'white',
                        borderWidth: 1,
                    }]}>
                        <View>
                            <Text style={[styles.p, { fontWeight: "bold" }]}>{(selector.weather.currentWeather.min).toFixed(1)}°</Text>
                            <Text style={styles.p}>min</Text>
                        </View>
                        <View>
                            <Text style={[styles.p, { fontWeight: "bold" }]}>{(selector.weather.currentWeather.temp).toFixed(1)}°</Text>
                            <Text style={styles.p}>Current</Text>
                        </View>
                        <View>
                            <Text style={[styles.p, { fontWeight: "bold" }]}>{(selector.weather.currentWeather.max).toFixed(1)}°</Text>
                            <Text style={styles.p}>max</Text>
                        </View>
                    </View>

                    <ScrollView>
                        {
                            Object.values(selector.weather.next5Days).map((weather: any) => (
                                <View style={styles.listItemsContainer} key={weather.date}>
                                    <Text style={[styles.p, { flex: 1, textAlign: 'left' }]}>{dayOfTheWeek(weather.date)}</Text>
                                    {weather.weatherMain === 'Clouds' && <Image source={require('../../assets/Icons/partlysunny.png')} style={{ height: 30, width: 30, }} />}
                                    {weather.weatherMain === 'Clear' && <Image source={require('../../assets/Icons/clear.png')} style={{ height: 30, width: 30, }} />}
                                    {weather.weatherMain === 'Rain' && <Image source={require('../../assets/Icons/rain.png')} style={{ height: 30, width: 30, }} />}
                                    <Text style={[styles.p, { flex: 1, textAlign: 'right' }]}>{(weather.averageTemperature).toFixed(1)}°</Text>
                                </View>
                            ))
                        }
                    </ScrollView>

                </View>
                <View style={styles.favourites}>
                    <TouchableOpacity style={styles.favBtns} onPress={handleAddFavourites}>
                        <Image source={require('../../assets/Icons/red-star.png')} style={{ height: 30, width: 30, }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.favBtns, { marginLeft: 16, }]} onPress={handleGoToFavourites}>
                        <Image source={require('../../assets/Icons/bookmark.png')} style={{ height: 30, width: 30, }} />
                    </TouchableOpacity>
                </View>
            </View>}
        </>
    )
};

export default LandingScreen;
