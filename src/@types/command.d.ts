import {
  ApplicationCommandData,
  AutocompleteInteraction,
  ButtonInteraction,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';

interface CommandProps {
  interaction: CommandInteraction;
  options: CommandInteractionOptionResolver;
}

type ComponentsButton = Collection<
  string,
  (interaction: ButtonInteraction) => any
>;

type ComponentsSelect = Collection<
  string,
  (interaction: StringSelectMenuInteraction) => any
>;

type ComponentsModal = Collection<
  string,
  (interaction: ModalSubmitInteraction) => any
>;

type CommandType = ApplicationCommandData & {
  buttons?: ComponentsButton;
  selects?: ComponentsSelect;
  modals?: ComponentsModal;
};

interface CommandInterface {
  props: CommandType;

  execute: (props: CommandProps) => any;
  autoComplete?: (interaction: AutocompleteInteraction) => any;
}
