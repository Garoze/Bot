import { Events } from 'discord.js';
import { EventDecorator } from './EventDecorator';
import { EventInterface, EventProps } from 'src/@types/event';

// const data = {
//   name: Events.ClientReady,
//   once: true,
// };

// const execute = (client: Client) => {
//   console.log(`Ready! Logged in as ${client.user?.tag}`);
// };

@EventDecorator
export class ReadyEvent implements EventInterface<> {
  props = {
    name: Events.ClientReady,
    o,
  };

  execute(...args: any) {
    throw new Error('Method not implemented.');
  }
}

// export default { data, execute };
