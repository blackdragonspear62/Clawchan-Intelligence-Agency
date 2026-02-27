import { Router } from 'express';
import { cryptoService } from '../services/crypto';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/crypto/markets
router.get('/markets', async (req, res) => {
  try {
    const { vsCurrency, perPage, page } = req.query;

    const markets = await cryptoService.getCoinsMarkets(
      (vsCurrency as string) || 'usd',
      perPage ? parseInt(perPage as string, 10) : 100,
      page ? parseInt(page as string, 10) : 1
    );

    res.json(markets);
  } catch (error) {
    logger.error('Error in /markets:', error);
    res.status(500).json({ error: 'Failed to fetch crypto markets' });
  }
});

// GET /api/v1/crypto/coin/:id
router.get('/coin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const coin = await cryptoService.getCoinById(id);

    res.json(coin);
  } catch (error) {
    logger.error('Error in /coin/:id:', error);
    res.status(500).json({ error: 'Failed to fetch coin details' });
  }
});

// GET /api/v1/crypto/global
router.get('/global', async (req, res) => {
  try {
    const globalData = await cryptoService.getGlobalData();

    res.json(globalData);
  } catch (error) {
    logger.error('Error in /global:', error);
    res.status(500).json({ error: 'Failed to fetch global crypto data' });
  }
});

// GET /api/v1/crypto/trending
router.get('/trending', async (req, res) => {
  try {
    const trending = await cryptoService.getTrendingCoins();

    res.json(trending);
  } catch (error) {
    logger.error('Error in /trending:', error);
    res.status(500).json({ error: 'Failed to fetch trending coins' });
  }
});

export { router as cryptoRouter };
export default router;
