import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';

import { CommandDecorator } from '../CommandDecorator';

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  RoleSelectMenuBuilder,
} from 'discord.js';

@CommandDecorator
export class RoleCommand implements CommandInterface {
  props: CommandType = {
    name: 'curso',
    description: 'Aplica um ou mais cursos a um usuário especifico',
    options: [
      {
        name: 'role-user',
        description: 'Usuário ao qual aplicar os cursos.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
    dmPermission: false,
  };

  async execute({ interaction, options }: CommandProps) {
    const fto = interaction.guild?.members.cache.find(
      (member) => member.id === interaction.user.id,
    );

    await interaction.deferReply({ ephemeral: true });

    if (!fto?.roles.cache.has('1218959552469274768')) {
      await interaction.editReply({
        content: 'Você não tem permissão para enviar esse comando!',
      });

      return;
    }

    const userID = options.getUser('role-user')?.id;

    const roleSelectMenu = new ActionRowBuilder<RoleSelectMenuBuilder>({
      components: [
        new RoleSelectMenuBuilder({
          custom_id: 'role-select',
          placeholder: 'Selecione os cursos a serem aplicados no usuário',
          min_values: 1,
          max_values: 1,
        }),
      ],
    });

    const roleSelectMessage = await interaction.editReply({
      components: [roleSelectMenu],
    });

    const roleSelectCollector =
      roleSelectMessage.createMessageComponentCollector({
        time: 30000,
      });

    roleSelectCollector.on('collect', async (roleInteraction) => {
      if (!roleInteraction.isAnySelectMenu()) return;

      switch (roleInteraction.customId) {
        case 'role-select':
          {
            const user = interaction.guild?.members.cache.find(
              (member) => member.id === userID,
            );

            if (!user) {
              await roleInteraction.editReply({
                content: 'Não foi possivel encontrar o usuario informado',
              });

              return;
            }

            if (user?.roles.cache.has(roleInteraction.values[0])) {
              await roleInteraction.editReply({
                content: 'O usuário informado já possui este curso',
                components: [],
              });
            } else {
              user.roles.add(roleInteraction.values[0]);

              await interaction.editReply({
                content: 'Curso adicionado com sucesso!',
                components: [],
              });
            }
          }
          break;
      }
    });
  }
}
