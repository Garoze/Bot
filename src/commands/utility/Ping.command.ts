import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!');

const execute = async (interaction: ChatInputCommandInteraction) => {
	// interaction.user is the object representing the User who ran the command
	// interaction.member is the GuildMember object, which represents the user in the specific guild
	await interaction.reply('Pong! 🏓');
};

export default { data, execute };
