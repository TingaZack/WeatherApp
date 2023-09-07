# Weather App

This is a React Native weather app that provides current weather conditions and a 5-day forecast for your location.

## Getting Started

Before running the app, make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions.

### Step 1: Start the Metro Server

First, start Metro, the JavaScript bundler that ships with React Native. Open a terminal in your project's root directory and run:

```bash
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, you should see the weather forecast if your forecast and ofcourse you're always welcome to modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Configuration: Using Your Own API Keys
1. Create a .env file in the root directory of your project if it doesn't already exist.
2. Add your API keys to the .env file in the following format:
```bash
REACT_APP_WEATHER_API_KEY="openweathermap_api_key"
REACT_APP_GOOGLE_MAPS_API_KEY="google_maps_api_key"
```
Replace "your_openweathermap_api_key" with your OpenWeatherMap API key, which can be obtained [here](https://home.openweathermap.org/api_keys). Similarly, replace "your_google_maps_api_key" with your Google Maps API key, ensuring that your Google Maps API key has the Google Places API enabled, which can be done [here](https://console.cloud.google.com/apis/library/places-backend.googleapis.com).

3. Make sure to keep your API keys secret and do not share them in your code repositories.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

## Features
1. View current weather conditions.
2. Check a 5-day weather forecast.
3. Add location to your favorites.

# Here are some screenshots of my amazing app:
<img src="./src/assets/Screenshots/Simulator Screenshot - iPhone 14 Pro - 2023-09-07 at 06.01.17.png" alt="Screenshot 1" height="300">
<img src="./src/assets//Screenshots/Simulator Screenshot - iPhone 14 Pro - 2023-09-07 at 20.08.47.png" alt="Screenshot 2" height="300">
<img src="./src/assets/Screenshots/Simulator Screenshot - iPhone 14 Pro - 2023-09-07 at 21.02.23.png" alt="Screenshot 2" height="300">

### Now what?
- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
