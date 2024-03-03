import { Collection } from 'discord.js';
import { CommandInterface } from './command';

declare module 'discord.js' {
  export interface Client {
    commandCollection: Collection<string, CommandInterface>;
    modalsCollection: Collection<
      string,
      (interaction: ModalSubmitInteraction) => any
    >;
    buttonsCollection: Collection<
      string,
      (interaction: ButtonInteraction) => any
    >;
    selectsCollection: Collection<
      string,
      (interaction: StringSelectMenuInteraction) => any
    >;
    selectedMap?: string;
  }
}
