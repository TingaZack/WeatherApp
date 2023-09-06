type RootStack = {
  Landing: undefined;
  Favourites: undefined;
};

type WeatherData = {
  city: {
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    id: number;
    name: string;
    population: number;
    sunrise: number;
    sunset: number;
    timezone: number;
  };
  date:
    | any
    | {
        nanoseconds: number;
        seconds: number;
      };
  formatted_address: string;
  hello: string;
  id: string;
  main: string;
  max: number;
  min: number;
  photoApiEndpoint: string[];
  temp: number;
};

export type {RootStack, WeatherData};
