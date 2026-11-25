"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import ThemeToggle from "@/components/ThemeToggle";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container";
import { Message, MessageAction, MessageActions, MessageContent } from "@/components/prompt-kit/message";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input";
import { ScrollButton } from "@/components/prompt-kit/scroll-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  Check,
  Copy,
  Image,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Boxes,
  Cpu,
  Plus,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";

type Role = "user" | "assistant";

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  preview: string;
};

type ConversationMessage = {
  id: string;
  role: Role;
  name: string;
  avatarFallback: string;
  avatarUrl?: string;
  content: string;
  markdown?: boolean;
  attachments?: Attachment[];
  reaction?: "upvote" | "downvote" | null;
};

type MessageTemplate = Omit<ConversationMessage, "id" | "attachments" | "reaction">;

type HistoryConversation = {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
};

type HistoryGroup = {
  label: string;
  conversations: HistoryConversation[];
};

type ProviderOption = {
  id: string;
  label: string;
  models: { id: string; label: string }[];
};

const providers: ProviderOption[] = [
  {
    id: "openai",
    label: "OpenAI",
    models: [
      { id: "gpt-4o", label: "GPT-4o" },
      { id: "gpt-4o-mini", label: "GPT-4o mini" },
      { id: "o3-mini", label: "O3 mini" },
    ],
  },
  {
    id: "anthropic",
    label: "Anthropic",
    models: [
      { id: "claude-3.7-sonnet", label: "Claude 3.7 Sonnet" },
      { id: "claude-3.5-haiku", label: "Claude 3.5 Haiku" },
    ],
  },
  {
    id: "google",
    label: "Google Gemini",
    models: [
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    ],
  },
  {
    id: "groq",
    label: "Groq",
    models: [
      { id: "llama-3.1-70b", label: "Llama 3.1 70B" },
      { id: "mixtral-8x7b", label: "Mixtral 8x7B" },
    ],
  },
];

const historySeed: HistoryGroup[] = [
  {
    label: "Today",
    conversations: [
      {
        id: "today-1",
        title: "Product launch prep",
        preview: "Drafted announcement copy and QA checklist for beta release.",
        timestamp: "2h ago",
      },
      {
        id: "today-2",
        title: "Onboarding survey",
        preview: "Outlined questions that capture first-week friction and success signals.",
        timestamp: "4h ago",
      },
      {
        id: "today-3",
        title: "Design critique notes",
        preview: "Summarised feedback threads and grouped by priority / owner.",
        timestamp: "6h ago",
      },
    ],
  },
  {
    label: "Earlier this week",
    conversations: [
      {
        id: "week-1",
        title: "Support triage ideas",
        preview: "Generated macros for the top friction requests from this week.",
        timestamp: "3 days ago",
      },
      {
        id: "week-2",
        title: "Growth experiment doc",
        preview: "Mapped out hypotheses, guardrail metrics, and rollout cadence.",
        timestamp: "5 days ago",
      },
    ],
  },
];

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

const messageTemplates: MessageTemplate[] = [
  {
    role: "assistant",
    name: "Nova",
    avatarFallback: "NO",
    content:
      "Hey there! I'm Nova, a prompt-kit powered assistant. Ask me anything about your product ideas, technical questions, or research tasks and I'll sketch out a plan you can wire up to your favourite model.",
  },
  {
    role: "user",
    name: "You",
    avatarFallback: "YO",
    content: "Let's create a user interview outline that digs into motivation and workflow pains.",
  },
  {
    role: "assistant",
    name: "Nova",
    avatarFallback: "NO",
    markdown: true,
    content: [
      "Absolutely — here's a structured outline you can use:",
      "",
      "### Interview Outline",
      "1. **Warm up** — \"Can you tell me about your role and day-to-day responsibilities?\"",
      "2. **Motivation** — \"What made you start using [product/workflow]?\"",
      "3. **Current process** — \"Walk me through your last attempt step-by-step.\"",
      "4. **Pain points** — \"Where does it feel slow, confusing, or fragile?\"",
      "5. **Desired outcomes** — \"If this was effortless, what would that unlock for you?\"",
      "",
      "Happy to tailor this if you share the audience or use case!",
    ].join("\n"),
  },
];

