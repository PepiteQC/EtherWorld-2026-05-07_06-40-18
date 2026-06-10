/**
 * index.ts - Console Admin System
 * Export principal du système de console admin
 */

// Core
export { CommandParser, CommandArgument, CommandDefinition, CommandContext, ParsedCommand } from './console/CommandParser';
export { CommandLogger, CommandLog, AuditFilter } from './console/CommandLogger';
export { AdminConsoleManager } from './console/AdminConsoleManager';
export { AdminConsoleUI, useAdminConsole } from './console/AdminConsoleUI';

// Permissions
export {
  PermissionSystem,
  PermissionLevel,
  AdminUser,
  AdminFlag,
} from '../admin/permissions/PermissionSystem';

// Commands
export {
  ModerationCommands,
  TeleportCommands,
  PlayerCommands,
  ServerCommands,
  EconomyCommands,
  HelpCommands,
  AllCommands,
} from '../admin/commands/StandardCommands';

// Re-export principal pour usage simple
export default {
  AdminConsoleManager,
  AdminConsoleUI,
  useAdminConsole,
  CommandParser,
  PermissionSystem,
  CommandLogger,
};
