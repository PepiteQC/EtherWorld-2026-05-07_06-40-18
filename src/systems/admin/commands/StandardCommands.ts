/**
 * StandardCommands.ts - Commandes admin standard
 * Similaire aux commandes FiveM
 */

import { CommandDefinition, CommandContext } from './CommandParser';
import { PermissionLevel, AdminFlag } from '../permissions/PermissionSystem';

/**
 * Commandes de modération
 */
export const ModerationCommands: CommandDefinition[] = [
  {
    name: 'kick',
    aliases: ['remove', 'eject'],
    description: 'Expulser un joueur du serveur',
    args: [
      { name: 'playerId', type: 'player', required: true, description: 'ID ou nom du joueur' },
      { name: 'reason', type: 'string', required: false, description: 'Raison du kick' },
    ],
    minPermissionLevel: PermissionLevel.MODERATOR,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId, reason] = args;
      console.log(`${ctx.player.name} a expulsé ${playerId}. Raison: ${reason || 'Aucune'}`);
      return `✓ ${playerId} a été expulsé du serveur`;
    },
  },

  {
    name: 'ban',
    aliases: ['banish'],
    description: 'Bannir un joueur',
    args: [
      { name: 'playerId', type: 'player', required: true, description: 'ID ou nom du joueur' },
      { name: 'duration', type: 'number', required: false, description: 'Durée en heures (0=permanent)' },
      { name: 'reason', type: 'string', required: false, description: 'Raison du ban' },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId, duration, reason] = args;
      const banType = duration === 0 || !duration ? 'permanent' : `${duration}h`;
      console.log(`${ctx.player.name} a banni ${playerId} (${banType}). Raison: ${reason || 'Aucune'}`);
      return `✓ ${playerId} a été banni pour ${banType}`;
    },
  },

  {
    name: 'mute',
    description: 'Rendre un joueur muet',
    args: [
      { name: 'playerId', type: 'player', required: true },
      { name: 'duration', type: 'number', required: false },
    ],
    minPermissionLevel: PermissionLevel.MODERATOR,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId, duration] = args;
      return `✓ ${playerId} a été rendu muet pour ${duration || '1'} minute(s)`;
    },
  },

  {
    name: 'warn',
    description: 'Avertir un joueur',
    args: [
      { name: 'playerId', type: 'player', required: true },
      { name: 'reason', type: 'string', required: false },
    ],
    minPermissionLevel: PermissionLevel.MODERATOR,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId, reason] = args;
      return `✓ ${playerId} a reçu un avertissement`;
    },
  },
];

/**
 * Commandes de téléportation
 */
export const TeleportCommands: CommandDefinition[] = [
  {
    name: 'tp',
    aliases: ['teleport', 'goto'],
    description: 'Se téléporter à un joueur',
    args: [
      { name: 'playerId', type: 'player', required: true },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId] = args;
      return `✓ Vous vous êtes téléporté à ${playerId}`;
    },
  },

  {
    name: 'tpm',
    aliases: ['tpme'],
    description: 'Téléporter un joueur à vous',
    args: [
      { name: 'playerId', type: 'player', required: true },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId] = args;
      return `✓ ${playerId} a été téléporté à vous`;
    },
  },

  {
    name: 'tpc',
    aliases: ['coords', 'tpcoords'],
    description: 'Se téléporter aux coordonnées',
    args: [
      { name: 'x', type: 'number', required: true },
      { name: 'y', type: 'number', required: true },
      { name: 'z', type: 'number', required: false },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [x, y, z] = args;
      return `✓ Téléporté à ${x}, ${y}, ${z || 0}`;
    },
  },

  {
    name: 'back',
    description: 'Retourner à votre dernière position',
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      return `✓ Retourné à votre dernière position`;
    },
  },
];

/**
 * Commandes de joueur
 */
export const PlayerCommands: CommandDefinition[] = [
  {
    name: 'freeze',
    description: 'Geler/Dégeler un joueur',
    args: [
      { name: 'playerId', type: 'player', required: true },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId] = args;
      return `✓ ${playerId} a été gelé`;
    },
  },

  {
    name: 'godmode',
    aliases: ['god', 'invincible'],
    description: 'Activer/Désactiver le mode invincibilité',
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      return `✓ Mode invincibilité activé`;
    },
  },

  {
    name: 'invisible',
    aliases: ['invis'],
    description: 'Devenir invisible',
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      return `✓ Vous êtes maintenant invisible`;
    },
  },

  {
    name: 'heal',
    description: 'Soigner un joueur',
    args: [
      { name: 'playerId', type: 'player', required: false },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId] = args;
      const target = playerId || 'vous';
      return `✓ ${target} a été soigné`;
    },
  },

  {
    name: 'armor',
    description: 'Donner une armure',
    args: [
      { name: 'playerId', type: 'player', required: false },
      { name: 'amount', type: 'number', required: false },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId, amount] = args;
      return `✓ Armure donnée`;
    },
  },
];

