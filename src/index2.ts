import 'dotenv/config';
import { ExtendedClient } from './client';

const client = new ExtendedClient();
client.loadCommands();

client.login(process.env.BOT_TOKEN);
