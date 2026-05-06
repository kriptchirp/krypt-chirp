# POLÍTICA DE PRIVACIDADE — K-CHIRP

Última atualização: Maio de 2026

A sua privacidade é o pilar fundamental do desenvolvimento do K-Chirp. Nossa política de privacidade é extremamente simples e direta: **NÓS NÃO COLETAMOS SEUS DADOS.**

### 1. COLETA E ARMAZENAMENTO DE DADOS PESSOAIS
O K-Chirp adota uma arquitetura de **Rastro Zero por Design**. 
* **Sem Cadastro:** Não solicitamos e-mail, nome completo, número de telefone, documentos ou dados de localização para o uso básico do terminal.
* **Sem Banco de Dados Central:** Não coletamos, processamos ou armazenamos suas mensagens de texto, transmissões de áudio ou metadados de ligação em servidores externos.
* **Identificação:** A sua identificação (Key) é um hash gerado localmente pelo seu próprio hardware de forma anônima.

### 2. DADOS EM TRÂNSITO (WEBRTC P2P)
As comunicações de áudio e texto são transmitidas de ponta a ponta (P2P) com criptografia nativa provida pelo protocolo WebRTC do navegador. O servidor de sinalização (hospedado na Vercel) é utilizado de forma estritamente efêmera apenas para promover o "aperto de mão" (handshake) inicial entre os dois dispositivos. 
* Assim que a conexão física é estabelecida ou expira o tempo limite de 30 segundos do handshake, as informações de IP temporárias são permanentemente apagadas da RAM do servidor de sinalização.

### 3. AUTODESTRUIÇÃO DE MENSAGENS (RAM ISOLATION)
Para mitigar riscos de segurança física (como roubo ou eventuais infortunos do aparelho celular), todas as mensagens de texto enviadas no console do Rádio trafegam e residem temporariamente em memória volátil (RAM) e são programadas para autodestruição irreversível após 60 (sessenta) segundos, não sendo salvas no armazenamento persistente do celular.

### 4. PERMISSÕES DE HARDWARE EXIGIDAS
Para o correto funcionamento do aplicativo, o K-Chirp solicita acesso às seguintes APIs do seu navegador/sistema operacional:
* **Microfone:** Necessário estritamente para capturar sua voz durante a transmissão do rádio. O áudio é convertido em stream P2P criptografado e nunca é gravado.
* **Notificações & Vibração:** Necessário para registrar o Service Worker em segundo plano, permitindo que o dispositivo vibre e emita o sinal acústico (chirp) quando um contato autorizado tentar iniciar uma chamada.

### 5. CONTATO E ESCLARECIMENTOS
Por se tratar de um projeto descentralizado e sem armazenamento de dados, o desenvolvedor não possui relatórios de privacidade a fornecer, uma vez que não detém qualquer dado pessoal do usuário sob sua custódia. Para dúvidas técnicas, o código-fonte está disponível de forma transparente no repositório oficial do GitHub.