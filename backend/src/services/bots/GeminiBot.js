const { GoogleGenerativeAI } = require('@google/generative-ai');
const BotInterface = require('./BotInterface');

const SYSTEM_PROMPT_CONTENT = `
Agente de Assistência: ImunoAjudaMG – versão 1.0

Atue em primeira pessoa como {ImunoAjudaMG}.
Sua função é orientar cidadãos de Minas Gerais sobre como buscar imunobiológicos especiais. Use os fluxos abaixo para organizar, guiar e executar a tarefa. Você tem acesso às ferramentas:
{[Parâmetros], [Fluxo_principal], [Fluxo_orientação], [Comandos_úteis], [Regras], [Limitações]}.

[Parâmetros]
[organizar] = repetir o que o usuário pediu para confirmar.
[estrutura] = criar mapa de atendimento e etapas.
[resumo] = explicar o que será feito com base na dúvida do usuário.
[localizar_crie] = consultar onde há centros CRIE próximos.
[verificar_critério] = listar se o caso do usuário é elegível.
[documentos] = informar quais documentos são exigidos.
[encaminhamento] = explicar como obter a prescrição correta.
[confirmar_usuario] = validar se a explicação foi suficiente.
[atualizar_dúvida] = adaptar a resposta conforme novas informações.

[Fluxo_principal]
[boas-vindas + nome] →
[organizar] →
[estrutura] →
[resumo] →
[Fluxo_orientação] →
[confirmar_usuario] →
[fim ou nova dúvida]

[Fluxo_orientação]
[verificar_critério] →
[localizar_crie] →
[documentos] →
[encaminhamento] →
[atualizar_dúvida]

[Comandos_úteis]
[perguntar_sintomas]: solicita ao usuário os sintomas/condições clínicas.
[listar_cries_mg]: exibe lista dos CRIEs disponíveis por cidade.
[explicar_papel_crie]: descreve o que o CRIE faz.
[exibir_vacinas_especiais]: lista exemplos de imunobiológicos especiais.
[verificar_caso_específico]: compara o caso informado com critérios do MS.
[passo_a_passo_atendimento]: orienta do início ao fim o que fazer.
[encaminhar_para_saude_local]: orienta como buscar UBS/ESF para encaminhamento.

[Regras]
1. Sempre atue como assistente de orientação, com foco no cidadão.
2. Use linguagem simples, mas respeitosa e precisa.
3. Confirme tudo com o usuário a cada passo.
4. Evite termos técnicos sem explicação.
5. Nunca ofereça diagnóstico. Apenas oriente para serviços públicos oficiais.
6. Toda resposta deve indicar o próximo passo prático.
7. O link correto para a FICHA PARA SOLICITAÇÃO DE IMUNOBIOLÓGICOS ESPECIAIS (CRIE) é http://vigilancia.saude.mg.gov.br/index.php/download/ficha-para-solicitacao-de-imunobiologicos-especiais-crie/?wpdmdl=18834

[Limitações]
- Não substituir profissionais de saúde.
- Não receitar imunobiológicos.
- Não indicar vacinas sem prescrição oficial.
- Atuar exclusivamente no contexto do SUS-MG.
- Manter dados de referência atualizados conforme publicações da SES/MG ou MS.
- Apenas use texto simples (não use markdown!).

[Exemplo]
Usuário: "Meu filho tem asplenia, como consigo a vacina contra meningite?"

ImunoAjudaMG:
Olá! Posso te ajudar com isso. Você está em Minas Gerais, certo? ✅
Vamos seguir o fluxo de atendimento para imunobiológicos especiais:

1️⃣ [verificar_critério] → Asplenia está sim na lista de indicações.
2️⃣ [localizar_crie] → Você pode buscar o CRIE mais próximo. Acesse o site oficial para saber onde tem CRIE.
3️⃣ [documentos] → Você vai precisar de laudo médico, prescrição e Cartão SUS.
4️⃣ [encaminhamento] → O médico do SUS precisa preencher o Formulário de Solicitação.

Qual orientação você deseja?
`.trim();

class GeminiBot extends BotInterface {
  constructor(apiKey) {
    super();
    if (!apiKey) {
      throw new Error('Gemini API key is not provided.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Generates a response using the Gemini model.
   * @param {string} prompt - The user's prompt.
   * @param {Array} history - An array of previous messages in the chat.
   * @returns {Promise<string>} The generated response from Gemini.
   */
  async generateResponse(prompt, history) {
    try {
      const messages = [];
      messages.push({ role: 'user', parts: [{ text: SYSTEM_PROMPT_CONTENT }] }); // Gemini treats system prompts as user messages in history

      // Adiciona o histórico da conversa
      history.forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
  
      const chat = this.model.startChat({
        history: messages,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        return text;
      }
      
      // If text is empty, try to extract more details from the response object
      let errorMessage = 'Desculpe, não consegui gerar uma resposta no momento.';
        
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        errorMessage += ` Motivo: Conteúdo bloqueado por ${response.promptFeedback.blockReason}.`;
      } else if (response.candidates && response.candidates.length > 0 && response.candidates[0].finishReason) {
          errorMessage += ` Motivo: Geração finalizada com razão: ${response.candidates[0].finishReason}.`;
      } else {
        errorMessage += ` Nenhuma resposta textual válida foi gerada.`;
      }
        
      // Log the full response for debugging purposes
      console.error('Gemini response without text:', response); 
        
      return errorMessage + ' Por favor, tente novamente.';
    } catch (error) {
      console.error('Error generating response from Gemini:', error);
      throw error;
    }
  }

  /**
   * Generates a title for the chat session based on the conversation history.
   * For GeminiBot, this will attempt to use the model to generate a title.
   * @param {Array} history - An array of previous messages in the chat.
   * @returns {Promise<string>} The suggested title for the chat session.
   */
  async generateTitle(history) {
    try {
      const messages = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Ensure there's at least one message with content before proceeding
      if (!messages || messages.length === 0 || !messages[0].parts || !messages[0].parts[0] || !messages[0].parts[0].text) {
        return 'Chat Session'; // Fallback if no valid messages
      }

      const chat = this.model.startChat({
        history: messages,
        generationConfig: {
          maxOutputTokens: 20, // Limit title length
        },
      });

      const result = await chat.sendMessage('Por favor, resuma a conversa acima em um título curto e conciso (com menos de 10 palavras). Não inclua frases conversacionais ou saudações. Apenas o título.');
      const response = await result.response;
      let title = response.text().trim();

      // Remove any leading/trailing quotes if the model returns them
      if (title.startsWith('"') && title.endsWith('"')) {
        title = title.slice(1, -1);
      }
      if (title.startsWith("'") && title.endsWith("'")) {
        title = title.slice(1, -1);
      }

      return title;
    } catch (error) {
      console.error('Error generating title from Gemini:', error);
      // Fallback to a generic title if title generation fails
      return 'Chat Session';
    }
  }
}

module.exports = GeminiBot;
