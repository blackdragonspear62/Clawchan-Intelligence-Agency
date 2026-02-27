import { Router } from 'express';
import { satelliteService } from '../services/satellites';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/satellites/above
router.get('/above', async (req, res) => {
  try {
    const { lat, lng, alt, searchRadius, categoryId } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng parameters required' });
    }

    const satellites = await satelliteService.getSatellitesAbove(
      parseFloat(lat as string),
      parseFloat(lng as string),
      alt ? parseFloat(alt as string) : 0,
      searchRadius ? parseInt(searchRadius as string, 10) : 90,
      categoryId ? parseInt(categoryId as string, 10) : 0
    );

    res.json({ above: satellites });
  } catch (error) {
    logger.error('Error in /above:', error);
    res.status(500).json({ error: 'Failed to fetch satellites' });
  }
});

// GET /api/v1/satellites/positions/:satid/:lat/:lng/:alt/:seconds
router.get('/positions/:satid/:lat/:lng/:alt?/:seconds?', async (req, res) => {
  try {
    const { satid, lat, lng, alt, seconds } = req.params;

    const positions = await satelliteService.getSatellitePositions(
      parseInt(satid, 10),
      parseFloat(lat),
      parseFloat(lng),
      alt ? parseFloat(alt) : 0,
      seconds ? parseInt(seconds, 10) : 1
    );

    res.json(positions);
  } catch (error) {
    logger.error('Error in /positions:', error);
    res.status(500).json({ error: 'Failed to fetch satellite positions' });
  }
});

// GET /api/v1/satellites/tle/:satid
router.get('/tle/:satid', async (req, res) => {
  try {
    const { satid } = req.params;
    const tle = await satelliteService.getTle(parseInt(satid, 10));

    res.json(tle);
  } catch (error) {
    logger.error('Error in /tle/:satid:', error);
    res.status(500).json({ error: 'Failed to fetch TLE' });
  }
});

// GET /api/v1/satellites/category/:categoryId
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await satelliteService.getSatellitesByCategory(parseInt(categoryId, 10));

    res.json(result);
  } catch (error) {
    logger.error('Error in /category/:categoryId:', error);
    res.status(500).json({ error: 'Failed to fetch satellites by category' });
  }
});

export { router as satelliteRouter };
export default router;
