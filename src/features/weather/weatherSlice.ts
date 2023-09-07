import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {FIRESTORE_DB} from '../../../firebaseConfig';
import {WeatherData} from '../../types';
import moment from 'moment';

import {REACT_APP_WEATHER_API_KEY, REACT_APP_GOOGLE_MAPS_API_KEY} from '@env';

const apiKey = REACT_APP_GOOGLE_MAPS_API_KEY;

// Async Thunks

export const addCityWeatherToFavourites = createAsyncThunk(
  'favourites/addCityWeatherToFavourites',
  async (favData: any) => {
    const dateString = new Date().toISOString().slice(0, 10);
    // console.log('Add this: ', favData, dateString);

    try {
      await setDoc(
        doc(FIRESTORE_DB, 'favourites', favData.city.name + '_' + dateString),
        {
          ...favData,
          date: Timestamp.now(),
        },
      );

      console.log('Data added to Firestore successfully');
      return 'Data added to Firestore successfully';
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  },
);

export const removeFavourites = createAsyncThunk(
  'favourites/removeFavourites',
  async (id: string) => {
    const favDocPath = `favourites/${id}`;
    const documentRef = doc(FIRESTORE_DB, favDocPath);

    try {
      await deleteDoc(documentRef);
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error deleting document: ', error);
      throw error;
    }
  },
);

export const fetchWeatherFav = createAsyncThunk(
  'favourites/fetchWeatherFav',
  async () => {
    try {
      const favouritesList: any[] = [];
      // let coords = {latitude: 0, longitude: 0};
      const querySnapshot = await getDocs(
        collection(FIRESTORE_DB, 'favourites'),
      );

      await Promise.all(
        querySnapshot.docs.map(async doc => {
          const place_id = await getPlaceId(doc.data().city.name);
          if (place_id) {
            const placeDetails = await getMoreInfo(place_id, {
              latitude: doc.data().city.coord.lat,
              longitude: doc.data().city.coord.lon,
            });
            const photoReference = placeDetails.photos[0].photo_reference;
            const photoApiEndpoint = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
            favouritesList.push({
              ...doc.data(),
              id: doc.id,
              photoApiEndpoint: [photoApiEndpoint],
              formatted_address: placeDetails.formatted_address,
              hello: 'world',
            });
          }
        }),
      );

      return favouritesList;
    } catch (error) {
      console.error('Error fetching favorites: ', error);
      throw error;
    }
  },
);

const getPlaceId = async (placeName: string) => {
  try {
    const placesApiEndpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${apiKey}`;
    const response = await axios.get(placesApiEndpoint);
    const places = response.data.results;
    if (places.length > 0) {
      return places[0].place_id;
    } else {
      console.error('No places found with the given name:', placeName);
      return null;
    }
  } catch (error) {
    console.error('Error searching for places:', error);
    throw error;
  }
};

const getMoreInfo = async (
  place_id: any,
  coords = {latitude: 0, longitude: 0},
) => {
  try {

    const placesDetailsApiEndpoint = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&location=${coords.latitude},${coords.longitude}&key=${apiKey}`;
    const response = await axios.get(placesDetailsApiEndpoint);
    const placeDetails = response.data.result;
    return placeDetails;
  } catch (error) {
    console.error('Error fetching Place Details:', error);
    throw error;
  }
};

export const fetchWeatherForecast = createAsyncThunk(
  'weather/fetchWeatherForecast',
  async (coords: any, {rejectWithValue}) => {
    console.log('Fetching weather forecast: ', coords);
    try {
      const netInfo = await NetInfo.fetch();

      if (netInfo.isConnected) {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${REACT_APP_WEATHER_API_KEY}`,
        );

        const weatherData = response.data;
        await AsyncStorage.setItem(
          'cachedWeatherData',
          JSON.stringify(weatherData),
        );

        return weatherData;
      } else {
        console.log('Network is offline. Using cached data...');
        const cachedData = await AsyncStorage.getItem('cachedWeatherData');
        if (cachedData) {
          const weatherData = JSON.parse(cachedData);
          return weatherData;
        } else {
          return rejectWithValue('No cached data available.');
        }
      }
    } catch (error: any) {
      console.error('Error fetching weather data:', error);
      return rejectWithValue(error.message);
    }
  },
);

// export const fetchWeatherForecast = createAsyncThunk(
//   'weather/fetchWeatherForecast',
//   async (coords: any) => {
//     console.log('Fetching weather forecast: ', coords);
//     try {
//       const netInfo = await NetInfo.fetch();
//       let weatherData;

//       if (netInfo.isConnected) {
//         const response = await axios.get(
//           `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=2b8e99d0e8922ee7bf08de9bee198ac0`,
//         );

//         weatherData = response.data;
//         await AsyncStorage.setItem(
//           'cachedWeatherData',
//           JSON.stringify(weatherData),
//         );
//       } else {
//         console.log('cachedData............................: ')
//         const cachedData = await AsyncStorage.getItem('cachedWeatherData');
//         console.log('cachedData: ', cachedData)
//         if (cachedData) {
//           weatherData = JSON.parse(cachedData);
//         } else {
//           throw new Error('No cached data available.');
//         }
//       }

//       return weatherData;
//     } catch (error) {
//       console.error('Error fetching weather data:', error);
//       throw error;
//     }
//   },
// );

// // Slice

interface WeatherState {
  loading: boolean;
  next5Days: any[];
  favs: WeatherData[];
  currentWeather: {
    temp: number;
    main: string;
    min: number;
    max: number;
    date: string;
  };
  lastUpdated: string;
  error: any;
}

const initialState: WeatherState = {
  loading: false,
  next5Days: [],
  favs: [],
  currentWeather: {
    temp: 0,
    main: '',
    min: 0,
    max: 0,
    date: '',
  },
  lastUpdated: '',
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherData: (state, action: PayloadAction<any>) => {
      const {currentWeather, next5Days, lastUpdated} = action.payload;
      state.currentWeather = currentWeather;
      state.next5Days = next5Days;
      state.lastUpdated = lastUpdated;
      state.loading = false;
      state.error = null;
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      state.favs = state.favs.filter(item => item.id !== idToRemove);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchWeatherForecast.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      fetchWeatherForecast.fulfilled,
      (state, action: PayloadAction<any>) => {
        const actionPayload = action.payload;

        const currentDate = new Date();

        const morningStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          6,
          0,
          0,
        );
        const afternoonStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          12,
          0,
          0,
        );
        const eveningStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          18,
          0,
          0,
        );

        let timeOfDay = '';
        if (currentDate < morningStart) {
          timeOfDay = 'night';
        } else if (currentDate < afternoonStart) {
          timeOfDay = 'morning';
        } else if (currentDate < eveningStart) {
          timeOfDay = 'afternoon';
        } else {
          timeOfDay = 'evening';
        }

        let currentWeather: any = {};
        for (const element of actionPayload.list) {
          const weatherDate = new Date(element.dt_txt);

          if (weatherDate.getDate() === currentDate.getDate()) {
            currentWeather = {
              temp: element.main.temp,
              min: element.main.temp_min,
              max: element.main.temp_max,
              main: element.weather[0].main,
              date: `${weatherDate}`,
            };
            break;
          }
        }

        console.log(
          `Current temperature for ${actionPayload.city.name} ${timeOfDay}: ${currentWeather.temp}°C`,
        );

        // ===================================

        const weatherDataForNext5Days: any = {};

        for (const element of actionPayload.list) {
          const weatherDate = new Date(element.dt_txt)
            .toISOString()
            .slice(0, 10);
          const temperature = element.main.temp;
          const weatherMain = element.weather[0].main;

          const currentDate = new Date();
          for (let i = 0; i < 5; i++) {
            const nextDate = new Date(currentDate);
            nextDate.setDate(currentDate.getDate() + i);
            const nextDateString = nextDate.toISOString().slice(0, 10);

            if (weatherDate === nextDateString) {
              if (!weatherDataForNext5Days[nextDateString]) {
                // console.log('Nex Date: ', nextDateString);
                weatherDataForNext5Days[nextDateString] = {
                  temperatures: [],
                  weatherMain: '',
                  averageTemperature: 0,
                  date: nextDateString,
                };
              }

              weatherDataForNext5Days[nextDateString].temperatures.push(
                temperature,
              );
              weatherDataForNext5Days[nextDateString].weatherMain = weatherMain;
              break;
            }
          }
        }

        for (const date in weatherDataForNext5Days) {
          const temperatures = weatherDataForNext5Days[date].temperatures;
          const sum = temperatures.reduce(
            (acc: any, temp: any) => acc + temp,
            0,
          );
          const averageTemperature = sum / temperatures.length;
          weatherDataForNext5Days[date].averageTemperature = averageTemperature;
        }

        // console.log('Daily Data for the Next 5 Days:', weatherDataForNext5Days);

        let date = new Date();
        // AsyncStorage.setItem(
        //   'cachedWeatherData',
        //   JSON.stringify({
        //     lastUpdated: moment(date).format('DD MMM YYYY hh:mm a'),
        //     currentWeather: Object.assign(currentWeather, {
        //       city: actionPayload.city,
        //     }),
        //     next5Days: weatherDataForNext5Days,
        //   }),
        // )
        //   .then(() => {
        //     console.log('Updated AsyncStorage with fetched data');
        //   })
        //   .catch(error => {
        //     console.log(error.message);
        //   });

        state.loading = false;
        state.next5Days = weatherDataForNext5Days;
        state.lastUpdated = moment(date).format('DD MMM YYYY hh:mm a');
        state.currentWeather = Object.assign(currentWeather, {
          city: actionPayload.city,
        });
        state.error = null;
      },
    );
    // builder.addCase(fetchWeatherForecast.rejected, (state, action) => {
    //   state.loading = false;
    //   state.next5Days = [];
    //   state.error = action.error.message || 'Something went wrong...';
    // });
    // builder.addCase(fetchWeatherFav.pending, state => {
    //   state.loading = true;
    // });
    // builder.addCase(
    //   fetchWeatherFav.fulfilled,
    //   (state, action: PayloadAction<any>) => {
    //     state.loading = false;
    //     state.favs = action.payload;
    //     state.error = '';
    //   },
    // );
    // builder.addCase(fetchWeatherFav.rejected, (state, action) => {
    //   state.loading = false;
    //   state.favs = [];
    //   state.error = action.error.message || 'Something went wrong...';
    // });
    // builder.addCase(removeFavourites.fulfilled, (state, action) => {
    //   state.favs = state.favs.filter(item => item.id !== action.payload);
    // });
    builder
      .addCase(fetchWeatherForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong...';
      })
      .addCase(fetchWeatherFav.pending, state => {
        state.loading = true;
      })
      .addCase(fetchWeatherFav.fulfilled, (state, action) => {
        state.loading = false;
        state.favs = action.payload;
        state.error = '';
      })
      .addCase(fetchWeatherFav.rejected, (state, action) => {
        state.loading = false;
        state.favs = [];
        state.error = action.error.message || 'Something went wrong...';
      })
      .addCase(removeFavourites.fulfilled, (state, action) => {
        const idToRemove: any = action.payload;
        state.favs = state.favs.filter(item => item.id !== idToRemove);
      });
  },
});

export const {setWeatherData, removeFavourite} = weatherSlice.actions;
export default weatherSlice.reducer;
