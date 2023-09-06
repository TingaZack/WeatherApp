import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchWeatherFav, removeFavourites } from "../../features/weather/weatherSlice";
import axios from "axios";
import Carousel from 'react-native-snap-carousel';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { Appbar } from "react-native-paper";

import moment from "moment";
import { WeatherData } from "../../types";
import Toast from "react-native-toast-message";

const FavouritesScreen: React.FC = () => {

    const selector = useAppSelector(state => state)
    const dispatch = useAppDispatch();
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [placePhotos, setPlacePhotos] = useState<string[]>([]);
    const [weatherIcon, setWeatherIcon] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);


    const { width } = Dimensions.get('window');

    const cloudyIcon = {
        img: require('../../assets/Images/forest_cloudy.png'),
    };
    const rainyIcon = {
        img: require('../../assets/Images/forest_rainy.png'),
    };
    const sunnyIcon = {
        img: require('../../assets/Images/forest_sunny.png'),
    };

    const defaultIcon = {
        img: require('../../assets/Images/2953962.jpg'),
    };


    const weatherIconChange = async (condition: string) => {
        // let condition = 'Clouds';
        console.log('Condotion condition: ', condition)
        switch (condition) {
            case 'Clear':
                await setWeatherIcon(sunnyIcon.img);
                break;
            case 'Clouds':
                await setWeatherIcon(cloudyIcon.img);
                break;
            case 'Rain':
                await setWeatherIcon(rainyIcon.img);
                break;
            default:
                // await setWeather(defaultBg);
                await setWeatherIcon(sunnyIcon.img);
                break;
        }
    }

    useEffect(() => {
        dispatch(fetchWeatherFav()).then(() => {
            setLoading(false); // Turn off the loader when data is fetched
        });;
        // getNearbyPlaces();
        // getPlaceID();
        selector.weather.favs.map(weatherData => {
            console.log('weatherData check: ', weatherData)
        })
    }, [dispatch]);

    const apiKey = 'AIzaSyDNtoaUMsq6263o_EKgAUtVfgUwhX4T3hk';

    const getPlaceID = async () => {

        // Your Google Places API key

        // Define the Google Places API endpoint for Place Details
        // const placesApiEndpoint = `https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJrTLr-GyuEmsRBfy61i59si0&key=${apiKey}`;

        try {
            const placesApiEndpoint = await `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${'Tembisa'}&key=${apiKey}`;
            const response = await axios.get(placesApiEndpoint);
            const places = await response.data.results;
            // console.log('PLaces: ', JSON.stringify(places[0].place_id));
            await getMoreInfo(places[0].place_id);
        } catch (error) {
            console.error('Error searching for places:', error);
        }
    }

    const getMoreInfo = async (place_id: string) => {
        // Location coordinates (latitude and longitude)
        const latitude = -26.241585273046958; // Replace with your latitude
        const longitude = 27.860338567886057; // Replace with your longitude

        const placesDetailsApiEndpoint = await `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&location=${latitude},${longitude}&key=${apiKey}`;
        await axios
            .get(placesDetailsApiEndpoint)
            .then((response) => {
                // Handle the response data here
                const placeDetails = response.data.result;
                // console.log('Place Details:', placeDetails);
                // Check if the place has photos
                if (placeDetails.photos && placeDetails.photos.length > 0) {
                    const photoReference = placeDetails.photos[0].photo_reference;
                    const photoApiEndpoint = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
                    setPlacePhotos([photoApiEndpoint]);
                } else {
                    setPlacePhotos([]);
                }

                setSelectedPlace(placeDetails);
            })
            .catch((error) => {
                console.error('Error fetching Place Details:', error);
            });
    };

    const handleRemoveFav = async (weatherData: WeatherData) => {
        // console.log('Hello from', weatherData.id)
        // await dispatch(removeFavourites(weatherData.id))

        setDeleting(true); // Show the delete loader

        try {
            await dispatch(removeFavourites(weatherData.id)).then(() => {
                showToast()
            });
            // If deletion is successful, the loader will be hidden in the .then block
        } catch (error) {
            console.error('Error removing favorite item:', error);
        } finally {
            setDeleting(false); // Hide the delete loader whether deletion was successful or not
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

    const renderItem = ({ item, index }: any) => {
        return (
            <View>
                <Image style={{ width: '95%', height: 250, borderTopLeftRadius: 16, borderTopRightRadius: 16, }} source={{ uri: item }} />
            </View>
        );
    };

    return (
        <View >
            {/* <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Content title="My Favourites" />
                <Appbar.Action icon="calendar" onPress={() => { }} />
                <Appbar.Action icon="magnify" onPress={() => { }} />
            </Appbar.Header> */}

            {loading ? <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <ActivityIndicator size="large" color="blue" />
            </View> : deleting ? (
                <ActivityIndicator size="large" color="blue" /> // Show the delete loader
            ) :
                selector.weather.favs.length > 0 ? <View style={styles.container}>

                    <ScrollView>
                        {selector.weather.favs.map(weatherData => (
                            <View style={{ width: '100%' }}>
                                {/* <Image source={{ uri: 'https://static.rondreis.nl/rondreis-storage-production/media-3747-soweto-jpg/w1800xh1200/eyJidWNrZXQiOiJyb25kcmVpcy1zdG9yYWdlLXByb2R1Y3Rpb24iLCJrZXkiOiJtZWRpYVwvMzc0N1wvc293ZXRvLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTgwMCwiaGVpZ2h0IjoxMjAwfX19' }} resizeMode="cover" style={{ height: 250, borderTopLeftRadius: 16, borderTopRightRadius: 16, width: '100%' }} /> */}
                                <View>
                                    {/* {placePhotos.map((photoApiEndpoint, index) => ( */}
                                    <Carousel
                                        data={weatherData.photoApiEndpoint}
                                        renderItem={renderItem}
                                        sliderWidth={width}
                                        itemWidth={width}
                                    />
                                    {/* ))} */}
                                    <Text style={{ position: "absolute", backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 5, borderRadius: 16, bottom: 8, right: 0 }}>{weatherData.formatted_address}</Text>
                                </View>

                                <View style={[styles.rowItem, { marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, }]}>
                                    <View>
                                        <Text style={{ fontWeight: "bold", fontSize: 18, }}>{weatherData.main}</Text>
                                        <Text style={{ fontSize: 16, }}>{moment(weatherData.date.toDate().toDateString()).format('DD MMM YYYY')}</Text>
                                    </View>
                                    <Text style={{ fontSize: 40, }}>{(weatherData.temp).toFixed(0)}℃</Text>
                                    <View>
                                        {/* <TouchableOpacity style={styles.favButton} onPress={() => handleRemoveFav(weatherData)}>
                                            <AntDesign name="customerservice" size={25} color={'black'} />
                                        </TouchableOpacity> */}
                                        <TouchableOpacity style={styles.favBtns} onPress={() => handleRemoveFav(weatherData)}>
                                            <Image source={require('../../assets/Icons/removed.png')} style={{ height: 30, width: 30, }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {weatherData.main === 'Clear' && <Image source={require('../../assets/Icons/sunny.png')} resizeMode="cover" style={styles.weatherConditionImg} />}
                                {weatherData.main === 'Clouds' && <Image source={require('../../assets/Icons/clouds.png')} resizeMode="cover" style={styles.weatherConditionImg} />}
                                {weatherData.main === 'Rain' && <Image source={require('../../assets/Icons/rain.png')} resizeMode="cover" style={styles.weatherConditionImg} />}
                            </View>
                        ))}
                    </ScrollView>


                    {/* <ScrollView>
                    {selector.weather.favs.map(data => (
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.rowItem}>
                                <View>
                                    <Text style={{ fontWeight: "bold", fontSize: 18, }}>{data.city.name}</Text>
                                    <Text style={{ fontSize: 16 }}>May, 29</Text>
                                </View>
                                <Text style={{ fontSize: 40, }}>{(data.temp).toFixed(1)}℃</Text>
                                <Text>Clouds</Text>
                            </View>
                            {selectedPlace && (
                                <View>
                                    <Text>Selected Place Details:</Text>
                                    <Text>Name: {selectedPlace.name}</Text>
                                    <Text>Address: {selectedPlace.formatted_address}</Text>
                                    {placePhotos.map((photoApiEndpoint, index) => (
                                        <Image
                                            key={index}
                                            style={{ width: 400, height: 300 }}
                                            source={{ uri: photoApiEndpoint }}
                                        />
                                    ))}
                                </View>
                            )}

                        </View>

                    ))}
                </ScrollView> */}

                </View> :
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: "center" }}>
                        <Text>You currently do not have any favourites.</Text>
                    </View>
            }
        </View>
    )
};
export default FavouritesScreen;