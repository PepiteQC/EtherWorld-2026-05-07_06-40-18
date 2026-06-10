/**
 * CommandParser.ts - Parseur de commandes admin
 * Système de parsing similaire à FiveM mais personnalisé
 */

export interface CommandArgument {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'player';
  required: boolean;
  description?: string;
}

export interface CommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  args?: CommandArgument[];
  minPermissionLevel?: number; // 0=user, 1=mod, 2=admin, 3=owner
  execute: (args: any[], context: CommandContext) => Promise<string | void>;
}

export interface CommandContext {
  player: {
    id: string;
    name: string;
    permissionLevel: number;
  };
  timestamp: number;
  source: 'console' | 'in-game';
}

export interface ParsedCommand {
  name: string;
  args: any[];
  raw: string;
}

/**
 * Parseur principal de commandes
 */
export class CommandParser {
  private commands = new Map<string, CommandDefinition>();
  private commandHistory: string[] = [];
  private historyIndex = -1;
  private maxHistory = 100;

  /**
   * Enregistrer une commande
   */
  registerCommand(command: CommandDefinition): void {
    // Enregistrer le nom principal
    this.commands.set(command.name.toLowerCase(), command);

    // Enregistrer les alias
    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.commands.set(alias.toLowerCase(), command);
      });
    }
  }

  /**
   * Enregistrer plusieurs commandes
   */
  registerCommands(commands: CommandDefinition[]): void {
    commands.forEach((cmd) => this.registerCommand(cmd));
  }

  /**
   * Parser une ligne de commande
   */
  parseCommand(input: string): ParsedCommand | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Diviser en tokens
    const tokens = this.tokenize(trimmed);
    if (tokens.length === 0) return null;

    const commandName = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    return {
      name: commandName,
      args,
      raw: trimmed,
    };
  }

  /**
   * Tokenizer la ligne de commande
   * Supporte les guillemets simples et doubles
   */
  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && (i === 0 || input[i - 1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = '';
        } else {
          current += char;
        }
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) tokens.push(current);
    return tokens;
  }

  /**
   * Convertir les arguments selon les types définis
   */
  private convertArgs(
    rawArgs: string[],
    definition: CommandDefinition
  ): any[] | null {
    if (!definition.args) return rawArgs;

    const converted: any[] = [];

    for (let i = 0; i < definition.args.length; i++) {
      const argDef = definition.args[i];
      const rawValue = rawArgs[i];

      if (!rawValue && argDef.required) {
        return null; // Argument manquant
      }

      if (!rawValue) {
        converted.push(null);
        continue;
      }

      try {
        switch (argDef.type) {
          case 'number':
            const num = parseFloat(rawValue);
            if (isNaN(num)) return null;
            converted.push(num);
            break;

          case 'boolean':
            converted.push(
              rawValue.toLowerCase() === 'true' ||
                rawValue === '1' ||
                rawValue === 'yes'
            );
            break;

          case 'player':
            // Retourner l'ID du joueur tel quel, sera résolu plus tard
            converted.push(rawValue);
            break;

          case 'string':
          default:
            converted.push(rawValue);
            break;
        }
      } catch {
        return null;
      }
    }

    return converted;
  }

  /**
   * Exécuter une commande
   */
  async executeCommand(
    input: string,
    context: CommandContext
  ): Promise<{ success: boolean; message: string }> {
    const parsed = this.parseCommand(input);
    if (!parsed) {
      return { success: false, message: 'Commande invalide' };
    }

    // Ajouter à l'historique
    this.addToHistory(parsed.raw);

    // Chercher la commande
    const command = this.commands.get(parsed.name);
    if (!command) {
      return { success: false, message: `Commande inconnue: ${parsed.name}` };
    }

    // Vérifier les permissions
    const minLevel = command.minPermissionLevel ?? 0;
    if (context.player.permissionLevel < minLevel) {
      return {
        success: false,
        message: 'Permissions insuffisantes pour cette commande',
      };
    }

    // Convertir les arguments
    const args = this.convertArgs(parsed.args, command);
    if (args === null) {
      return {
        success: false,
        message: `Usage: /${command.name} ${
          command.args
            ?.map((a) => (a.required ? `<${a.name}>` : `[${a.name}]`))
            .join(' ') || ''
        }`,
      };
    }

    try {
      const result = await command.execute(args, context);
      return {
        success: true,
        message: result || `Commande exécutée: ${command.name}`,
      };
    } catch (error) {
      console.error(`Erreur exécution commande ${command.name}:`, error);
      return {
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      };
    }
  }

  /**
   * Obtenir la liste des commandes disponibles
   */
  getAvailableCommands(permissionLevel: number): CommandDefinition[] {
    const available: CommandDefinition[] = [];
    const seen = new Set<string>();

    this.commands.forEach((cmd) => {
      if (!seen.has(cmd.name)) {
        const minLevel = cmd.minPermissionLevel ?? 0;
        if (permissionLevel >= minLevel) {
          available.push(cmd);
          seen.add(cmd.name);
        }
      }
    });

    return available;
  }

  /**
   * Ajouter à l'historique
   */
  private addToHistory(command: string): void {
    this.commandHistory.push(command);
    if (this.commandHistory.length > this.maxHistory) {
      this.commandHistory.shift();
    }
    this.historyIndex = -1;
  }

  /**
   * Navigation dans l'historique (haut/bas)
   */
  getHistoryPrevious(): string | null {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      return this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
    }
    return null;
  }

  getHistoryNext(): string | null {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
    }
    this.historyIndex = -1;
    return '';
  }

  resetHistory(): void {
    this.historyIndex = -1;
  }

  /**
   * Obtenir l'historique complet
   */
  getHistory(): string[] {
    return [...this.commandHistory];
  }

  /**
   * Chercher les commandes correspondant à un préfixe
   */
  searchCommands(prefix: string): CommandDefinition[] {
    const results: CommandDefinition[] = [];
    const seen = new Set<string>();

    this.commands.forEach((cmd) => {
      if (
        !seen.has(cmd.name) &&
        cmd.name.toLowerCase().startsWith(prefix.toLowerCase())
      ) {
        results.push(cmd);
        seen.add(cmd.name);
      }
    });

    return results;
  }
}

export default CommandParser;
