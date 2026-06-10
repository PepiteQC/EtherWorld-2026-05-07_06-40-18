/**
 * CommandLogger.ts - Système de logging et audit des commandes admin
 * Sauvegarde les commandes exécutées pour audit/sécurité
 */

import { CommandContext } from './CommandParser';

export interface CommandLog {
  id: string;
  commandName: string;
  fullCommand: string;
  adminId: string;
  adminName: string;
  adminLevel: number;
  args: any[];
  result: {
    success: boolean;
    message: string;
  };
  timestamp: number;
  ip?: string;
  duration: number; // en ms
  target?: string; // ID du joueur affecté, si applicable
  affectedPlayers?: string[]; // Liste des joueurs affectés
}

export interface AuditFilter {
  adminId?: string;
  commandName?: string;
  startTime?: number;
  endTime?: number;
  success?: boolean;
  target?: string;
}

/**
 * Gestionnaire de logs des commandes admin
 */
export class CommandLogger {
  private logs: CommandLog[] = [];
  private maxLogs = 10000;
  private logCallbacks: Array<(log: CommandLog) => void> = [];

  /**
   * Enregistrer une commande exécutée
   */
  logCommand(
    commandName: string,
    fullCommand: string,
    context: CommandContext,
    args: any[],
    result: { success: boolean; message: string },
    duration: number,
    target?: string
  ): CommandLog {
    const log: CommandLog = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      commandName,
      fullCommand,
      adminId: context.player.id,
      adminName: context.player.name,
      adminLevel: context.player.permissionLevel,
      args,
      result,
      timestamp: context.timestamp,
      duration,
      target,
    };

    this.logs.push(log);

    // Limiter la taille
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Appeler les callbacks
    this.logCallbacks.forEach((cb) => cb(log));

    return log;
  }

  /**
   * Obtenir les logs selon un filtre
   */
  getLogs(filter?: AuditFilter): CommandLog[] {
    return this.logs.filter((log) => {
      if (filter?.adminId && log.adminId !== filter.adminId) return false;
      if (filter?.commandName && log.commandName !== filter.commandName) return false;
      if (
        filter?.startTime &&
        log.timestamp < filter.startTime
      )
        return false;
      if (filter?.endTime && log.timestamp > filter.endTime) return false;
      if (
        filter?.success !== undefined &&
        log.result.success !== filter.success
      )
        return false;
      if (filter?.target && log.target !== filter.target) return false;

      return true;
    });
  }

  /**
   * Obtenir les logs récents
   */
  getRecentLogs(count: number = 50): CommandLog[] {
    return this.logs.slice(-count);
  }

  /**
   * Obtenir les logs d'un admin
   */
  getAdminLogs(adminId: string, limit?: number): CommandLog[] {
    const logs = this.logs.filter((log) => log.adminId === adminId);
    return limit ? logs.slice(-limit) : logs;
  }

  /**
   * Obtenir les commandes d'un type
   */
  getCommandLogs(commandName: string, limit?: number): CommandLog[] {
    const logs = this.logs.filter((log) => log.commandName === commandName);
    return limit ? logs.slice(-limit) : logs;
  }

  /**
   * Obtenir les logs affectant un joueur
   */
  getPlayerLogs(playerId: string): CommandLog[] {
    return this.logs.filter((log) => log.target === playerId);
  }

  /**
   * Enregistrer un callback pour chaque nouvelle commande
   */
  onCommandLogged(callback: (log: CommandLog) => void): () => void {
    this.logCallbacks.push(callback);
    // Retourner une fonction pour unsubscribe
    return () => {
      const index = this.logCallbacks.indexOf(callback);
      if (index > -1) this.logCallbacks.splice(index, 1);
    };
  }

  /**
   * Exporter les logs en JSON
   */
  exportLogs(filter?: AuditFilter): string {
    const data = this.getLogs(filter);
    return JSON.stringify(data, null, 2);
  }

  /**
   * Exporter les logs en CSV
   */
  exportLogsCSV(filter?: AuditFilter): string {
    const data = this.getLogs(filter);
    if (data.length === 0) return '';

    const headers = [
      'ID',
      'Command',
      'Admin',
      'Admin Level',
      'Target',
      'Success',
      'Message',
      'Timestamp',
      'Duration (ms)',
    ];

    const rows = data.map((log) => [
      log.id,
      log.commandName,
      log.adminName,
      log.adminLevel,
      log.target || '-',
      log.result.success ? 'YES' : 'NO',
      `"${log.result.message.replace(/"/g, '""')}"`,
      new Date(log.timestamp).toISOString(),
      log.duration,
    ]);

    return (
      [headers, ...rows].map((row) => row.join(',')).join('\n') + '\n'
    );
  }

  /**
   * Obtenir les statistiques des logs
   */
  getStats(): {
    totalLogs: number;
    successfulCommands: number;
    failedCommands: number;
    uniqueAdmins: number;
    mostUsedCommand: string | null;
    averageCommandDuration: number;
  } {
    const successful = this.logs.filter((l) => l.result.success).length;
    const failed = this.logs.length - successful;
    const uniqueAdmins = new Set(this.logs.map((l) => l.adminId)).size;

    const commandCounts = new Map<string, number>();
    this.logs.forEach((log) => {
      commandCounts.set(log.commandName, (commandCounts.get(log.commandName) || 0) + 1);
    });

    let mostUsedCommand: string | null = null;
    let maxCount = 0;
    commandCounts.forEach((count, cmd) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsedCommand = cmd;
      }
    });

    const averageDuration =
      this.logs.length > 0
        ? this.logs.reduce((sum, log) => sum + log.duration, 0) /
          this.logs.length
        : 0;

    return {
      totalLogs: this.logs.length,
      successfulCommands: successful,
      failedCommands: failed,
      uniqueAdmins,
      mostUsedCommand,
      averageCommandDuration,
    };
  }

  /**
   * Nettoyer les logs (par sécurité)
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Nettoyer les logs anciens
   */
  clearOldLogs(olderThan: number): void {
    const cutoffTime = Date.now() - olderThan;
    this.logs = this.logs.filter((log) => log.timestamp > cutoffTime);
  }

  /**
   * Générer un rapport formaté
   */
  generateReport(
    title: string = 'Rapport des commandes admin',
    filter?: AuditFilter
  ): string {
    const logs = this.getLogs(filter);
    const stats = this.getStats();

    let report = `
╔════════════════════════════════════════════════════════════╗
║  ${title.padEnd(56)}║
╚════════════════════════════════════════════════════════════╝

Statistiques Globales:
  • Nombre total de commandes: ${stats.totalLogs}
  • Commandes réussies: ${stats.successfulCommands}
  • Commandes échouées: ${stats.failedCommands}
  • Admins uniques: ${stats.uniqueAdmins}
  • Commande la plus utilisée: ${stats.mostUsedCommand || 'N/A'}
  • Durée moyenne: ${stats.averageCommandDuration.toFixed(2)}ms

Dernières Commandes:
`;

    logs.slice(-10).forEach((log) => {
      report += `
  [${new Date(log.timestamp).toLocaleTimeString()}] 
  Admin: ${log.adminName} (Level ${log.adminLevel})
  Commande: /${log.commandName}
  Cible: ${log.target || 'Serveur'}
  Résultat: ${log.result.success ? '✓' : '✗'} ${log.result.message}`;
    });

    return report;
  }
}

export default CommandLogger;
