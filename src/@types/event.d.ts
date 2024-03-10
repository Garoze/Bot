import { ClientEvents, Events } from 'discord.js';

// export type EventType<Key extends void | keyof ClientEvents> =
//   Key extends keyof ClientEvents ? ClientEvents[Key] : never;

export type EventTypes<T extends `${Events}`> = T extends keyof ClientEvents
  ? ClientEvents[T]
  : never;

interface EventProps {
  name: Events;
  once?: boolean;
  async?: boolean;
}

export interface EventInterface<Key extends Events> {
  props: EventProps;

  execute(...[args]: EventTypes[Key]): any;
}
