import { GuildMember } from 'discord.js';

export const hasPermission = (member: GuildMember, perm: string) => {
  return member.roles.cache.has(perm);
};
