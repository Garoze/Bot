import 'dotenv/config';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new Collection();

import * as path from 'path';
import { readdirSync } from 'fs';

const folderPath = path.resolve(path.dirname(''), 'src', 'commands', 'utility');
const commandsFiles = readdirSync(folderPath).filter((file) => file.endsWith('.command.ts'));

console.log(`Debug: \n FolderPath: ${folderPath} - CommandFiles: ${commandsFiles}`);

// TODO: find a better way to deal with the whole file:/// windows thing.
const { default: command } = await import(`file:///${folderPath}/${commandsFiles}`);
if ('data' in command && 'execute' in command) {
	console.log(`Comando existe: ${command.data.name}`);
	client.commands.set(command.data.name, command);
}
else {
	console.log(`[WARN] Bot - The command at ${commandsFiles} is missing a required "data" or "execute" property.`);
}

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
