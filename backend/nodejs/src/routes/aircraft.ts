import { Router } from 'express';
import { aircraftService } from '../services/aircraft';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/aircraft/states/all
router.get('/states/all', async (req, res) => {
  try {
    const { lamin, lomin, lamax, lomax } = req.query;
    
    let states;
    if (lamin && lomin && lamax && lomax) {
      states = await aircraftService.getStatesByBounds({
        lamin: parseFloat(lamin as string),
        lomin: parseFloat(lomin as string),
        lamax: parseFloat(lamax as string),
        lomax: parseFloat(lomax as string),
      });
    } else {
      states = await aircraftService.getAllStates();
    }

    res.json({
      time: Math.floor(Date.now() / 1000),
      states,
    });
  } catch (error) {
    logger.error('Error in /states/all:', error);
    res.status(500).json({ error: 'Failed to fetch aircraft states' });
  }
});

// GET /api/v1/aircraft/states/:icao24
router.get('/states/:icao24', async (req, res) => {
  try {
    const { icao24 } = req.params;
    const aircraft = await aircraftService.getAircraftByIcao(icao24);

    if (!aircraft) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }

    res.json(aircraft);
  } catch (error) {
    logger.error('Error in /states/:icao24:', error);
    res.status(500).json({ error: 'Failed to fetch aircraft' });
  }
});

// GET /api/v1/aircraft/track/:icao24
router.get('/track/:icao24', async (req, res) => {
  try {
    const { icao24 } = req.params;
    const { time } = req.query;

    const track = await aircraftService.getAircraftTrack(
      icao24,
      time ? parseInt(time as string, 10) : undefined
    );

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json(track);
  } catch (error) {
    logger.error('Error in /track/:icao24:', error);
    res.status(500).json({ error: 'Failed to fetch aircraft track' });
  }
});

// GET /api/v1/aircraft/flights/:icao24
router.get('/flights/:icao24', async (req, res) => {
  try {
    const { icao24 } = req.params;
    const { begin, end } = req.query;

    if (!begin || !end) {
      return res.status(400).json({ error: 'begin and end parameters required' });
    }

    // This would fetch historical flight data
    // For now, return mock data
    res.json([
      {
        icao24: icao24.toLowerCase(),
        callsign: 'ABC123',
        firstSeen: parseInt(begin as string, 10),
        lastSeen: parseInt(end as string, 10),
        estDepartureAirport: 'KJFK',
        estArrivalAirport: 'KLAX',
      },
    ]);
  } catch (error) {
    logger.error('Error in /flights/:icao24:', error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

export { router as aircraftRouter };
export default router;
