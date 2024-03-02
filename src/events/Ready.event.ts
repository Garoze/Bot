import { Client, Events } from 'discord.js';

const data = {
  name: Events.ClientReady,
  once: true,
};

const execute = (client: Client) => {
  console.log(`Ready! Logged in as ${client.user?.tag}`);
};

export default { data, execute };
