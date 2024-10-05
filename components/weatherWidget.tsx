"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

// Define WeatherData interface
interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

// Define TemperatureMessages function
function TemperatureMessage(temperature: number, unit: string): string {
  if (unit === "C") {
    if (temperature < 0) {
      return `It's freezing at ${temperature}°C! Wrap up!`;
    } else if (temperature < 10) {
      return `It's quite cold at ${temperature}°C. Put on warm clothing.`;
    } else if (temperature < 20) {
      return `The temperature is ${temperature}°C. Ideal for a light jacket.`;
    } else if (temperature < 30) {
      return `It's a pleasant ${temperature}°C. Relish the nice weather.`;
    } else {
      return `It's hot at ${temperature}°C. Stay hydrated!`;
    }
  } else {
    return `${temperature}°${unit}`;
  }
}

function getWeatherMessage(description: string): string {
  switch (description.toLowerCase()) {
    case "sunny":
      return "It's a beautiful sunny day!";
    case "partly cloudy":
      return "Expect some clouds and sunshine.";
    case "cloudy":
      return "It's cloudy today.";
    case "overcast":
      return "The sky is overcast.";
    case "rain":
      return "Don't forget your umbrella! It's raining.";
    case "thunderstorm":
      return "Thunderstorms are expected today.";
    case "snow":
      return "Bundle up! It's snowing.";
    case "mist":
      return "It's misty outside.";
    case "fog":
      return "Be careful, there's fog outside.";
    default:
      return description;
  }
}

function getLocationMessage(location: string): string {
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 6;
  return `${location} ${isNight ? "at Night" : "During the Day"}`;
}

// Main WeatherWidget component
export default function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Invalid location. Please try again");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`);
    if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    // ... handle data
    } catch (error) {
    console.error("Error fetching weather data:", error);
    setError("City not recognized. Please try again.");
    setWeather(null);
    }
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.log("Error fetching weather data:", error);
      setError("City not recognized. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <Card className="bg-white w-full max-w-md mx-auto text-center border-black shadow-xl">
        <CardHeader>
          <CardTitle className="font-bold text-lg tracking-normal">WEATHER WIDGET</CardTitle>
          <CardDescription className=" font-medium tracking-wide">
            Find out the current weather in your city.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              className="rounded-xl shadow-lg"
            />
            <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-gray-600 shadow-lg rounded-3xl">
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500 font-medium">{error}</div>}
          {weather && (
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2">
                <ThermometerIcon className="w-6 h-6" />
                {TemperatureMessage(weather.temperature, weather.unit)}
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6" />
                <div>{getWeatherMessage(weather.description)}</div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6" />
                <div>{getLocationMessage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
