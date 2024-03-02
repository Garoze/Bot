import { Events } from 'discord.js';
import { EventInterface, EventProps, EventTypes } from 'src/@types/event';
import { EventDecorator } from './EventDecorator';

@EventDecorator
export class ReadyEvent<Key extends Events> implements EventInterface<Key> {
  props: EventProps = {
    name: Events.ClientReady,
    once: true,
  };
  // public eventKey: EventTypes<Events.ClientReady> = Events.ClientReady;

  execute(...[client]: EventTypes<'ready'>): any {
    console.log(`Ready! Logged in as ${client?.user.tag}`);
  }
}
