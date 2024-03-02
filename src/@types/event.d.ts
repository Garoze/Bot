import { ClientEvents, Events } from 'discord.js';

export type EventKey = keyof ClientEvents;

interface EventProps<Key extends EventKey> {
  name: Key;
  once?: boolean;
}

export interface EventInterface<Key extends EventKey = Events.ClientReady> {
  props: EventProps<Key>;

  execute(...args: ClientEvents[Key]): any;
}
