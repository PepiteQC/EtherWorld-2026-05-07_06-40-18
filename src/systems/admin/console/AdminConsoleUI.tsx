/**
 * AdminConsoleUI.tsx - Interface console admin in-game
 * Similaire à la console FiveM mais pour EtherWorld RP
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronRight, X, Maximize2, Minimize2 } from 'lucide-react';
import { CommandParser, CommandContext } from '../console/CommandParser';
import { PermissionSystem } from '../permissions/PermissionSystem';
import { AllCommands } from '../commands/StandardCommands';

interface ConsoleMessage {
  type: 'input' | 'output' | 'error' | 'info' | 'success' | 'warn';
  text: string;
  timestamp: number;
  command?: string;
}

interface AdminConsoleUIProps {
  isOpen: boolean;
  onClose: () => void;
  playerId: string;
  playerName: string;
  permissionLevel: number;
  onCommand?: (command: string, result: any) => void;
}

/**
 * Composant console admin
 */
export const AdminConsoleUI: React.FC<AdminConsoleUIProps> = ({
  isOpen,
  onClose,
  playerId,
  playerName,
  permissionLevel,
  onCommand,
}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const parserRef = useRef(new CommandParser());
  const permissionSystemRef = useRef(new PermissionSystem());

  // Initialiser le parser avec les commandes
  useEffect(() => {
    parserRef.current.registerCommands(AllCommands);
  }, []);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus sur l'input quand la console s'ouvre
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Ajouter un message à la console
  const addMessage = useCallback((message: ConsoleMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  // Exécuter une commande
  const executeCommand = useCallback(
    async (commandText: string) => {
      if (!commandText.trim()) return;

      // Ajouter l'input à la console
      addMessage({
        type: 'input',
        text: `> ${commandText}`,
        timestamp: Date.now(),
        command: commandText,
      });

      // Préparer le contexte
      const context: CommandContext = {
        player: {
          id: playerId,
          name: playerName,
          permissionLevel,
        },
        timestamp: Date.now(),
        source: 'in-game',
      };

      // Exécuter la commande
      const result = await parserRef.current.executeCommand(commandText, context);

      // Ajouter le résultat
      addMessage({
        type: result.success ? 'success' : 'error',
        text: result.message,
        timestamp: Date.now(),
        command: commandText,
      });

      // Callback optionnel
      if (onCommand) {
        onCommand(commandText, result);
      }

      // Vider l'input
      setInput('');
    },
    [playerId, playerName, permissionLevel, addMessage, onCommand]
  );

  // Gérer les touches clavier
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = parserRef.current.getHistoryPrevious();
      if (prev) setInput(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = parserRef.current.getHistoryNext();
      if (next !== null) setInput(next);
    }
  };

  // Obtenir la couleur du message
  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'input':
        return 'text-gray-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-white';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black bg-opacity-95 border-t-2 border-green-500 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-sm font-bold">CONSOLE ADMIN</span>
          <span className="text-gray-500 text-xs">
            {playerName} [{permissionLevel}]
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white transition p-1"
            title={isMinimized ? 'Restaurer' : 'Minimiser'}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1"
            title="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Console Content */}
      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="h-64 overflow-y-auto bg-black p-3 space-y-1 text-sm">
            {messages.length === 0 ? (
              <div className="text-gray-600 italic">
                Console admin chargée. Tapez /help pour les commandes disponibles.
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`${getMessageColor(msg.type)}`}>
                  {msg.text}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-gray-900 border-t border-gray-700 p-3 flex items-center gap-2">
            <ChevronRight size={16} className="text-green-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Entrez une commande..."
              className="flex-1 bg-transparent text-white outline-none text-sm"
              autoComplete="off"
            />
          </div>

          {/* Quick Help */}
          <div className="bg-gray-950 border-t border-gray-700 px-3 py-2 text-xs text-gray-500 flex justify-between">
            <div>ESC = Fermer | ↑↓ = Historique | /help = Aide</div>
            <div>{messages.length} messages</div>
          </div>
        </>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <div className="bg-gray-900 p-2 border-t border-gray-700 flex items-center justify-between">
          <span className="text-gray-500 text-xs">Console minimisée</span>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Hook pour utiliser la console admin
 */
export const useAdminConsole = (playerId: string, playerName: string, permissionLevel: number) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ouvrir la console avec "/" ou "F8" (comme FiveM)
      if ((e.key === '/' || e.key === 'F8') && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    close: () => setIsOpen(false),
    open: () => setIsOpen(true),
  };
};

export default AdminConsoleUI;
