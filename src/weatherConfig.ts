export type WeatherConditionKey = 'Clear' | 'Clouds' | 'Rain' | 'Default';

const WeatherConditions: Record<WeatherConditionKey, { backgroundColor: string; imageSource: any }> = {
    Clear: {
      backgroundColor: '#47AB2F',
      imageSource: require('../../assets/Images/forest_sunny.png'),
    },
    Clouds: {
      backgroundColor: '#54717A',
      imageSource: require('../../assets/Images/forest_cloudy.png'),
    },
    Rain: {
      backgroundColor: '#57575D',
      imageSource: require('../../assets/Images/forest_rainy.png'),
    },
    Default: {
      backgroundColor: 'whitesmoke',
      imageSource: require('../../assets/Images/2953962.jpg'),
    },
  };
  
  export default WeatherConditions;
  