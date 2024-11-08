export interface PositionProps {
  Latitude: number | undefined;
  Longitude: number | undefined;
  StatusError: Error | undefined;
}

export interface CityProps {
  Version: string;
  Key: string;
  Type: string;
  LocalizedName: string;
}

export interface HeadlineProps {
  EffectiveDate: string;
  EffectiveEpochDate: number;
  Severity: number;
  Text: string;
  Category: string;
  EndDate: string;
  EndEpochDate: number;
}

export interface SunProps {
  Rise: string;
  EpochRise: number;
  Set: string;
  EpochSet: number;
}

export interface MoonProps {
  Rise: string;
  EpochRise: number;
  Set: string;
  EpochSet: number;
  Phase: string;
  Age: number;
}

export interface WeatherParamStringProps {
  Value: string;
  Unit: string;
  UnitType: number;
}

export interface WeatherParamProps {
  Value: number;
  Unit: string;
  UnitType: number;
}

export interface StatisticProps {
  Minimum: number;
  Maximum: number;
  Average: number;
}

export interface FeelTemperatureProps {
  Value: number;
  Unit: string;
  UnitType: number;
  Phrase: string;
}

export interface OrientationProps {
  Degrees: number;
  Localized: string;
  English: string;
}

export interface WindProps {
  Speed: WeatherParamProps;
  Direction: OrientationProps;
}

export interface WeatherConditionProps {
  Icon: number;
  IconPhrase: string;
  HasPrecipitation: boolean;
  ShortPhrase: string;
  LongPhrase: string;
  PrecipitationProbability: number;
  ThunderstormProbability: number;
  RainProbability: number;
  SnowProbability: number;
  IceProbability: number;
  Wind: WindProps;
  WindGust: WindProps;
  TotalLiquid: WeatherParamProps;
  Rain: WeatherParamProps;
  Snow: WeatherParamProps;
  Ice: WeatherParamProps;
  HoursOfPrecipitation: number;
  HoursOfRain: number;
  HoursOfSnow: number;
  HoursOfIce: number;
  CloudCover: number;
  Evapotranspiration: WeatherParamProps;
  SolarIrradiance: WeatherParamProps;
  RelativeHumidity: StatisticProps;
  WetBulbTemperature: {
    Minimum: WeatherParamProps;
    Maximum: WeatherParamProps;
    Average: WeatherParamProps;
  };
  WetBulbGlobeTemperature: {
    Minimum: WeatherParamProps;
    Maximum: WeatherParamProps;
    Average: WeatherParamProps;
  };
}

export interface OneDayForecastProps {
  Date: string;
  EpochDate: number;
  Sun: SunProps;
  Moon: MoonProps;
  Temperature: {
    Minimum: WeatherParamProps;
    Maximum: WeatherParamProps;
  };
  RealFeelTemperature: {
    Minimum: FeelTemperatureProps;
    Maximum: FeelTemperatureProps;
  };
  RealFeelTemperatureShade: {
    Minimum: FeelTemperatureProps;
    Maximum: FeelTemperatureProps;
  };
  HoursOfSun: number;
  DegreeDaySummary: {
    Heating: WeatherParamProps;
    Cooling: WeatherParamProps;
  };
  Day: WeatherConditionProps;
  Night: WeatherConditionProps;
  Sources: string[];
  MobileLink: string;
  Link: string;
}

export interface WeatherForecastProps {
  Headline: HeadlineProps;
  DailyForecasts: OneDayForecastProps[];
}

export type PositionResultCallback = (position: PositionProps) => void;

async function processRequest<T>(request: string): Promise<T> {
  try {
    const response = await fetch(request);
    const dataReceived = await response.json();

    return new Promise<T>((resolve) => resolve(dataReceived));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Promise<T>((_resolve, reject) =>
        reject(`${error.name}: ${error.message}`),
      );
    }
    return new Promise<T>((_resolve, reject) => reject("Unknown error"));
  }
}

export async function getCityByName(cityName: string): Promise<CityProps> {
  const request = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=x5oa58aEBbeBxRJShX32M732tyTeqJPT&q=${cityName}&language=fr-fr&details=false`;

  const dataReceived = await processRequest<CityProps[]>(request);
  if (dataReceived.length === 0) {
    // No city was found matching criteria.
    return new Promise((_resolve, reject) =>
      reject(`No city was found which name matches ${cityName}.`),
    );
  }

  return dataReceived[0] as CityProps;
}

export async function getCityByLocation(
  latitude: number,
  longitude: number,
): Promise<CityProps> {
  const request = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=x5oa58aEBbeBxRJShX32M732tyTeqJPT&q=${latitude},${longitude}&language=fr-fr&details=false&toplevel=true`;

  const dataReceived = await processRequest<CityProps[]>(request);
  if (dataReceived.length === 0) {
    // No city was found matching criteria.
    return new Promise((_resolve, reject) =>
      reject(
        `No city was found around the position (${latitude}, ${longitude}).`,
      ),
    );
  }
  return dataReceived[0] as CityProps;
}

export async function getFiveDaysWeatherForecast(
  cityKey: string,
): Promise<WeatherForecastProps> {
  const request = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=x5oa58aEBbeBxRJShX32M732tyTeqJPT&language=fr-fr&metric=true&details=true`;

  return await processRequest<WeatherForecastProps>(request);
}

export function getCurrentPosition(callback: PositionResultCallback) {
  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
      callback({
        Latitude: position.coords.latitude,
        Longitude: position.coords.longitude,
        StatusError: undefined,
      });
    },
    (positionError: GeolocationPositionError) => {
      callback({
        Latitude: undefined,
        Longitude: undefined,
        StatusError: new Error(positionError.message),
      });
    },
  );
}
