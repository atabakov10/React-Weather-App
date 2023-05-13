import { DateTime } from 'luxon';

const API_KEY = '65b3dd191ecd2ea303e559ab54b0bd3d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';


const getWeatherData = async (infoType, searchParams) => {
    const url = new URL(BASE_URL + '/' + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

    return fetch(url)
        .then(response => response.json());
};

const formatCurrentWeather = (data) => {
    const {
        coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        wind: { speed }
    } = data;

    const { main: details, icon } = weather[0];

    return {
        lat, lon, temp, feels_like,
        temp_min, temp_max, humidity, name,
        dt, country, sunrise, sunset, details, icon, speed
    };
}

const formatForecastWeather = (data) => {
    let { timezone, daily, hourly } = data;
    daily = daily.slice(1, 6).map()
}

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData('weather', searchParams)
        .then(formatCurrentWeather);

    const { lat, lon } = formattedCurrentWeather

    const formattedForecastWeather = await getWeatherData('onecall', {
        lat,
        lon,
        exclude: 'current,minutely,alerts',
        units: searchParams.units
    }).then(formatForecastWeather)

    return formattedCurrentWeather;
};

const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime
.fromSeconds(secs)
.setZone(zone)
.toFormat(format);

export default getFormattedWeatherData;