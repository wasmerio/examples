// CONTEÚDO DE EXEMPLO – substitua todos os textos pelos dados do seu negócio.
import type { Dict } from './en';

export const ptBr: Dict = {
  meta: {
    title: 'Studio Exemplo – landing page de exemplo para serviços locais',
    description:
      'Landing page bilíngue de exemplo para clínica, salão, estúdio ou consultoria. Troque esta descrição pelo que o seu negócio faz e onde.',
  },
  a11y: { skip: 'Pular para o conteúdo', menu: 'Menu', theme: 'Alternar modo escuro', language: 'Idioma' },
  nav: { services: 'Serviços', about: 'Sobre', pricing: 'Preços', faq: 'Dúvidas', contact: 'Contato' },
  hero: {
    badge: 'Conteúdo de exemplo – edite src/i18n/pt-br.ts',
    title: 'Atendimento atencioso e pontual no seu bairro',
    subtitle:
      'Este é um texto provisório para um negócio local. Diga quem você atende, o que faz e por que as pessoas escolhem você, em uma ou duas frases curtas.',
    primary: 'Agendar pelo WhatsApp',
    secondary: 'Ver serviços',
    waMessage: 'Olá! Gostaria de agendar um horário.',
    points: ['Horários de seg. a sáb.', 'Agendamento fácil', 'Português e inglês'],
  },
  services: {
    title: 'Serviços',
    subtitle: 'De três a seis serviços de exemplo. Mantenha cada descrição curta e concreta.',
    items: [
      { icon: 'calendar', title: 'Primeira consulta', text: 'Serviço de exemplo. Descreva o que acontece, quanto tempo leva e para quem é.' },
      { icon: 'sparkles', title: 'Tratamento principal', text: 'Serviço de exemplo. Conte o resultado esperado, sem prometer o que não pode garantir.' },
      { icon: 'heart', title: 'Sessões de retorno', text: 'Serviço de exemplo. Explique o plano de acompanhamento ou pacote em linguagem simples.' },
      { icon: 'home', title: 'Atendimento em domicílio', text: 'Serviço de exemplo. Informe a região atendida e eventual taxa extra.' },
      { icon: 'chat', title: 'Atendimento on-line', text: 'Serviço de exemplo. Diga quais ferramentas usa, como videochamada ou WhatsApp.' },
      { icon: 'shield', title: 'Pacotes e planos', text: 'Serviço de exemplo. Planos mensais, vale-presente ou pacotes para empresas.' },
    ],
  },
  about: {
    title: 'Sobre nós',
    text: [
      'História provisória. Conte quem está à frente do negócio, há quanto tempo atua na área e o que torna seu atendimento diferente.',
      'Inclua registros profissionais (por exemplo, número do conselho) somente se forem reais e estiverem em dia.',
    ],
    facts: [
      { label: 'Endereço', value: 'Sua Cidade, UF' },
      { label: 'Horário', value: 'Seg–Sex 9h–18h · Sáb 9h–13h' },
      { label: 'Idiomas', value: 'Português, inglês' },
    ],
  },
  pricing: {
    title: 'Preços',
    subtitle: 'Preços de exemplo – troque pelos seus.',
    popular: 'Mais escolhido',
    cta: 'Perguntar no WhatsApp',
    plans: [
      { name: 'Sessão avulsa', price: 'R$ 150', period: 'por sessão', features: ['Uma sessão', 'Até 50 minutos', 'Orientações por e-mail'] },
      { name: 'Plano mensal', price: 'R$ 520', period: 'por mês', features: ['Quatro sessões', 'Prioridade na agenda', 'Suporte pelo WhatsApp'], featured: true },
      { name: 'Sob medida', price: 'Orçamento', period: 'sob consulta', features: ['Grupos ou empresas', 'Agenda flexível', 'Emissão de nota fiscal'] },
    ],
  },
  testimonials: {
    title: 'O que dizem os clientes',
    note: 'Espaço reservado – publique apenas avaliações reais, com autorização do cliente.',
    items: [
      { quote: 'A primeira avaliação real de um cliente vai aqui.', name: 'Nome do cliente', role: 'Exemplo provisório' },
      { quote: 'A segunda avaliação real de um cliente vai aqui.', name: 'Nome do cliente', role: 'Exemplo provisório' },
      { quote: 'A terceira avaliação real de um cliente vai aqui.', name: 'Nome do cliente', role: 'Exemplo provisório' },
    ],
  },
  faq: {
    title: 'Perguntas frequentes',
    items: [
      { q: 'Como faço para agendar?', a: 'Resposta de exemplo. Toque no botão do WhatsApp e envie a mensagem pronta, ou mande um e-mail. Respondemos no horário de atendimento.' },
      { q: 'Quais formas de pagamento vocês aceitam?', a: 'Resposta de exemplo. Liste as formas que você realmente aceita, como Pix, cartão ou dinheiro.' },
      { q: 'Posso cancelar ou remarcar?', a: 'Resposta de exemplo. Informe sua política, por exemplo, alterações sem custo até 24 horas antes.' },
      { q: 'Onde vocês ficam?', a: 'Resposta de exemplo. Indique o bairro, estacionamento ou transporte público próximo.' },
    ],
  },
  contact: {
    title: 'Vamos agendar?',
    text: 'Fale com a gente pelo WhatsApp ou envie um e-mail. Troque estes links em src/site.config.ts.',
    whatsapp: 'Conversar no WhatsApp',
    email: 'Enviar e-mail',
    emailSubject: 'Pedido de agendamento',
  },
  footer: { rights: 'Todos os direitos reservados.', made: 'Feito com Astro e Tailwind CSS · tema Balcão' },
};
