// server/handlers.ts — résumé des handlers Socket.io

import { Server, Socket } from "socket.io";
import { ChatSystem }      from "@/systems/communication/chat/ChatSystem";
import { RadioSystem }     from "@/systems/communication/radio/RadioSystem";
import { PhoneSystem }     from "@/systems/communication/phone/PhoneSystem";
import { JobManager }      from "@/systems/jobs/JobManager";
import { PoliceDuty }     from "@/systems/jobs/duties/PoliceDuty";
import { AntiCheatEngine } from "@/systems/security/anticheat/AntiCheatEngine";

export function registerAllHandlers(io: Server, socket: Socket) {
  const uid = socket.data.uid;
  const player = global.playerMap.get(uid);

  // ═══ CHAT ═══
  socket.on("chat:send", (raw: string) => {
    if (!AntiCheatEngine.validateAction(uid, "chat", io)) return;
    ChatSystem.processMessage(
      raw, uid, player.displayName,
      player.position, player.job, player.faction,
      io, global.playerMap
    );
  });

  // ═══ RADIO ═══
  socket.on("radio:on",     (freq: number) => RadioSystem.turnOn(uid, freq, socket));
  socket.on("radio:off",    ()             => RadioSystem.turnOff(uid, socket));
  socket.on("radio:change", (freq: number) => RadioSystem.changeFrequency(uid, freq, socket));
  socket.on("radio:talk",   (msg: string)  => RadioSystem.transmit(uid, player.displayName, msg, io));

  // ═══ PHONE ═══
  socket.on("phone:call",   (number: string)          => PhoneSystem.call(uid, player.displayName, number, global.playerMap, io));
  socket.on("phone:sms",    (data: any)               => PhoneSystem.sendSMS(uid, player.displayName, data.to, data.content, io));
  socket.on("phone:hangup", ()                         => PhoneSystem.hangup(uid, io));

  // ═══ JOBS ═══
  socket.on("job:duty_on",  () => JobManager.goOnDuty(uid, player.position));
  socket.on("job:duty_off", () => JobManager.goOffDuty(uid));

  // ═══ POLICE ═══
  socket.on("police:charge",   (data: any) => PoliceDuty.addCharge(uid, player.displayName, data.suspect, data.suspectName, data.crime, io));
  socket.on("police:handcuff", (data: any) => PoliceDuty.handcuff(uid, data.suspect, data.suspectPos, player.position, io));
  socket.on("police:arrest",   (data: any) => PoliceDuty.arrest(uid, player.displayName, data.suspect, data.suspectName, io));
  socket.on("police:frisk",    (data: any) => PoliceDuty.frisk(uid, data.suspect, io));

  // ═══ ANTI-CHEAT (position update) ═══
  socket.on("player:position", (pos: any) => {
    AntiCheatEngine.validatePosition(uid, pos, 100, io);
  });
}