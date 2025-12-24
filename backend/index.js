import express from "express";
import axios from "axios";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "Thiếu tên thành phố" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: "metric",
        lang: "vi",
      },
    });

    console.log(response)

    const data = response.data;

    res.json({
      city: data.name,
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (err) {
    res.status(500).json({ error: "Không tìm thấy thành phố" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Backend chạy tại http://localhost:${process.env.PORT}`)
);
