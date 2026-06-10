// server/adminHandler.ts

import { Server, Socket } from "socket.io";
import { CommandParser }    from "../systems/admin/CommandParser";
import { CommandRegistry }  from "../systems/admin/CommandRegistry";
import { PermissionSystem } from "../systems/admin/PermissionSystem";

export function registerAdminHandlers(io: Server, socket: Socket) {
  const context = {
    players: global.playerMap,
    broadcast: (msg: string) => io.emit("chat:broadcast", { msg, system: true }),
    socket: io,
    scene: null,
    world: global.rapierWorld,
  };

  socket.on("admin:command", async (raw: string) => {
    const player = global.playerMap.get(socket.id);
    if (!player) return;

    const role = await PermissionSystem.getPlayerRole(player.uid);
    if (role === "player") {
      socket.emit("admin:result", {
        success: false,
        message: "🚫 Accès refusé",
        type: "error",
      });
      return;
    }

    const parsed = CommandParser.parse(CommandParser.sanitize(raw));
    if (!parsed) return;

    const cmd = CommandRegistry.get(parsed.verb);
    if (!cmd) {
      socket.emit("admin:result", {
        success: false,
        message: `❌ Commande inconnue: ${parsed.verb}`,
        type: "error",
      });
      return;
    }

    if (!PermissionSystem.hasPermission(role, cmd.minRole)) {
      socket.emit("admin:result", {
        success: false,
        message: `🚫 Rôle requis: ${cmd.minRole}`,
        type: "error",
      });
      return;
    }

    const result = await cmd.execute(parsed.args, player, context);
    socket.emit("admin:result", result);
  });
}