function createInitialMessages(): ConversationMessage[] {
  return messageTemplates.map((template) => ({
    ...template,
    id: createId(),
    attachments: template.role === "user" ? [] : undefined,
    reaction: null,
  }));
}

function updateConversationInGroups(
  groups: HistoryGroup[],
  conversationId: string,
  updater: (existing: HistoryConversation) => HistoryConversation,
): HistoryGroup[] {
  const next = cloneHistoryGroups(groups);
  for (const section of next) {
    const index = section.conversations.findIndex((c) => c.id === conversationId);
    if (index !== -1) {
      const existing = section.conversations[index];
      section.conversations[index] = updater(existing);
      break;
    }
  }
  return next;
}

function createPlaceholderConversation(title: string, preview: string): ConversationMessage[] {
  return [
    {
      id: createId(),
      role: "assistant",
      name: "Nova",
      avatarFallback: "NO",
      markdown: true,
      reaction: null,
      content: [
        `This is a placeholder view for **${title}**.`,
        "",
        preview,
        "",
        "Load real messages here by persisting conversations and hydrating them when the user opens the thread.",
      ].join("\n"),
    },
  ];
}

function cloneHistoryGroups(groups: HistoryGroup[]): HistoryGroup[] {
  return groups.map((section) => ({
    label: section.label,
    conversations: section.conversations.map((conversation) => ({ ...conversation })),
  }));
}

function buildInitialConversationMap(groups: HistoryGroup[]): Record<string, ConversationMessage[]> {
  const map: Record<string, ConversationMessage[]> = {};
  const primaryId = groups[0]?.conversations[0]?.id;

  groups.forEach((section) => {
    section.conversations.forEach((conversation) => {
      if (conversation.id === primaryId) {
        map[conversation.id] = createInitialMessages();
      } else {
        map[conversation.id] = createPlaceholderConversation(conversation.title, conversation.preview);
      }
    });
  });

  return map;
}

function findConversationTitle(groups: HistoryGroup[], conversationId: string): string {
  for (const section of groups) {
    const conversation = section.conversations.find((entry) => entry.id === conversationId);
    if (conversation) {
      return conversation.title;
    }
  }
  return "Untitled chat";
}

