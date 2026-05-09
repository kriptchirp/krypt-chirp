import React, { useState, useEffect } from 'react';
import { PhoneOutgoing, Shield } from 'lucide-react';

export default function Terminal({ userKey, onCall, targetKey, setTargetKey }) {
  const [contacts, setContacts] = useState([]);
  const [copiado, setCopiado] = useState(false);

  // CORREÇÃO: Lê exatamente a mesma chave usada na Agenda!
  useEffect(() => {
    const agendaSalva = localStorage.getItem('kchirp_local_contacts');
    if (agendaSalva) {
      try {
        setContacts(JSON.parse(agendaSalva));
      } catch (e) {
        console.error("Erro ao carregar contatos no terminal", e);
      }
    }
  }, []); // Carrega apenas ao montar o componente para melhor performance

  const handleSelectContact = (contactKey) => {
    playBeep(1000, 0.1);
    if (contactKey) setTargetKey(contactKey);
  };

  const playBeep = (freq, duration) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log("AudioContext bloqueado:", e);
    }
  };

  const handleKeyPress = (char) => {
    playBeep(880, 0.05);
    if ((targetKey || '').length < 15) {
      setTargetKey(prev => prev + char);
    }
  };

  const handleDelete = () => {
    playBeep(440, 0.05);
    setTargetKey(prev => prev.slice(0, -1));
  };

  const handleCallSubmit = () => {
  if (targetKey && userKey) { // Precisamos de ambas aqui
    playBeep(880, 0.1);
    
    // Se o seu getTunnelId usa a ordem (Dono da Agenda, Chave do Amigo)
    // No terminal, você é o 'dono' (userKey) e o amigo é o 'targetKey'
    console.log(`[K-CHIRP] Criando túnel entre ${userKey} e ${targetKey}`);
    
    onCall(targetKey); // O App.jsx vai receber isso e o useKChirp fará o resto
  }
};

  const copiarChaveParaClipboard = () => {
    navigator.clipboard.writeText(userKey);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      
      {/* Visor de Status do Terminal */}
      <div className="border border-acidGreenDim bg-terminalGray p-3.5 rounded shadow-green-glow shrink-0">
        <div className="flex items-center justify-between border-b border-acidGreenDim pb-1.5 mb-2">
          <span className="text-[11px] font-bold tracking-widest flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-acidGreen animate-pulse" /> SYSTEM: ACTIVE
          </span>
          <span className="text-[10px] text-acidGreenDim">P2P_MODE_SECURE</span>
        </div>
        
        <div className="space-y-1">
          <div className="border border-green-500/30 p-2.5 bg-black/80 rounded mb-2">
            <div className="text-[10px] text-green-500/60 font-mono uppercase">Seu Identificador (userKey):</div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="font-mono text-xs text-green-400 select-all truncate">
                {userKey}
              </span>
              <button
                onClick={copiarChaveParaClipboard}
                className={`px-2.5 py-0.5 font-mono text-[10px] border rounded transition-all duration-300 ${
                  copiado 
                    ? 'bg-green-500/20 text-green-300 border-green-400' 
                    : 'bg-black text-green-500 border-green-500/50 hover:bg-green-500/10'
                }`}
              >
                {copiado ? 'COPIADO!' : 'COPIAR'}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-[11px]">
            <span className="text-acidGreenDim">DESTINO ATUAL:</span>
            {/* CORREÇÃO: Exibe com segurança o valor de targetKey ou "NENHUM" */}
            <span className="font-bold text-acidGreen">{targetKey || "AGUARDANDO..."}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-acidGreenDim">RETENÇÃO DE DADOS:</span>
            <span className="text-radioactiveOrange font-bold">ZERO LOGS / RAM-ONLY</span>
          </div>
        </div>
      </div>

      {/* Input de Destino */}
      <div className="flex flex-col space-y-1.5 shrink-0">
        <label className="text-[10px] text-acidGreenDim tracking-wider">
          [ ENDEREÇO DE DESTINO ]
        </label>
        <div className="relative flex items-center border border-acidGreen bg-oledBlack p-2.5 rounded text-sm font-mono font-bold tracking-widest text-center justify-center min-h-[46px] shadow-green-glow">
          {targetKey || (
            <span className="text-acidGreenDim animate-pulse text-[10px] font-normal font-mono">
              SELECIONE ABAIXO
            </span>
          )}
          {targetKey && (
            <button 
              onClick={handleDelete}
              className="absolute right-3 p-1 text-acidGreenDim hover:text-radioactiveOrange transition-colors"
            >
              <span className="font-mono text-xs font-bold">[X]</span>
            </button>
          )}
        </div>
      </div>

      {/* Agenda Rápida Integrada no Terminal */}
      <div className="flex flex-col space-y-1 flex-1 min-h-[80px]">
        <label className="text-[9px] text-acidGreenDim tracking-wider uppercase">
          [ SELECIONAR DA AGENDA LOCAL ]
        </label>
        
        <div className="border border-borderGray rounded bg-black/40 overflow-y-auto divide-y divide-borderGray/30 flex-1 max-h-[110px]">
          {contacts.length === 0 ? (
            <div className="p-3 text-center text-xs text-acidGreenDim font-mono">
              Nenhum contato autorizado encontrado.
            </div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact.key)}
                className={`w-full flex justify-between items-center p-2 text-left font-mono transition-all ${
                  targetKey === contact.key 
                    ? 'bg-acidGreen/20 text-acidGreen font-bold' 
                    : 'hover:bg-acidGreen/10 text-acidGreenDim hover:text-acidGreen'
                }`}
              >
                <span className="text-xs truncate max-w-[150px]">{contact.name}</span>
                <span className="text-[10px] opacity-70 font-bold">{contact.key}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Teclado Virtual Compacto */}
      <div className="grid grid-cols-5 gap-1 shrink-0">
        {['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', '-', '0', 'C', 'D', 'E', 'F', 'K'].map((char) => (
          <button
            key={char}
            onClick={() => handleKeyPress(char)}
            className="py-2 bg-terminalGray border border-borderGray rounded text-sm font-mono font-bold hover:bg-acidGreenDim hover:border-acidGreen hover:text-acidGreen hover:shadow-green-glow transition-all active:scale-95 duration-700"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Botão Principal de Disparo */}
      <button
        onClick={handleCallSubmit}
        disabled={!targetKey}
        className={`w-full py-3.5 rounded font-bold text-xs tracking-widest uppercase border flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shrink-0 ${
          targetKey 
            ? 'bg-radioactiveOrange border-radioactiveOrange text-oledBlack hover:bg-transparent hover:text-radioactiveOrange hover:shadow-orange-glow' 
            : 'bg-terminalGray border-borderGray text-gray-700 cursor-not-allowed'
        }`}
      >
        <PhoneOutgoing className="w-4 h-4" /> Iniciar Linha (Chirp)
      </button>
    </div>
  );
}