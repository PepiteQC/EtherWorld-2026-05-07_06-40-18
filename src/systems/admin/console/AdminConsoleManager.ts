/**
 * AdminConsoleManager.ts - Gestionnaire principal de la console admin
 * Intègre Parser, Permissions, Logger et commandes
 */

import { CommandParser, CommandContext } from './CommandParser';
import { PermissionSystem, PermissionLevel, AdminUser } from '../permissions/PermissionSystem';
import { CommandLogger } from './CommandLogger';
import { AllCommands } from '../commands/StandardCommands';

export interface ConsoleConfig {
  maxHistory?: number;
  maxLogs?: number;
  enableLogging?: boolean;
  logToConsole?: boolean;
  logToFirebase?: boolean;
}

/**
 * Gestionnaire principal de la console admin
 */
export class AdminConsoleManager {
  private parser: CommandParser;
  private permissionSystem: PermissionSystem;
  private logger: CommandLogger;
  private config: Required<ConsoleConfig>;
  private isEnabled = true;

  constructor(config: ConsoleConfig = {}) {
    this.parser = new CommandParser();
    this.permissionSystem = new PermissionSystem();
    this.logger = new CommandLogger();

    this.config = {
      maxHistory: config.maxHistory || 100,
      maxLogs: config.maxLogs || 10000,
      enableLogging: config.enableLogging !== false,
      logToConsole: config.logToConsole !== false,
      logToFirebase: config.logToFirebase || false,
    };

    // Enregistrer les commandes standard
    this.parser.registerCommands(AllCommands);
  }

  /**
   * Initialiser un admin
   */
  initializeAdmin(user: AdminUser): void {
    this.permissionSystem.registerAdmin(user);
    if (this.config.logToConsole) {
      console.log(`[ADMIN] ${user.name} initialisé avec le niveau ${user.permissionLevel}`);
    }
  }

  /**
   * Exécuter une commande
   */
  async executeCommand(
    commandInput: string,
    playerId: string
  ): Promise<{ success: boolean; message: string }> {
    if (!this.isEnabled) {
      return { success: false, message: 'Console admin désactivée' };
    }

    const admin = this.permissionSystem.getAdmin(playerId);
    if (!admin) {
      return { success: false, message: 'Utilisateur non trouvé' };
    }

    const startTime = performance.now();

    const context: CommandContext = {
      player: {
        id: admin.id,
        name: admin.name,
        permissionLevel: admin.permissionLevel,
      },
      timestamp: Date.now(),
      source: 'in-game',
    };

    const result = await this.parser.executeCommand(commandInput, context);
    const duration = performance.now() - startTime;

    // Logger la commande
    if (this.config.enableLogging) {
      const parsed = this.parser.parseCommand(commandInput);
      if (parsed) {
        this.logger.logCommand(
          parsed.name,
          commandInput,
          context,
          parsed.args,
          result,
          duration
        );

        // Log à Firebase si activé
        if (this.config.logToFirebase) {
          this.syncLogToFirebase();
        }
      }
    }

    // Log en console si activé
    if (this.config.logToConsole) {
      const statusIcon = result.success ? '✓' : '✗';
      console.log(`[COMMAND] ${statusIcon} ${admin.name}: ${commandInput}`);
      console.log(`[RESULT] ${result.message} (${duration.toFixed(2)}ms)`);
    }

    return result;
  }

  /**
   * Enregistrer une commande custom
   */
  registerCustomCommand(command: any): void {
    this.parser.registerCommand(command);
  }

  /**
   * Obtenir les commandes disponibles pour un admin
   */
  getAvailableCommands(playerId: string): any[] {
    const admin = this.permissionSystem.getAdmin(playerId);
    if (!admin) return [];
    return this.parser.getAvailableCommands(admin.permissionLevel);
  }

  /**
   * Vérifier une permission
   */
  hasPermission(playerId: string, flag: any): boolean {
    return this.permissionSystem.hasPermission(playerId, flag);
  }

  /**
   * Obtenir les logs filtrés
   */
  getLogs(filter?: any): any[] {
    return this.logger.getLogs(filter);
  }

  /**
   * Obtenir un rapport
   */
  generateReport(title?: string, filter?: any): string {
    return this.logger.generateReport(title, filter);
  }

  /**
   * Exporter les logs
   */
  exportLogs(format: 'json' | 'csv' = 'json', filter?: any): string {
    return format === 'csv'
      ? this.logger.exportLogsCSV(filter)
      : this.logger.exportLogs(filter);
  }

  /**
   * Activer/Désactiver la console
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (this.config.logToConsole) {
      console.log(`[ADMIN] Console ${enabled ? 'activée' : 'désactivée'}`);
    }
  }

  /**
   * Enregistrer un callback de log
   */
  onCommandLogged(callback: (log: any) => void): () => void {
    return this.logger.onCommandLogged(callback);
  }

  /**
   * Sync les logs à Firebase (placeholder)
   */
  private async syncLogToFirebase(): Promise<void> {
    try {
      const recentLogs = this.logger.getRecentLogs(100);
      // TODO: Implémenter la sync Firebase
      console.debug('[ADMIN] Sync Firebase logs', recentLogs.length);
    } catch (error) {
      console.error('[ADMIN] Erreur sync Firebase:', error);
    }
  }

  /**
   * Obtenir les statistiques
   */
  getStats(): {
    totalAdmins: number;
    totalLogs: number;
    commandStats: any;
    enabled: boolean;
  } {
    const admins = this.permissionSystem.getAllAdmins();
    const stats = this.logger.getStats();

    return {
      totalAdmins: admins.length,
      totalLogs: stats.totalLogs,
      commandStats: stats,
      enabled: this.isEnabled,
    };
  }

  /**
   * Nettoyer les vieux logs
   */
  cleanupOldLogs(olderThanMs: number = 7 * 24 * 60 * 60 * 1000): void {
    this.logger.clearOldLogs(olderThanMs);
    console.log(`[ADMIN] Logs nettoyés (> ${olderThanMs}ms)`);
  }

  /**
   * Obtenir la console pour développement
   */
  getConsoleInfo(): string {
    const stats = this.getStats();
    return `
╔════════════════════════════════════════════════════════════╗
║           ETHERWORLD RP - ADMIN CONSOLE STATUS             ║
╚════════════════════════════════════════════════════════════╝

État: ${this.isEnabled ? '✓ ACTIVÉE' : '✗ DÉSACTIVÉE'}
Admins enregistrés: ${stats.totalAdmins}
Commandes enregistrées: ${this.parser.getAvailableCommands(PermissionLevel.OWNER).length}
Logs totaux: ${stats.totalLogs}
Commandes réussies: ${stats.commandStats.successfulCommands}
Commandes échouées: ${stats.commandStats.failedCommands}
Commande la plus utilisée: ${stats.commandStats.mostUsedCommand || 'N/A'}

Configuration:
  • Logging activé: ${this.config.enableLogging}
  • Logs en console: ${this.config.logToConsole}
  • Sync Firebase: ${this.config.logToFirebase}
  • Max historique: ${this.config.maxHistory}
  • Max logs: ${this.config.maxLogs}
    `;
  }
}

export default AdminConsoleManager;