function truncateText(text: string, limit = 80): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}…`;
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function promoteConversation(
  groups: HistoryGroup[],
  conversationId: string,
  updater: (existing: HistoryConversation | null) => HistoryConversation,
): HistoryGroup[] {
  const next = cloneHistoryGroups(groups);
  let existing: HistoryConversation | null = null;

  for (const section of next) {
    const index = section.conversations.findIndex((conversation) => conversation.id === conversationId);
    if (index !== -1) {
      existing = section.conversations.splice(index, 1)[0];
      break;
    }
  }

  const updated = updater(existing);

  if (next.length === 0) {
    next.push({ label: "Today", conversations: [] });
  }

  next[0].conversations = [
    updated,
    ...next[0].conversations.filter((conversation) => conversation.id !== updated.id),
  ];

  return next;
}

const seedActiveConversationId = historySeed[0]?.conversations[0]?.id ?? createId();
const seedActiveConversationTitle = findConversationTitle(historySeed, seedActiveConversationId);

function Chatbot() {
  const [historyGroups, setHistoryGroups] = useState<HistoryGroup[]>(() => cloneHistoryGroups(historySeed));
  const [conversations, setConversations] = useState<Record<string, ConversationMessage[]>>(() =>
    buildInitialConversationMap(historySeed),
  );
  const [activeConversationId, setActiveConversationId] = useState(seedActiveConversationId);
  const [activeConversationTitle, setActiveConversationTitle] = useState(seedActiveConversationTitle);
  const [chatCounter, setChatCounter] = useState(() =>
    historySeed.reduce((total, section) => total + section.conversations.length, 0) + 1,
  );
  const [composerAttachments, setComposerAttachments] = useState<Attachment[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(providers[0].id);
  const [selectedModelId, setSelectedModelId] = useState(providers[0].models[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const activeProvider =
    providers.find((provider) => provider.id === selectedProviderId) ?? providers[0];
  const activeModel =
    activeProvider.models.find((model) => model.id === selectedModelId) ?? activeProvider.models[0];

  const messages = useMemo(
    () => conversations[activeConversationId] ?? [],
    [conversations, activeConversationId],
  );

  const hasPendingInput = input.trim().length > 0 || composerAttachments.length > 0;

  useEffect(() => {
    const provider =
      providers.find((item) => item.id === selectedProviderId) ?? providers[0];
    setSelectedModelId((current) =>
      provider.models.some((model) => model.id === current) ? current : provider.models[0].id,
    );
  }, [selectedProviderId]);

  const updateConversationMessages = (
    conversationId: string,
    updater: (current: ConversationMessage[]) => ConversationMessage[],
  ) => {
    setConversations((previous) => {
      const current = previous[conversationId] ?? [];
      const updated = updater(current);
      return { ...previous, [conversationId]: updated };
    });
  };

  const refreshHistoryPreview = (conversationId: string, preview: string, title?: string) => {
    setHistoryGroups((previous) =>
      updateConversationInGroups(previous, conversationId, (existing) => ({
        id: existing.id,
        title: title ?? existing.title,
        preview: truncateText(preview),
        timestamp: "Just now",
      })),
    );
  };

  const addAttachmentFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setComposerAttachments((previous) => [
        ...previous,
        {
          id: createId(),
          name: file.name || `pasted-image-${previous.length + 1}.png`,
          type: file.type,
          size: file.size,
          preview: reader.result,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handlePasteImages = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length === 0) return;

    event.preventDefault();
    files.forEach(addAttachmentFromFile);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length === 0) return;

    files.forEach(addAttachmentFromFile);
    event.target.value = "";
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setComposerAttachments((previous) =>
      previous.filter((attachment) => attachment.id !== attachmentId),
    );
  };

  const handleCopy = async (message: ConversationMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      window.setTimeout(() => {
        setCopiedMessageId((current) => (current === message.id ? null : current));
      }, 2000);
    } catch {
      setCopiedMessageId(null);
    }
  };

  const toggleReaction = (messageId: string, reaction: "upvote" | "downvote") => {
    const conversationId = activeConversationId;
    updateConversationMessages(conversationId, (current) =>
      current.map((message) =>
        message.id === messageId
          ? {
              ...message,
              reaction: message.reaction === reaction ? null : reaction,
            }
          : message,
      ),
    );
  };

  const handleSubmit = () => {
    if (!hasPendingInput || isGenerating) return;

    const conversationId = activeConversationId;
    const conversationTitle = activeConversationTitle;
    const prompt = input.trim();
    const attachments = composerAttachments.map((attachment) => ({ ...attachment }));
    const attachmentsSummary =
      attachments.length > 0
        ? `Shared ${attachments.length} attachment${attachments.length > 1 ? "s" : ""}`
        : undefined;

    const userContent =
      prompt || attachmentsSummary || "Sent a message";

    const userMessage: ConversationMessage = {
      id: createId(),
      role: "user",
      name: "You",
      avatarFallback: "YO",
      content: userContent,
      attachments: attachments.length ? attachments : undefined,
      reaction: null,
    };

    const providerSummary = `${activeProvider.label} • ${activeModel.label}`;
    const assistantMessage: ConversationMessage = {
      id: createId(),
      role: "assistant",
      name: "Nova",
      avatarFallback: "NO",
      markdown: true,
      reaction: null,
      content: [
        `Pretending to call ${providerSummary}.`,
        attachments.length
          ? `I spotted ${attachments.length} attachment${attachments.length > 1 ? "s" : ""}. Replace this with your vision/tool call.`
          : undefined,
        "Swap this helper with your real API handler and stream tokens into the conversation.",
      ]
        .filter(Boolean)
        .join("\n\n"),
    };

    updateConversationMessages(conversationId, (current) => [...current, userMessage]);
    refreshHistoryPreview(
      conversationId,
      prompt || attachmentsSummary || "Sent a message",
      conversationTitle,
    );

    setComposerAttachments([]);
    setInput("");
    setCopiedMessageId(null);
    setIsGenerating(true);

    window.setTimeout(() => {
      updateConversationMessages(conversationId, (current) => [...current, assistantMessage]);
      setIsGenerating(false);
    }, 600);
  };

  const handleNewChat = () => {
    const conversationId = createId();
    const conversationTitle = `Untitled chat ${chatCounter}`;

    setChatCounter((count) => count + 1);
    setConversations((previous) => ({
      ...previous,
      [conversationId]: [],
    }));
    setActiveConversationId(conversationId);
    setActiveConversationTitle(conversationTitle);
    setComposerAttachments([]);
    setInput("");
    setCopiedMessageId(null);
    setIsGenerating(false);
    setIsSidebarOpen(false);

    setHistoryGroups((previous) => {
      const next = cloneHistoryGroups(previous);
      if (next.length === 0) {
        next.push({ label: "Today", conversations: [] });
      }
      next[0].conversations = [
        {
          id: conversationId,
          title: conversationTitle,
          preview: "Say hello to Nova to get started.",
          timestamp: "Just now",
        },
        ...next[0].conversations,
      ];
      return next;
    });
  };

  const handleSelectConversation = (conversation: HistoryConversation) => {
    setActiveConversationId(conversation.id);
    setActiveConversationTitle(conversation.title);
    setIsSidebarOpen(false);
    setComposerAttachments([]);
    setInput("");
    setCopiedMessageId(null);
    setIsGenerating(false);

    setConversations((previous) => {
      if (previous[conversation.id]) {
        return previous;
      }

      return {
        ...previous,
        [conversation.id]: createPlaceholderConversation(
          conversation.title,
          conversation.preview,
        ),
      };
    });

    setHistoryGroups((previous) =>
      updateConversationInGroups(previous, conversation.id, (existing) => existing ?? { ...conversation }),
    );
  };

  const activeHistoryGroups = historyGroups;

  return (
    <div className="relative flex h-full overflow-hidden bg-background text-foreground">
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:h-full lg:shadow-none",
          isSidebarCollapsed ? "lg:hidden" : "lg:flex lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              History
            </p>
            <p className="text-sm font-medium text-foreground">Recent chats</p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle className="lg:hidden" />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close chat history"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="border-b border-border px-4 pb-4 pt-3">
          <Button variant="outline" size="sm" className="w-full" onClick={handleNewChat}>
            <Plus className="h-4 w-4" />
            <span className="ml-2">New chat</span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto pb-6">
          {activeHistoryGroups.map((section) => (
            <div key={section.label} className="px-4 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {section.label}
              </p>
              <div className="mt-3 space-y-2">
                {section.conversations.map((conversation) => {
                  const isActive = conversation.id === activeConversationId;
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      className={cn(
                        "w-full rounded-xl border border-transparent bg-transparent px-3 py-2 text-left transition hover:border-border hover:bg-accent/40",
                        isActive && "border-border bg-accent/40",
                      )}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="flex items-center justify-between text-sm font-medium text-foreground">
                        <span className="truncate">{conversation.title}</span>
                        <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {conversation.preview}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex h-full flex-1 flex-col overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open chat history"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:inline-flex"
                onClick={() => setIsSidebarCollapsed((v) => !v)}
                aria-label={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Nova
              </p>
              <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">
                {activeConversationTitle}
              </h1>
              <p className="text-xs text-muted-foreground">
                {activeProvider.label} · {activeModel.label}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle className="hidden lg:inline-flex" />
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden px-4 pb-6 pt-4 sm:px-8">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <ChatContainerRoot className="relative flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
              <ChatContainerContent className="flex w-full flex-col gap-6">
                {messages.map((message, index) => {
                  const isUser = message.role === "user";
                  const isLatestAssistant = !isUser && index === messages.length - 1;

                  return (
                    <Message
                      key={message.id}
                      className={cn(isUser ? "justify-end" : "justify-start")}
                      aria-live="polite"
                    >
                      <div className={cn("flex max-w-[38rem] flex-col gap-2", isUser ? "items-end" : "items-start")}>
                        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                          {message.name}
                        </span>
                        <div className="group flex w-full flex-col gap-2">
                          <MessageContent
                            markdown={message.markdown}
                            className={cn(
                              "rounded-3xl px-5 py-3 text-sm leading-6 shadow-sm transition-colors text-left",
                              isUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground prose-headings:mt-0 prose-headings:font-semibold prose-p:mt-2",
                            )}
                          >
                            {message.content}
                          </MessageContent>

                          {message.attachments && message.attachments.length > 0 ? (
                            <div className="mt-2 grid gap-3 sm:grid-cols-2">
                              {message.attachments.map((attachment) => (
                                <figure
                                  key={attachment.id}
                                  className="overflow-hidden rounded-xl border border-border bg-background/40"
                                >
                                  <img
                                    src={attachment.preview}
                                    alt={attachment.name}
                                    className="h-32 w-full object-cover"
                                  />
                                  <figcaption className="flex items-center justify-between truncate px-3 py-2 text-xs text-muted-foreground">
                                    <span className="truncate">{attachment.name}</span>
                                    <span className="shrink-0 pl-2">
                                      {formatFileSize(attachment.size)}
                                    </span>
                                  </figcaption>
                                </figure>
                              ))}
                            </div>
                          ) : null}

                          {!isUser ? (
                            <MessageActions
                              className={cn(
                                "-ml-1.5 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                                isLatestAssistant && "opacity-100",
                              )}
                            >
                              <MessageAction
                                tooltip={copiedMessageId === message.id ? "Copied" : "Copy message"}
                                delayDuration={100}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "rounded-full",
                                    copiedMessageId === message.id && "bg-emerald-500/10 text-emerald-400",
                                  )}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleCopy(message);
                                  }}
                                  aria-label={copiedMessageId === message.id ? "Message copied" : "Copy message"}
                                >
                                  {copiedMessageId === message.id ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </MessageAction>
                              <MessageAction
                                tooltip={
                                  message.reaction === "upvote" ? "Remove like" : "Mark response as helpful"
                                }
                                delayDuration={100}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "rounded-full",
                                    message.reaction === "upvote" && "bg-primary/10 text-primary",
                                  )}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    toggleReaction(message.id, "upvote");
                                  }}
                                  aria-pressed={message.reaction === "upvote"}
                                  aria-label="Mark response as helpful"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                              </MessageAction>
                              <MessageAction
                                tooltip={
                                  message.reaction === "downvote" ? "Remove dislike" : "Mark response as not helpful"
                                }
                                delayDuration={100}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "rounded-full",
                                    message.reaction === "downvote" && "bg-destructive/10 text-destructive",
                                  )}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    toggleReaction(message.id, "downvote");
                                  }}
                                  aria-pressed={message.reaction === "downvote"}
                                  aria-label="Mark response as not helpful"
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </MessageAction>
                            </MessageActions>
                          ) : null}
                        </div>
                      </div>
                    </Message>
                  );
                })}
                <ChatContainerScrollAnchor />
              </ChatContainerContent>

              <div className="pointer-events-none absolute bottom-4 right-4">
                <ScrollButton className="pointer-events-auto shadow-md" />
              </div>
            </ChatContainerRoot>
          </div>

          <PromptInput
            value={input}
            onValueChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isGenerating}
            className="mt-6 mb-4 border-border/90 bg-card/80 backdrop-blur"
            disabled={isGenerating}
          >
            <div className="flex flex-col gap-3">
              {composerAttachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Attachments
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {composerAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-muted/40"
                      >
                        <img
                          src={attachment.preview}
                          alt={attachment.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleRemoveAttachment(attachment.id);
                          }}
                          aria-label={`Remove ${attachment.name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white">
                          <span className="block truncate">{attachment.name}</span>
                          <span className="opacity-70">{formatFileSize(attachment.size)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <PromptInputTextarea
                aria-label="Message"
                placeholder="Message"
                onPaste={handlePasteImages}
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PromptInputAction tooltip="Paste or upload an image" side="top">
                    <Button asChild variant="ghost" size="icon" className="rounded-full">
                      <label className="flex cursor-pointer items-center justify-center">
                        <Image className="h-5 w-5" />
                        <span className="sr-only">Attach image</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </Button>
                  </PromptInputAction>

                  <div className="relative">
                    <PromptInputAction tooltip="Select provider" side="top">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-haspopup="listbox"
                        aria-expanded={isProviderMenuOpen}
                        onClick={() => {
                          setIsProviderMenuOpen((v) => !v);
                          setIsModelMenuOpen(false);
                        }}
                      >
                        <Boxes className="h-5 w-5" />
                      </Button>
                    </PromptInputAction>
                    {isProviderMenuOpen ? (
                      <div className="absolute bottom-10 left-0 z-10 w-44 rounded-lg border border-border bg-card p-1 shadow-md">
                        {providers.map((provider) => (
                          <button
                            key={provider.id}
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent/60",
                              selectedProviderId === provider.id && "bg-accent/40",
                            )}
                            role="option"
                            aria-selected={selectedProviderId === provider.id}
                            onClick={() => {
                              setSelectedProviderId(provider.id);
                              setIsProviderMenuOpen(false);
                            }}
                          >
                            <span className="truncate">{provider.label}</span>
                            {selectedProviderId === provider.id ? <Check className="h-4 w-4" /> : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="relative">
                    <PromptInputAction tooltip="Select model" side="top">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-haspopup="listbox"
                        aria-expanded={isModelMenuOpen}
                        onClick={() => {
                          setIsModelMenuOpen((v) => !v);
                          setIsProviderMenuOpen(false);
                        }}
                      >
                        <Cpu className="h-5 w-5" />
                      </Button>
                    </PromptInputAction>
                    {isModelMenuOpen ? (
                      <div className="absolute bottom-10 left-0 z-10 w-44 rounded-lg border border-border bg-card p-1 shadow-md">
                        {activeProvider.models.map((model) => (
                          <button
                            key={model.id}
                            type="button"
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent/60",
                              selectedModelId === model.id && "bg-accent/40",
                            )}
                            role="option"
                            aria-selected={selectedModelId === model.id}
                            onClick={() => {
                              setSelectedModelId(model.id);
                              setIsModelMenuOpen(false);
                            }}
                          >
                            <span className="truncate">{model.label}</span>
                            {selectedModelId === model.id ? <Check className="h-4 w-4" /> : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <PromptInputActions>
                  <PromptInputAction tooltip="Send message" delayDuration={100}>
                    <Button
                      type="button"
                      size="icon"
                      className="rounded-full"
                      onClick={handleSubmit}
                      disabled={!hasPendingInput || isGenerating}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </div>
            </div>
          </PromptInput>
        </div>
      </main>
    </div>
  );
}

export default Chatbot;
