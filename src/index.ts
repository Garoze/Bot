import 'dotenv/config';
import { BotClient } from './client/Client';

BotClient.getSingleton().start();
