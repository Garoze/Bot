import 'dotenv/config';
import { Client, ClientOptions, GatewayIntentBits } from 'discord.js';
import { CommandHandler } from './commands/CommandsHandler';
import { EventHandler } from './events/EventsHandler';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new CommandHandler().loadCommands();
client.events = new EventHandler(client).loadEvents();

client.login(process.env.BOT_TOKEN);

class BotClient extends Client {
	public constructor(options?: ClientOptions) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.MessageContent,
			],
			partials: [],
		});
	}
}
