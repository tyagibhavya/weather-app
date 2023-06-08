import express from "express";
import { config } from "dotenv";
import fetch from "node-fetch";
import cors from 'cors';

const app = express();
config({ path: './config.env' });

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.get('/weather/:location/:units', async (req, res) => {
    try {
        const location = req.params.location;
        const units = req.params.units;
        const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=${units}`;
        const API_FORECAST = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&cnt=4&appid=${API_KEY}&units=${units}`;

        const response = await fetch(API_URL);
        const data = await response.json();

        const forecast = await fetch(API_FORECAST);
        const forecastData = await forecast.json();

        if (data.cod === '404') {
            throw new Error('Location not found');
        }

        const weather = {
            description: data.weather[0].description,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            feels: data.main.feels_like,
            wind: data.wind.speed,
            day1: forecastData.list[1].main.temp,
            day1_des: forecastData.list[1].weather[0].main,
            day2: forecastData.list[2].main.temp,
            day2_des: forecastData.list[2].weather[0].main,
            day3: forecastData.list[3].main.temp,
            day3_des: forecastData.list[3].weather[0].main,
        };

        res.json(weather);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is Working on PORT:${PORT}.`);
});
