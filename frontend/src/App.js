import "./App.css";
import { useState } from "react";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) return;

    try {
      const res = await fetch(`http://localhost:3001/weather?city=${city}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
      }
    } catch {
      setError("Không kết nối được server");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-xl font-semibold mb-4">🌤 Dự báo thời tiết</h2>

        <input
          className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring"
          placeholder="Nhập thành phố"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          onClick={getWeather}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Xem thời tiết
        </button>

        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

        {weather && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{weather.city}</h3>
            <p className="capitalize">{weather.description}</p>
            <p className="text-2xl font-bold">{weather.temp}°C</p>
            <p className="text-sm">Độ ẩm: {weather.humidity}%</p>
            <img
              className="mx-auto"
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
