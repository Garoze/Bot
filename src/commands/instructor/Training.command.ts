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
  GuildMember,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  UserSelectMenuBuilder,
} from 'discord.js';
import { hasPermission } from 'src/utils/perms';
import { colors } from 'src/utils/colors';

type Operator = {
  id: string;
  object?: GuildMember;
  nickname: string;
};

type Training = {
  operator: Operator;
  courseID: string;
  instructor: string;
  assistants: Operator[];
  comments: string;
};

@CommandDecorator
export class TrainingCommand implements CommandInterface {
  props: CommandType = {
    name: 'formacao',
    description: `Promove um recruta a cadete, só pode ser usado por instrutores/FTO's.`,
    options: [
      {
        name: 'promote-user',
        description: 'Usuário a ser promivido a cadete.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
    dmPermission: false,
  };

  async execute({ interaction, options }: CommandProps) {
    const training: Training = {
      operator: {
        id: '',
        nickname: '',
      },
      courseID: '',
      instructor: 'N/A',
      assistants: [],
      comments: 'N/A',
    };

    const instructorIDs = ['1113685350016090144', '1114590564755709963'];

    const member = interaction.guild?.members.cache.find(
      (m) => m.id === interaction.user.id,
    );

    if (!member) return;

    let instructor = false;
    instructorIDs.forEach(async (id) => {
      if (hasPermission(member, id)) {
        instructor = true;
      }
    });

    if (!instructor) {
      await interaction.reply({
        content: 'Você não tem permissão para enviar esse comando!',
      });
    }

    const userID = options.getUser('promote-user')?.id;
    training.operator.id = userID as string;
    training.courseID = '1113630099200295052';

    const assistantSelect = new ActionRowBuilder<UserSelectMenuBuilder>({
      components: [
        new UserSelectMenuBuilder({
          custom_id: 'assistant-select',
          placeholder: 'Liste os auxiliares caso tenha algum: ',
          min_values: 0,
          max_values: 6,
        }),
      ],
    });

    const assistantMessage = await interaction.reply({
      components: [assistantSelect],
      ephemeral: true,
      fetchReply: true,
    });

    const assistantCollector = assistantMessage.createMessageComponentCollector(
      {
        time: 30000,
      },
    );

    assistantCollector.on('collect', async (assistantInteraction) => {
      if (!assistantInteraction.isAnySelectMenu()) return;

      const { guild } = assistantInteraction;

      switch (assistantInteraction.customId) {
        case 'assistant-select':
          {
            assistantInteraction.values.forEach((id) => {
              const assistant = guild?.members.cache.find((m) => m.id === id);

              if (assistant) {
                training.assistants.push({
                  id,
                  object: assistant,
                  nickname: assistant.nickname!,
                });
              }
            });

            const operator = guild?.members.cache.find((m) => m.id === userID);
            training.operator.nickname = operator?.nickname || 'N/A';

            const modal = new ModalBuilder({
              custom_id: 'training-modal',
              title: 'Formação - Curso Básico',
              components: [
                new ActionRowBuilder<TextInputBuilder>({
                  components: [
                    new TextInputBuilder({
                      custom_id: 'modal-operator-input',
                      label: 'Operador: ',
                      placeholder: 'Informe o operador: ',
                      style: TextInputStyle.Short,
                      value: training.operator.nickname,
                      required: true,
                    }),
                  ],
                }),
                new ActionRowBuilder<TextInputBuilder>({
                  components: [
                    new TextInputBuilder({
                      custom_id: 'modal-instructor-input',
                      label: 'Instrutor: ',
                      placeholder: 'Informe o instrutor do curso básico: ',
                      style: TextInputStyle.Short,
                      value: member.nickname || 'N/A',
                      required: true,
                    }),
                  ],
                }),
                new ActionRowBuilder<TextInputBuilder>({
                  components: [
                    new TextInputBuilder({
                      custom_id: 'modal-operators-input',
                      label: 'Auxiliares: ',
                      placeholder: 'Informe os auxiliares caso tenha algum: ',
                      style: TextInputStyle.Paragraph,
                      value: training.assistants
                        .map((assistant) => assistant.nickname || 'N/A')
                        .join('\n'),
                      required: true,
                    }),
                  ],
                }),
                new ActionRowBuilder<TextInputBuilder>({
                  components: [
                    new TextInputBuilder({
                      custom_id: 'modal-comments-input',
                      label: 'Observações: ',
                      style: TextInputStyle.Paragraph,
                      value: training.comments,
                      required: false,
                    }),
                  ],
                }),
              ],
            });

            await assistantInteraction.showModal(modal);

            const modalInteraction = await assistantInteraction
              .awaitModalSubmit({
                time: 60000,
                filter: (i) => i.user.id === interaction.user.id,
              })
              .catch((err) => {
                console.log(err);
                return null;
              });

            if (!modalInteraction) return;

            const { fields } = modalInteraction;

            const comments =
              fields.getTextInputValue('modal-comments-input') || 'N/A';

            training.comments = comments;

            modalInteraction
              .reply({
                content: 'Seu formulario foi enviado com sucesso!',
                ephemeral: true,
              })
              .then((i) =>
                setTimeout(() => {
                  i.delete();
                }, 5000),
              );

            assistantInteraction.deleteReply();

            const trainingChannel = interaction.guild?.channels.cache.get(
              '1133403751416332340',
            ) as TextChannel;

            const embed = new EmbedBuilder({
              color: colors.YELLOW,
              title: 'Formação - Curso Básico',
              fields: [
                { name: 'Operador:', value: `${operator?.toString()}` },
                { name: 'Instrutor: ', value: `${member.toString()}` },
                {
                  name: 'Auxiliares: ',
                  value: training.assistants
                    .map((assistant) => `<@${assistant.id}>`)
                    .join('\n'),
                },
                { name: 'Observações: ', value: training.comments },
              ],
              footer: {
                text: `Ass. ${member.nickname || 'N/A'}`,
              },
              timestamp: new Date(),
            });

            operator?.roles.add('1089622842905202738'); // Cadete
            operator?.roles.add('1113630099200295052'); // Curso básico

            trainingChannel.send({ embeds: [embed] });

            assistantCollector.stop();
          }
          break;
      }
    });
  }
}
