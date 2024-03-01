import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { CommandHandler } from './commands/CommandHandler';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new CommandHandler().loadCommands();

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const cmd = interaction.client.commands.get(interaction.commandName);

	if (!cmd) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await cmd.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.BOT_TOKEN);
