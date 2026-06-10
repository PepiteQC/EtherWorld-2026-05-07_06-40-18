// src/systems/admin/CommandParser.ts

import { ParsedCommand } from "./types";

export class CommandParser {
  static parse(raw: string): ParsedCommand | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    // Supporte les strings entre guillemets → admin kick "Jean Tremblay" spam
    const regex = /[^\s"]+|"([^"]*)"/gi;
    const parts: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(trimmed)) !== null) {
      parts.push(match[1] !== undefined ? match[1] : match[0]);
    }

    if (parts.length === 0) return null;

    return {
      verb: parts[0].toLowerCase(),
      args: parts.slice(1),
      raw: trimmed,
    };
  }

  static sanitize(input: string): string {
    // Sécurité - enlève les caractères dangereux
    return input
      .replace(/[<>{}()\[\]\\]/g, "")
      .substring(0, 256);
  }
}