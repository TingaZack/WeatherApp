import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import styles from "./styles";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import GetLocation from "react-native-get-location";
import {
    addCityWeatherToFavourites,
    fetchWeatherForecast,
} from "../../features/weather/weatherSlice";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStack } from "../../types";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backgroundStyles: Record<string, { backgroundColor: string; img: any }> = {
    Clear: {
        backgroundColor: "#47AB2F",
        img: require("../../assets/Images/forest_sunny.png"),
    },
    Clouds: {
        backgroundColor: "#54717A",
        img: require("../../assets/Images/forest_cloudy.png"),
    },
    Rain: {
        backgroundColor: "#57575D",
        img: require("../../assets/Images/forest_rainy.png"),
    },
};

const defaultBg = {
    backgroundColor: "whitesmoke",
    img: require("../../assets/Images/2953962.jpg"),
};

type LandingScreenProps = {
    navigation: StackNavigationProp<RootStack, 'Landing'>;
};

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
    // Initialise it with Johhanesburg coords for emulators who might not get user current location
    const [coords, setCoords] = useState({
        latitude: -26.202779126752326,
        longitude: 28.026755592831613,
    });
    const [isLoading, setIsLoading] = useState(true);
    const selector = useAppSelector((state) => state);
    const dispatch = useAppDispatch();

    const dayOfTheWeek = (daysDate: string) => {
        const date = new Date(daysDate);
        const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const dayOfWeekIndex = date.getDay();
        return weekdays[dayOfWeekIndex];
    };

    useEffect(() => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then((location) => {
                setCoords({
                    latitude: location.latitude,
                    longitude: location.longitude,
                });
            })
            .catch((error) => {
                const { code, message } = error;
                console.warn(code, message);
            });
    }, []);

    useEffect(() => {
        dispatch(fetchWeatherForecast(coords))
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
            });
    }, [coords]);

    const handleAddFavourites = async () => {
        try {
            await dispatch(addCityWeatherToFavourites(selector.weather.currentWeather));
            showToast();
        } catch (error) {
            console.error("Error adding favorite item:", error);
        }
    };

    const getWeatherImageSource = () => {
        const weatherMain = selector.weather.currentWeather.main;
        return (backgroundStyles[weatherMain] || defaultBg).img;
    };

    const getWeatherStylesSource = () => {
        const weatherMain = selector.weather.currentWeather.main;
        return (backgroundStyles[weatherMain] || defaultBg);
    };

    const showToast = () => {
        Toast.show({
            type: "success",
            text1: "Favourites",
            text2: "Weather location added to your favorites",
            visibilityTime: 3000,
        });
    };

    const handleGoToFavourites = () => {
        navigation.navigate('Favourites');
    };

    return (
        <>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.weatherContainer}>
                        <Image
                            source={getWeatherImageSource()}
                            resizeMode="cover"
                            style={{ height: '100%', width: '100%' }}
                        />
                        <View style={styles.weatherTemp}>
                            <Text style={styles.tempP}>
                                {(selector.weather.currentWeather.temp).toFixed(0)}°
                            </Text>
                            <Text style={styles.weatherCond}>
                                {selector.weather.currentWeather.main}
                            </Text>
                        </View>
                        <Text style={styles.lastUpdatedText}>
                            Last updated: {selector.weather.lastUpdated}
                        </Text>
                    </View>
                    <View style={[styles.weatherListContainer, getWeatherStylesSource()]}>
                        <View
                            style={[
                                styles.listItemsContainer,
                                {
                                    borderBottomColor: "white",
                                    borderWidth: 1,
                                },
                            ]}
                        >
                            <View>
                                <Text style={[styles.p, { fontWeight: "bold" }]}>
                                    {(selector.weather.currentWeather.min).toFixed(0)}°
                                </Text>
                                <Text style={styles.p}>min</Text>
                            </View>
                            <View>
                                <Text style={[styles.p, { fontWeight: "bold" }]}>
                                    {(selector.weather.currentWeather.temp).toFixed(0)}°
                                </Text>
                                <Text style={styles.p}>Current</Text>
                            </View>
                            <View>
                                <Text style={[styles.p, { fontWeight: "bold" }]}>
                                    {(selector.weather.currentWeather.max).toFixed(0)}°
                                </Text>
                                <Text style={styles.p}>max</Text>
                            </View>
                        </View>

                        <ScrollView>
                            {Object.values(selector.weather.next5Days).map((weather: any) => (
                                <View style={styles.listItemsContainer} key={weather.date}>
                                    <Text style={[styles.p, { flex: 1, textAlign: "left" }]}>
                                        {dayOfTheWeek(weather.date)}
                                    </Text>
                                    {weather.weatherMain === "Clouds" && (
                                        <Image
                                            source={require("../../assets/Icons/partlysunny.png")}
                                            style={styles.weatherIcon}
                                        />
                                    )}
                                    {weather.weatherMain === "Clear" && (
                                        <Image
                                            source={require("../../assets/Icons/clear.png")}
                                            style={styles.weatherIcon}
                                        />
                                    )}
                                    {weather.weatherMain === "Rain" && (
                                        <Image
                                            source={require("../../assets/Icons/rain.png")}
                                            style={styles.weatherIcon}
                                        />
                                    )}
                                    <Text style={[styles.p, { flex: 1, textAlign: "right" }]}>
                                        {(weather.averageTemperature).toFixed(0)}°
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles.favourites}>
                        <TouchableOpacity style={styles.favBtns} onPress={handleAddFavourites}>
                            <Image
                                source={require("../../assets/Icons/red-star.png")}
                                style={styles.favIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.favBtns, { marginLeft: 16 }]}
                            onPress={handleGoToFavourites}
                        >
                            <Image
                                source={require("../../assets/Icons/bookmark.png")}
                                style={styles.favIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    );
};

// const DaysWeatherListItem = () => {
//     return <View style={styles.listItemsContainer} key={weather.date}>
//         <Text style={[styles.p, { flex: 1, textAlign: "left" }]}>
//             {dayOfTheWeek(weather.date)}
//         </Text>
//         {weather.weatherMain === "Clouds" && (
//             <Image
//                 source={require("../../assets/Icons/partlysunny.png")}
//                 style={styles.weatherIcon}
//             />
//         )}
//         {weather.weatherMain === "Clear" && (
//             <Image
//                 source={require("../../assets/Icons/clear.png")}
//                 style={styles.weatherIcon}
//             />
//         )}
//         {weather.weatherMain === "Rain" && (
//             <Image
//                 source={require("../../assets/Icons/rain.png")}
//                 style={styles.weatherIcon}
//             />
//         )}
//         <Text style={[styles.p, { flex: 1, textAlign: "right" }]}>
//             {(weather.averageTemperature).toFixed(0)}°
//         </Text>
//     </View>
// };

export default LandingScreen;