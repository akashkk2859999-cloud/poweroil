import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import { getCampaignSettings, updateSettings } from './settings.service';

const router = Router();

router.get('/', requireAuth, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await getCampaignSettings();
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
});

router.put('/', requireAuth, requireRole('SUPER_ADMIN', 'CAMPAIGN_MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateSettings(req.body);
    const settings = await getCampaignSettings();
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
});

export default router;
