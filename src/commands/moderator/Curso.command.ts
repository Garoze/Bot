import {
  CommandInterface,
  CommandProps,
  CommandType,
} from 'src/@types/command';

import { CommandDecorator } from '../CommandDecorator';

import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  TextChannel,
} from 'discord.js';
import { courses, getCourseName } from 'src/utils/coursesUtils';
import { colors } from 'src/utils/colors';
import { getMemberNickname } from 'src/utils/nickname';

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
    const mod = interaction.guild?.members.cache.find(
      (member) => member.id === interaction.user.id,
    );

    await interaction.deferReply({ ephemeral: true });

    if (!mod?.roles.cache.has(process.env.MOD_ID)) {
      await interaction.editReply({
        content: 'Você não tem permissão para enviar esse comando!',
      });

      return;
    }

    const userID = options.getUser('role-user')?.id;

    const roleSelectMenu = new ActionRowBuilder<StringSelectMenuBuilder>({
      components: [
        new StringSelectMenuBuilder({
          custom_id: 'role-select',
          placeholder: 'Selecione os cursos a serem aplicados no usuário',
          min_values: 1,
          max_values: courses.length,
          options: [...courses],
        }),
      ],
    });

    const roleSelectMessage = await interaction.editReply({
      components: [roleSelectMenu],
    });

    const roleSelectCollector =
      roleSelectMessage.createMessageComponentCollector({
        time: 420000,
      });

    roleSelectCollector.on('collect', async (courseInteraction) => {
      if (!courseInteraction.isAnySelectMenu()) return;

      switch (courseInteraction.customId) {
        case 'role-select':
          {
            const user = interaction.guild?.members.cache.find(
              (member) => member.id === userID,
            );

            if (!user) {
              await courseInteraction.editReply({
                content: 'Não foi possivel encontrar o usuario informado',
              });

              return;
            }

            const appliedCourses: string[] = [''];

            courseInteraction.values.forEach(async (course) => {
              if (user?.roles.cache.has(course)) {
                await courseInteraction.update({
                  content: `O usuário informado já possui o curso [${course}]`,
                  components: [],
                });
              } else {
                user.roles.add(course);
                appliedCourses.push(getCourseName(course));
              }
            });

            await interaction.editReply({
              content: 'Cursos adicionado com sucesso!',
              components: [],
            });

            const logChannel = interaction.guild?.channels.cache.get(
              '1133403751416332340',
            ) as TextChannel;

            const embed = new EmbedBuilder({
              color: colors.RED,
              title: 'Aplicação de cursos:',
              fields: [
                { name: 'Instrutor:', value: `${interaction.user.toString()}` },
                { name: 'Operador:', value: `${user.toString()}` },
                { name: 'Cursos', value: `${appliedCourses.join('\n')}` },
              ],
              footer: {
                text: `Comando enviado por: ${getMemberNickname(interaction)} - ${new Date().toLocaleDateString('pt-BR')}`,
              },
            });

            logChannel.send({ embeds: [embed] });
          }
          break;
      }
    });
  }
}
