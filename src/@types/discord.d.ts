import { Collection } from 'discord.js';
import { CommandInterface } from './command';

declare module 'discord.js' {
  export interface Client {
    commandCollection: Collection<string, CommandInterface>;
    events: void;
  }
}
