import { Router } from 'express';
import {
  home
} from '../controller/home.controller';

const router: Router = Router();

// home
router.get('/', home);

export { router };