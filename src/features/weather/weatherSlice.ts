import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current,
} from '@reduxjs/toolkit';
import axios from 'axios';
import {FIRESTORE_DB} from '../../../firebaseConfig';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

type InitialState = {
  loading: boolean;
  next5Days: any[];
  favs: any[];
  currentWeather: {
    temp: number;
    main: string;
    min: number;
    max: number;
    date: string;
  };
  lastUpdated: string;
  error: any;
};

const initialState: InitialState = {
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

// export const fetchWeatherForecast = createAsyncThunk(
//   'weather/fetchWeatherForecast',
//   () => {
//     return console.log('Hello weather forecast!');
//   },
// );
const apiKey = 'AIzaSyDNtoaUMsq6263o_EKgAUtVfgUwhX4T3hk';

export const addCityWeatherToFavourtes = createAsyncThunk(
  'favourites/addCityWeatherToFavourtes',
  async (favData: any) => {
    const nextDateString = new Date().toISOString().slice(0, 10);
    console.log('ADd this: ', favData.city.name + '_' + nextDateString);

    try {
      await setDoc(
        doc(
          FIRESTORE_DB,
          'favourites',
          favData.city.name + '_' + nextDateString,
        ),
        Object.assign({}, favData, {
          date: Timestamp.now(),
        }),
      ).then(() => {
        console.log('Data added to Firestore successfully');
        return 'Data added to Firestore successfully';
      });
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  },
);

export const fetchWeatherFav = createAsyncThunk(
  'favourites/fetchWeatherFav',
  async () => {
    let favouritesList: any[] = [];
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'favourites'));

    // Define a function to create a modified data object
    const modifyData = (originalData: any, additionalProperties: any) => {
      // Create a new object with the original data
      const newData = {...originalData};
      // Add additional properties
      Object.assign(newData, additionalProperties);
      return newData;
    };

    await Promise.all(
      querySnapshot.docs.map(async doc => {
        console.log(doc.id, ' => ', doc.data().city.name);
        const place_id = await getPlaceID(doc.data().city.name);

        if (place_id) {
          console.log('place_iding', place_id);
          const latitude = -26.241585273046958; // Replace with your latitude
          const longitude = 27.860338567886057; // Replace with your longitude

          const placesDetailsApiEndpoint = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&location=${latitude},${longitude}&key=${apiKey}`;

          try {
            const response = await axios.get(placesDetailsApiEndpoint);
            const placeDetails = response.data.result;
            // console.log('objects placedeati: ', placeDetails);

            const photoReference = placeDetails.photos[0].photo_reference;
            const photoApiEndpoint = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

            // Create a modified data object with additional properties
            const modifiedData = modifyData(doc.data(), {
              id: doc.id,
              photoApiEndpoint: [photoApiEndpoint],
              formatted_address: placeDetails.formatted_address,
              hello: 'world',
            });

            favouritesList.push(modifiedData);
          } catch (error) {
            console.error('Error fetching Place Details:', error);
          }
        }
      }),
    );

    return favouritesList;
  },
);

// export const fetchWeatherFav = createAsyncThunk(
//   'favourites/fetchWeatherFav',
//   async () => {
//     let favouritesList: any[] = [];
//     // let teest: any[] = [];
//     const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'data'));
//     await querySnapshot.forEach(async doc => {
//       console.log(doc.id, ' => ', doc.data().city.name);
//       await getPlaceID(doc.data().city.name).then(async place_id => {
//         await console.log('place_iding', place_id);
//         // await getMoreInfo(place_id).then(
//         //   async placeDetails => {
//         //     // const photoReference = placeDetails.photos[0].photo_reference;
//         //     await console.log('Majir: ', placeDetails);
//         //   },
//         // );
//         const latitude = -26.241585273046958; // Replace with your latitude
//         const longitude = 27.860338567886057; // Replace with your longitude

//         const placesDetailsApiEndpoint =
//           await `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&location=${latitude},${longitude}&key=${apiKey}`;
//         await axios
//           .get(placesDetailsApiEndpoint)
//           .then(async response => {
//             // Handle the response data here
//             const placeDetails = response.data.result;
//             console.log(
//               'chekkking on place: ',
//               placeDetails.photos[0].photo_reference,
//             );
//             favouritesList.push(Object.assign(doc.data(), {id: doc.id}));

//             //
//             // // console.log('Place Details:', placeDetails);
//             // // Check if the place has photos
//             // if (placeDetails.photos && placeDetails.photos.length > 0) {
//             //   const photoReference = placeDetails.photos[0].photo_reference;
//             //   const photoApiEndpoint = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
//             //   // favouritesList.push(Object.assign(doc.data(),  JSON.stringify({
//             //   //   photoApiEndpoint,
//             //   //   formatted_address: placeDetails.formatted_address,
//             //   // }), {}))
//             //   console.log(
//             //     'photoApiEndpoint" ',
//             //     Object.assign(
//             //       doc.data(),
//             //       {id: doc.id},
//             //       {
//             //         photoApiEndpoint,
//             //         formatted_address: placeDetails.formatted_address,
//             //         hello: 'world',
//             //       },
//             //     ),
//             //   );
//             //   teest.push(
//             //     Object.assign(
//             //       doc.data(),
//             //       {id: doc.id},
//             //       {
//             //         photoApiEndpoint,
//             //         formatted_address: placeDetails.formatted_address,
//             //         hello: 'world',
//             //       },
//             //     ),
//             //   );
//             //   //   setPlacePhotos([photoApiEndpoint]);
//             //   // } else {
//             //   //   setPlacePhotos([]);
//             // }

//             // setSelectedPlace(placeDetails);
//           })
//           .catch(error => {
//             console.error('Error fetching Place Details:', error);
//           });
//       });
//     });
//     return favouritesList;
//   },
// );

const getPlaceID = async (placeName: string) => {
  try {
    const placesApiEndpoint =
      await `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${apiKey}`;
    const response = await axios.get(placesApiEndpoint);
    const places = await response.data.results;
    console.log('PLaces ifff: ', JSON.stringify(places[0].place_id));
    return places[0].place_id;

    // await getMoreInfo(places[0].place_id);
  } catch (error) {
    console.error('Error searching for places:', error);
  }
};

const getMoreInfo = async (place_id: any) => {
  // Location coordinates (latitude and longitude)
  const latitude = -26.241585273046958; // Replace with your latitude
  const longitude = 27.860338567886057; // Replace with your longitude

  const placesDetailsApiEndpoint =
    await `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&location=${latitude},${longitude}&key=${apiKey}`;
  await axios
    .get(placesDetailsApiEndpoint)
    .then(async response => {
      // Handle the response data here
      const placeDetails = response.data.result;
      console.log('chekkking on place: ', placeDetails);
      return await response.data.result;

      //
      // console.log('Place Details:', placeDetails);
      // Check if the place has photos
      // if (placeDetails.photos && placeDetails.photos.length > 0) {
      //   const photoReference = placeDetails.photos[0].photo_reference;
      //   const photoApiEndpoint = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
      //   setPlacePhotos([photoApiEndpoint]);
      // } else {
      //   setPlacePhotos([]);
      // }

      // setSelectedPlace(placeDetails);
    })
    .catch(error => {
      console.error('Error fetching Place Details:', error);
    });
};

export const fetchWeatherForecast = createAsyncThunk(
  'weather/fetchWeatherForecast',
  async (coords: any) => {
    try {
      // Check for internet connection
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        // If there is an internet connection, fetch data from the API
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=2b8e99d0e8922ee7bf08de9bee198ac0`,
        );
        const weatherData = response.data;

        // Cache the fetched data in AsyncStorage
        await AsyncStorage.setItem(
          'cachedWeatherData',
          JSON.stringify(weatherData),
        );

        return weatherData;
      } else {
        // If there is no internet connection, load cached data from AsyncStorage
        const cachedData = await AsyncStorage.getItem('cachedWeatherData');
        if (cachedData) {
          const weatherData = JSON.parse(cachedData);
          return weatherData;
        } else {
          // Handle the case where there is no cached data
          throw new Error('No cached data available.');
        }
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },
);

// export const fetchWeatherForecast = createAsyncThunk(
//   'weather/fetchWeatherForecast',
//   async (coords: any) => {
//     return await axios
//       .get(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=2b8e99d0e8922ee7bf08de9bee198ac0`,
//       )
//       .then(response => response.data);
//   },
// );

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherData: (state, action) => {
      state.currentWeather = action.payload.currentWeather;
      state.next5Days = action.payload.next5Days;
      state.lastUpdated = action.payload.lastUpdated;
      state.loading = false;
      state.error = null;
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
                console.log('Nex Date: ', nextDateString);
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
        AsyncStorage.setItem(
          'cachedWeatherData',
          JSON.stringify({
            lastUpdated: date,
            currentWeather: Object.assign(currentWeather, {
              city: actionPayload.city,
            }),
            next5Days: weatherDataForNext5Days,
          }),
        )
          .then(() => {
            console.log('Updated AsyncStorage with fetched data');
          })
          .catch(error => {
            console.log(error.message);
          });

        state.loading = false;
        state.next5Days = weatherDataForNext5Days;
        state.lastUpdated = date.toLocaleDateString();
        state.currentWeather = Object.assign(currentWeather, {
          city: actionPayload.city,
        });
        state.error = null;
      },
    );
    builder.addCase(fetchWeatherForecast.rejected, (state, action) => {
      state.loading = false;
      state.next5Days = [];
      state.error = action.error.message || 'Something went wrong...';
    });
    builder.addCase(fetchWeatherFav.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      fetchWeatherFav.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.favs = action.payload;
        state.error = '';
      },
    );
    builder.addCase(fetchWeatherFav.rejected, (state, action) => {
      state.loading = false;
      state.favs = [];
      state.error = action.error.message || 'Something went wrong...';
    });
  },
});

export const {setWeatherData} = weatherSlice.actions;
export default weatherSlice.reducer;