/**
 * Commandes de serveur
 */
export const ServerCommands: CommandDefinition[] = [
  {
    name: 'status',
    description: 'Afficher le statut du serveur',
    minPermissionLevel: PermissionLevel.USER,
    execute: async (args: any[], ctx: CommandContext) => {
      const uptime = Math.floor(Date.now() / 1000);
      return `✓ Serveur en ligne depuis ${uptime}s. Joueurs: ${Math.floor(Math.random() * 50)}/128`;
    },
  },

  {
    name: 'players',
    aliases: ['list', 'online'],
    description: 'Lister les joueurs en ligne',
    minPermissionLevel: PermissionLevel.USER,
    execute: async (args: any[], ctx: CommandContext) => {
      return `✓ 12 joueurs en ligne\n[1] Player1 (Admin)\n[2] Player2 (Mod)\n[3] Player3`;
    },
  },

  {
    name: 'time',
    description: 'Définir l\'heure du serveur',
    args: [
      { name: 'hour', type: 'number', required: true },
      { name: 'minute', type: 'number', required: false },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [hour, minute] = args;
      return `✓ Heure définie à ${hour}:${(minute || 0).toString().padStart(2, '0')}`;
    },
  },

  {
    name: 'weather',
    aliases: ['meteo'],
    description: 'Changer la météo',
    args: [
      { name: 'type', type: 'string', required: true },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [type] = args;
      return `✓ Météo changée en ${type}`;
    },
  },

  {
    name: 'announce',
    aliases: ['say', 'broadcast'],
    description: 'Annoncer un message à tout le serveur',
    args: [
      { name: 'message', type: 'string', required: true },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [message] = args;
      console.log(`[ANNONCE] ${message}`);
      return `✓ Annonce envoyée`;
    },
  },

  {
    name: 'restart',
    description: 'Redémarrer le serveur',
    args: [
      { name: 'delay', type: 'number', required: false },
    ],
    minPermissionLevel: PermissionLevel.OWNER,
    execute: async (args: any[], ctx: CommandContext) => {
      const [delay] = args;
      return `✓ Redémarrage du serveur dans ${delay || 10} secondes`;
    },
  },
];

/**
 * Commandes d'économie
 */
export const EconomyCommands: CommandDefinition[] = [
  {
    name: 'give',
    aliases: ['givemoney', 'givecash'],
    description: 'Donner de l\'argent à un joueur',
    args: [
      { name: 'playerId', type: 'player', required: true },
      { name: 'amount', type: 'number', required: true },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId, amount] = args;
      return `✓ ${amount}$ donné à ${playerId}`;
    },
  },

  {
    name: 'setmoney',
    description: 'Définir la quantité d\'argent d\'un joueur',
    args: [
      { name: 'playerId', type: 'player', required: true },
      { name: 'amount', type: 'number', required: true },
    ],
    minPermissionLevel: PermissionLevel.ADMIN,
    execute: async (args: any[], ctx: CommandContext) => {
      const [playerId, amount] = args;
      return `✓ Argent de ${playerId} défini à ${amount}$`;
    },
  },

  {
    name: 'money',
    description: 'Voir votre argent',
    minPermissionLevel: PermissionLevel.USER,
    execute: async (args: any[], ctx: CommandContext) => {
      const amount = Math.floor(Math.random() * 1000000);
      return `✓ Vous avez ${amount}$`;
    },
  },
];

/**
 * Commandes d'aide
 */
export const HelpCommands: CommandDefinition[] = [
  {
    name: 'help',
    aliases: ['?', 'commands'],
    description: 'Afficher l\'aide',
    args: [
      { name: 'command', type: 'string', required: false },
    ],
    minPermissionLevel: PermissionLevel.USER,
    execute: async (args: any[], ctx: CommandContext) => {
      const [command] = args;
      if (command) {
        return `✓ Aide pour ${command}`;
      }
      return `✓ Tapez /help <commande> pour plus d'infos`;
    },
  },

  {
    name: 'admin',
    description: 'Afficher les commandes admin',
    minPermissionLevel: PermissionLevel.MODERATOR,
    execute: async (args: any[], ctx: CommandContext) => {
      return `✓ Commandes admin disponibles:\n- /kick <player> [reason]\n- /ban <player> [duration] [reason]\n- /tp <player>\n- /tpm <player>\n- /freeze <player>`;
    },
  },
];

/**
 * Exporter toutes les commandes
 */
export const AllCommands = [
  ...ModerationCommands,
  ...TeleportCommands,
  ...PlayerCommands,
  ...ServerCommands,
  ...EconomyCommands,
  ...HelpCommands,
];

export default AllCommands;
