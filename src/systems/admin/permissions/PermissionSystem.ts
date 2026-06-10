/**
 * PermissionSystem.ts - Gestion des permissions admin
 * Système hiérarchique avec niveaux et flags
 */

export enum PermissionLevel {
  USER = 0,
  MODERATOR = 1,
  ADMIN = 2,
  OWNER = 3,
}

export interface AdminUser {
  id: string;
  name: string;
  permissionLevel: PermissionLevel;
  flags?: AdminFlag[];
  lastActive?: number;
  joinedAt?: number;
}

export enum AdminFlag {
  // Modération
  KICK = 'kick',
  BAN = 'ban',
  MUTE = 'mute',
  WARN = 'warn',

  // Teleportation
  TELEPORT = 'teleport',
  TELEPORT_TO_PLAYER = 'teleport_to_player',
  TELEPORT_PLAYER = 'teleport_player',

  // Gestion du serveur
  RESTART = 'restart',
  MAINTENANCE = 'maintenance',
  CONFIG = 'config',
  LOGS = 'logs',

  // Gestion des joueurs
  FREEZE = 'freeze',
  INVISIBLE = 'invisible',
  GOD_MODE = 'godmode',
  NO_CLIP = 'noclip',

  // Gestion du monde
  WEATHER = 'weather',
  TIME = 'time',
  SPAWN = 'spawn',
  DELETE_OBJECTS = 'delete_objects',

  // Économie
  GIVE_MONEY = 'give_money',
  SET_MONEY = 'set_money',
  ECONOMY_RESET = 'economy_reset',

  // Items/Inventory
  GIVE_ITEM = 'give_item',
  REMOVE_ITEM = 'remove_item',
  CLEAR_INVENTORY = 'clear_inventory',

  // Admin complet
  ALL = 'all',
}

/**
 * Système de gestion des permissions
 */
export class PermissionSystem {
  private admins = new Map<string, AdminUser>();
  private permissionMatrix = new Map<PermissionLevel, AdminFlag[]>();

  constructor() {
    this.initializePermissionMatrix();
  }

  /**
   * Initialiser la matrice de permissions par défaut
   */
  private initializePermissionMatrix(): void {
    // Modérateurs
    this.permissionMatrix.set(PermissionLevel.MODERATOR, [
      AdminFlag.KICK,
      AdminFlag.WARN,
      AdminFlag.MUTE,
      AdminFlag.LOGS,
      AdminFlag.TELEPORT_TO_PLAYER,
    ]);

    // Admins
    this.permissionMatrix.set(PermissionLevel.ADMIN, [
      AdminFlag.KICK,
      AdminFlag.BAN,
      AdminFlag.MUTE,
      AdminFlag.WARN,
      AdminFlag.TELEPORT,
      AdminFlag.TELEPORT_TO_PLAYER,
      AdminFlag.TELEPORT_PLAYER,
      AdminFlag.FREEZE,
      AdminFlag.INVISIBLE,
      AdminFlag.WEATHER,
      AdminFlag.TIME,
      AdminFlag.GIVE_MONEY,
      AdminFlag.SET_MONEY,
      AdminFlag.GIVE_ITEM,
      AdminFlag.CONFIG,
      AdminFlag.LOGS,
      AdminFlag.SPAWN,
    ]);

    // Propriétaires
    this.permissionMatrix.set(PermissionLevel.OWNER, [
      AdminFlag.ALL,
      AdminFlag.RESTART,
      AdminFlag.MAINTENANCE,
      AdminFlag.ECONOMY_RESET,
      AdminFlag.DELETE_OBJECTS,
      AdminFlag.NO_CLIP,
      AdminFlag.GOD_MODE,
    ]);
  }

  /**
   * Enregistrer un utilisateur admin
   */
  registerAdmin(user: AdminUser): void {
    this.admins.set(user.id, {
      ...user,
      joinedAt: user.joinedAt || Date.now(),
    });
  }

  /**
   * Retirer un utilisateur admin
   */
  removeAdmin(userId: string): void {
    this.admins.delete(userId);
  }

  /**
   * Obtenir un utilisateur admin
   */
  getAdmin(userId: string): AdminUser | null {
    return this.admins.get(userId) || null;
  }

  /**
   * Vérifier si un utilisateur a une permission
   */
  hasPermission(userId: string, flag: AdminFlag): boolean {
    const admin = this.admins.get(userId);
    if (!admin) return false;

    // Owner a tout
    if (admin.permissionLevel === PermissionLevel.OWNER) return true;

    // Vérifier les flags explicites
    if (admin.flags?.includes(flag)) return true;
    if (admin.flags?.includes(AdminFlag.ALL)) return true;

    // Vérifier la matrice de permissions par niveau
    const levelPermissions = this.permissionMatrix.get(admin.permissionLevel);
    return levelPermissions?.includes(flag) ?? false;
  }

  /**
   * Vérifier le niveau de permission
   */
  hasPermissionLevel(userId: string, minimumLevel: PermissionLevel): boolean {
    const admin = this.admins.get(userId);
    if (!admin) return false;
    return admin.permissionLevel >= minimumLevel;
  }

  /**
   * Obtenir toutes les permissions d'un utilisateur
   */
  getUserPermissions(userId: string): AdminFlag[] {
    const admin = this.admins.get(userId);
    if (!admin) return [];

    const permissions = new Set<AdminFlag>();

    // Ajouter les permissions par niveau
    const levelPermissions = this.permissionMatrix.get(admin.permissionLevel);
    levelPermissions?.forEach((p) => permissions.add(p));

    // Ajouter les flags explicites
    admin.flags?.forEach((f) => permissions.add(f));

    return Array.from(permissions);
  }

  /**
   * Promouvoir un utilisateur
   */
  promoteUser(userId: string, newLevel: PermissionLevel): boolean {
    const admin = this.admins.get(userId);
    if (!admin) return false;

    admin.permissionLevel = newLevel;
    return true;
  }

  /**
   * Ajouter un flag spécifique
   */
  addFlag(userId: string, flag: AdminFlag): boolean {
    const admin = this.admins.get(userId);
    if (!admin) return false;

    if (!admin.flags) admin.flags = [];
    if (!admin.flags.includes(flag)) {
      admin.flags.push(flag);
    }
    return true;
  }

  /**
   * Retirer un flag
   */
  removeFlag(userId: string, flag: AdminFlag): boolean {
    const admin = this.admins.get(userId);
    if (!admin || !admin.flags) return false;

    const index = admin.flags.indexOf(flag);
    if (index > -1) {
      admin.flags.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Obtenir tous les admins actifs
   */
  getAllAdmins(): AdminUser[] {
    return Array.from(this.admins.values());
  }

  /**
   * Obtenir les admins par niveau
   */
  getAdminsByLevel(level: PermissionLevel): AdminUser[] {
    return Array.from(this.admins.values()).filter((a) => a.permissionLevel === level);
  }

  /**
   * Obtenir le niveau de permission textuel
   */
  static getLevelName(level: PermissionLevel): string {
    switch (level) {
      case PermissionLevel.USER:
        return 'Utilisateur';
      case PermissionLevel.MODERATOR:
        return 'Modérateur';
      case PermissionLevel.ADMIN:
        return 'Administrateur';
      case PermissionLevel.OWNER:
        return 'Propriétaire';
      default:
        return 'Inconnu';
    }
  }

  /**
   * Obtenir le nom du flag
   */
  static getFlagName(flag: AdminFlag): string {
    return flag.replace(/_/g, ' ').toUpperCase();
  }
}

export default PermissionSystem;
