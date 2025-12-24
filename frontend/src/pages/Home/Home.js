import { useState } from 'react';
import axios from 'axios';
import useCitySuggestions from '~/hooks/useCitySuggestions';

const Home = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = useCitySuggestions(city);

    const getWeather = async (cityName = city) => {
        if (!cityName) return;

        try {
            const res = await axios.get(`http://localhost:3001/weather?city=${cityName}`);

            setWeather(res.data);
            setError('');
            setCity(cityName);
        } catch (err) {
            setWeather(null);
            setError(err.response?.data?.error || 'Không kết nối được server');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-300 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center relative">
                <h2 className="text-xl font-semibold mb-4">🌤 Dự báo thời tiết</h2>

                <input
                    className="w-full px-3 py-2 border rounded mb-1 focus:outline-none focus:ring"
                    placeholder="Nhập thành phố"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                        setShowSuggestions(true);
                    }}
                />

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute left-6 right-6 bg-white border rounded shadow max-h-40 overflow-auto z-10">
                        {suggestions.map((item, index) => (
                            <li
                                key={index}
                                className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-left text-sm"
                                onClick={() => {
                                    getWeather(`${item.name}, ${item.country}`);
                                    setShowSuggestions(false);
                                }}
                            >
                                {item.name}, {item.country}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={() => {
                        getWeather();
                        setShowSuggestions(false);
                    }}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-3"
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

export default Home;
