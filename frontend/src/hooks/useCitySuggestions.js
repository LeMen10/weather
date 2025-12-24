import { useEffect, useState } from 'react';
import axios from 'axios';
import useDebounce from './useDebounce';

export default function useCitySuggestions(city) {
    const [suggestions, setSuggestions] = useState([]);

    // debounce input
    const debouncedCity = useDebounce(city, 400);

    useEffect(() => {
        if (!debouncedCity || debouncedCity.length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchCities = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/cities?q=${debouncedCity}`);
                setSuggestions(res.data);
            } catch (error) {
                setSuggestions([]);
            }
        };

        fetchCities();
    }, [debouncedCity]);

    return suggestions;
}
