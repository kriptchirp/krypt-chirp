import React, { useState, useEffect } from 'react';
import { PhoneOutgoing, Delete, Shield, Key } from 'lucide-react';


export default function Terminal({ userKey, onCall, targetKey, setTargetKey }) {
  const [contacts, setContacts] = useState([]);
  const [targetKey, setTargetKey] = useState('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const agendaSalva = localStorage.getItem('kchirp_agenda');
    if (agendaSalva) {
      try {
        setContacts(JSON.parse(agendaSalva));
      } catch (e) {
        console.error("Erro ao carregar contatos no terminal", e);
      }
    }
  }, []);

  const handleSelectContact = (userKey) => {
    setTargetKey(userKey); // Preenche o input do endereço de destino com a chave do contato clicado
  };

  const handleDelete = () => {
    setTargetKey('');
  };

  // Sintetizador de áudio simples (Web Audio API) para dar o som de bip retrô nos botões
  const playBeep = (freq, duration) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = freq; // Frequência em Hz
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Volume baixo para não estourar o ouvido
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log("AudioContext bloqueado ou não suportado:", e);
    }
  };

  const handleKeyPress = (char) => {
    playBeep(880, 0.05); // Bip agudo rápido
    if (targetKey.length < 15) { // Limite do tamanho da chave
      setTargetKey(prev => prev + char);
    }
  };

  const handleDelete = () => {
    playBeep(440, 0.05); // Bip mais grave para erro/delete
    setTargetKey(prev => prev.slice(0, -1));
  };

  const handleCallSubmit = () => {
    if (targetKey.trim().length > 3) {
      playBeep(1200, 0.15); // Bip de sucesso/ativação
      onCall(targetKey.toUpperCase());
    } else {
      playBeep(220, 0.3); // Bip de erro
    }
  };

  const copiarChaveParaClipboard = () => {
  navigator.clipboard.writeText(userKey); // userDeviceKey é a variável com a sua chave
  setCopiado(true);
  setTimeout(() => setCopiado(false), 2000); // Reseta o texto do botão após 2 segundos
};

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      {/* Visor de Status do Terminal */}
      <div className="border border-acidGreenDim bg-terminalGray p-4 rounded shadow-green-glow">
        <div className="flex items-center justify-between border-b border-acidGreenDim pb-2 mb-2">
          <span className="text-xs font-bold tracking-widest flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-acidGreen animate-pulse" /> SYSTEM: ACTIVE
          </span>
          <span className="text-[10px] text-acidGreenDim">P2P_MODE_SECURE</span>
        </div>
        <div className="space-y-1">

  <div className="terminal-my-key-container border border-green-500/30 p-3 bg-black/80 rounded mb-4">
    <div className="text-xs text-green-500/60 font-mono uppercase">Seu Identificador (userKey):</div>
    <div className="flex items-center justify-between gap-2 mt-1">
      <span className="font-mono text-sm text-green-400 select-all truncate">
        {userKey}
      </span>
      <button
        onClick={copiarChaveParaClipboard}
        className={`px-3 py-1 font-mono text-xs border rounded transition-all duration-300 ${
          copiado 
            ? 'bg-green-500/20 text-green-300 border-green-400' 
            : 'bg-black text-green-500 border-green-500/50 hover:bg-green-500/10'
        }`}
      >
        {copiado ? 'COPIADO!' : 'COPIAR'}
      </button>
    </div>
  </div>

          <div className="flex justify-between text-xs">
            <span className="text-acidGreenDim">ENDEREÇO DE HARDWARE:</span>
            <span className="font-bold">{userKey}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-acidGreenDim">REGRA DE RETENÇÃO:</span>
            <span className="text-radioactiveOrange font-bold">90 SEC MAX / RASTRO ZERO</span>
          </div>
        </div>
      </div>

      {/* Input de Destino */}
    <div className="flex flex-col space-y-2">
        <label className="text-xs text-acidGreenDim tracking-wider">
          [ INSIRA O ENDEREÇO DE DESTINO ]
        </label>
        <div className="relative flex items-center border border-acidGreen bg-oledBlack p-3 rounded text-base font-mono font-bold tracking-widest text-center justify-center min-h-[56px] shadow-green-glow">
          {targetKey || (
            <span className="text-acidGreenDim animate-pulse text-xs font-normal font-mono">
              SELECIONE UM CONTATO OU DIGITE...
            </span>
          )}
          {targetKey && (
            <button 
              onClick={handleDelete}
              className="absolute right-3 p-1 text-acidGreenDim hover:text-radioactiveOrange transition-colors"
            >
              {/* Substitua por sua tag de ícone ou texto simples */}
              <span className="font-mono text-xs font-bold">[X]</span>
            </button>
          )}
        </div>
      </div>

      {/* Agenda Rápida Integrada no Terminal */}
      <div className="flex flex-col space-y-1">
        <label className="text-[10px] text-acidGreenDim tracking-wider uppercase">
          [ SELECIONAR CONTATO RAPIDO ]
        </label>
        
        <div className="border border-borderGray rounded bg-black/40 max-h-[120px] overflow-y-auto divide-y divide-borderGray/30">
          {contacts.length === 0 ? (
            <div className="p-3 text-center text-xs text-acidGreenDim font-mono">
              Nenhum contato na agenda. Cadastre na aba [ AGENDA ].
            </div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.key}
                onClick={() => handleSelectContact(contact.key)}
                className={`w-full flex justify-between items-center p-2.5 text-left font-mono transition-all ${
                  targetKey === contact.key 
                    ? 'bg-acidGreen/20 text-acidGreen font-bold' 
                    : 'hover:bg-acidGreen/10 text-acidGreenDim hover:text-acidGreen'
                }`}
              >
                <span className="text-xs truncate max-w-[120px]">{contact.name}</span>
                <span className="text-[10px] opacity-70">{contact.key}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Botão de Disparo / Chamar */}
      {targetKey && (
        <button
          onClick={() => onCall(targetKey)}
          className="w-full py-3 bg-acidGreen text-oledBlack font-bold font-mono text-center tracking-widest hover:bg-green-400 active:scale-95 transition-all shadow-green-glow rounded"
        >
          [ INICIAR TRANSMISSÃO P2P ]
        </button>
      )}

      <div className="grid grid-cols-5 gap-1.5">
        {/* Números e letras hexadecimais para bater com o SHA-256 parcial */}
        {['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', '-', '0', 'A', 'B', 'C', 'D', 'E', 'F', 'K'].map((char) => (
          <button
            key={char}
            onClick={() => handleKeyPress(char)}
            className="py-3 bg-terminalGray border border-borderGray rounded text-lg font-bold hover:bg-acidGreenDim hover:border-acidGreen hover:text-acidGreen hover:shadow-green-glow transition-all active:scale-95 duration-100"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Botão de Disparo / Chamar */}
      <button
        onClick={handleCallSubmit}
        disabled={!targetKey}
        className={`w-full py-4 rounded font-bold text-sm tracking-widest uppercase border flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
          targetKey 
            ? 'bg-radioactiveOrange border-radioactiveOrange text-oledBlack hover:bg-transparent hover:text-radioactiveOrange hover:shadow-orange-glow' 
            : 'bg-terminalGray border-borderGray text-gray-700 cursor-not-allowed'
        }`}
      >
        <PhoneOutgoing className="w-4 h-4" /> Iniciar Chamado (K-Chirp)
      </button>
    </div>
  );
}