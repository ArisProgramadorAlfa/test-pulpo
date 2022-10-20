import { Router } from 'express';
import {
  home,
  getRankingByCountryCodeController
} from '../controller';

const router: Router = Router();

// home
router.get('/', home);

// ranking
router.get('/ranking', getRankingByCountryCodeController);

export { router };