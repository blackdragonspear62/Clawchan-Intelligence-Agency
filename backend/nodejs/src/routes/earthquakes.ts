import { Router } from 'express';
import { earthquakeService } from '../services/earthquakes';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/earthquakes/all/:timeRange
router.get('/all/:timeRange', async (req, res) => {
  try {
    const { timeRange } = req.params;
    const { minMagnitude } = req.query;

    let earthquakes;
    switch (timeRange) {
      case 'hour':
        const hourData = await earthquakeService.getAllHour();
        earthquakes = hourData.features;
        break;
      case 'day':
        const dayData = await earthquakeService.getAllDay();
        earthquakes = dayData.features;
        break;
      case 'week':
        const weekData = await earthquakeService.getAllWeek();
        earthquakes = weekData.features;
        break;
      case 'month':
        const monthData = await earthquakeService.getAllMonth();
        earthquakes = monthData.features;
        break;
      default:
        return res.status(400).json({ error: 'Invalid time range. Use: hour, day, week, month' });
    }

    if (minMagnitude) {
      earthquakes = earthquakes.filter(
        (e) => e.properties.mag >= parseFloat(minMagnitude as string)
      );
    }

    res.json(earthquakes);
  } catch (error) {
    logger.error('Error in /all/:timeRange:', error);
    res.status(500).json({ error: 'Failed to fetch earthquakes' });
  }
});

// GET /api/v1/earthquakes/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const earthquake = await earthquakeService.getById(id);

    if (!earthquake) {
      return res.status(404).json({ error: 'Earthquake not found' });
    }

    res.json(earthquake);
  } catch (error) {
    logger.error('Error in /:id:', error);
    res.status(500).json({ error: 'Failed to fetch earthquake' });
  }
});

// GET /api/v1/earthquakes/query
router.get('/query/search', async (req, res) => {
  try {
    const {
      startTime,
      endTime,
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      minMagnitude,
      maxMagnitude,
    } = req.query;

    const result = await earthquakeService.query({
      startTime: startTime as string | undefined,
      endTime: endTime as string | undefined,
      minLatitude: minLatitude ? parseFloat(minLatitude as string) : undefined,
      maxLatitude: maxLatitude ? parseFloat(maxLatitude as string) : undefined,
      minLongitude: minLongitude ? parseFloat(minLongitude as string) : undefined,
      maxLongitude: maxLongitude ? parseFloat(maxLongitude as string) : undefined,
      minMagnitude: minMagnitude ? parseFloat(minMagnitude as string) : undefined,
      maxMagnitude: maxMagnitude ? parseFloat(maxMagnitude as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    logger.error('Error in /query:', error);
    res.status(500).json({ error: 'Failed to query earthquakes' });
  }
});

export { router as earthquakeRouter };
export default router;
