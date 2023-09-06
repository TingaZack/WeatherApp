/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import LandingScreen from './src/screens/LandingScreen';
import { Provider } from 'react-redux';
import store from './src/app/store';
import FavouritesScreen from './src/screens/FavouritesScreen';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStack } from './src/types';
import ToastMessage from 'react-native-toast-message';

const Stack = createStackNavigator<RootStack>();

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PaperProvider>
        {/* <View>
          <LandingScreen />
          <FavouritesScreen />
        </View> */}
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{
              headerTransparent: true,
              headerTitle: '',
            }} />
            <Stack.Screen
              name="Favourites"
              component={FavouritesScreen}
              options={{
                title: 'My Favourites'
              }}
            // options={({ navigation }) => ({
            //   headerTransparent: true,
            //   header: ({ scene }: any) => (
            //     <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
            //       {/* Custom back button */}
            //       <Appbar.BackAction
            //         onPress={() => navigation.goBack()}
            //         color="#fd5154"
            //       />
            //       <Text style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>John Doe</Text>
            //       <Appbar.Action
            //         icon={() => <Ionicons name="call-outline" size={24} color="#fd5154" />}
            //         onPress={() => console.log('hello world')}
            //       />
            //     </Appbar.Header>
            //   ),
            // })}
            />
          </Stack.Navigator>
          <ToastMessage position="bottom" />
        </NavigationContainer>
      </PaperProvider>
    </Provider>

  );
}

export default App;
