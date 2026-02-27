import { Router } from 'express';
import { weatherService } from '../services/weather';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/weather/current
router.get('/current', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    let weather;
    if (city) {
      weather = await weatherService.getCurrentWeatherByCity(city as string);
    } else if (lat && lon) {
      weather = await weatherService.getCurrentWeather(
        parseFloat(lat as string),
        parseFloat(lon as string)
      );
    } else {
      return res.status(400).json({ error: 'lat/lon or city parameter required' });
    }

    res.json(weather);
  } catch (error) {
    logger.error('Error in /current:', error);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

// GET /api/v1/weather/forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    let forecast;
    if (city) {
      // Would need to geocode city first
      forecast = await weatherService.getForecast(0, 0);
    } else if (lat && lon) {
      forecast = await weatherService.getForecast(
        parseFloat(lat as string),
        parseFloat(lon as string)
      );
    } else {
      return res.status(400).json({ error: 'lat/lon or city parameter required' });
    }

    res.json(forecast);
  } catch (error) {
    logger.error('Error in /forecast:', error);
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

// GET /api/v1/weather/air_pollution
router.get('/air_pollution', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon parameters required' });
    }

    const pollution = await weatherService.getAirPollution(
      parseFloat(lat as string),
      parseFloat(lon as string)
    );

    res.json(pollution);
  } catch (error) {
    logger.error('Error in /air_pollution:', error);
    res.status(500).json({ error: 'Failed to fetch air pollution data' });
  }
});

export { router as weatherRouter };
export default router;
