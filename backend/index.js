import express from "express";
import axios from "axios";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "Thiếu tên thành phố" });
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: process.env.WEATHER_API_KEY,
          units: "metric",
          lang: "vi",
        },
      }
    );

    const data = response.data;

    res.json({
      city: data.name,
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (err) {
    if (err.response) {
      if (err.response.status === 404) {
        return res.status(404).json({
          error: "Không tìm thấy thành phố",
        });
      }

      if (err.response.status === 401) {
        return res.status(401).json({
          error: "API key không hợp lệ",
        });
      }
    }

    res.status(500).json({
      error: "Lỗi server, vui lòng thử lại",
    });
  }
});

app.get("/cities", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${process.env.WEATHER_API_KEY}`;

  const response = await axios.get(geoUrl);

  const cities = response.data.map((c) => ({
    name: c.name,
    country: c.country,
  }));

  res.json(cities);
});

app.listen(process.env.PORT, () =>
  console.log(`Backend chạy tại http://localhost:${process.env.PORT}`)
);
