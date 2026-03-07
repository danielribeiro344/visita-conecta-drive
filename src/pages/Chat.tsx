import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppData } from "@/hooks/useAppData";

interface ChatMessage {
  id: string;
  senderId: string;
  senderNome: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

const CHAT_KEY = "visita_conecta_chat";

function readMessages(): ChatMessage[] {
  const raw = localStorage.getItem(CHAT_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

function persistMessages(messages: ChatMessage[]) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
}

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { usersById } = useAppData();

  const contactId = searchParams.get("contact") || "";
  const currentUserId = searchParams.get("as") || "";

  const contact = usersById.get(contactId);
  const currentUser = usersById.get(currentUserId);

  const [allMessages, setAllMessages] = useState<ChatMessage[]>(() => readMessages());
  const messages = useMemo(
    () =>
      allMessages.filter(
        (m) =>
          (m.senderId === currentUserId && m.receiverId === contactId) ||
          (m.senderId === contactId && m.receiverId === currentUserId),
      ),
    [allMessages, contactId, currentUserId],
  );

  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderNome: currentUser.nome,
      receiverId: contactId,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const next = [...allMessages, msg];
    setAllMessages(next);
    persistMessages(next);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card border-b border-border px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{(contact?.nome || "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{contact?.nome ?? "Contato"}</p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isMine ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          );
        })}
        {messages.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">Inicie uma conversa</p>
          </div>
        )}
      </div>

      <div className="bg-card border-t border-border px-4 py-3 safe-bottom">
        <div className="flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            rows={1}
            className="flex-1 bg-muted rounded-2xl px-4 py-3 text-sm text-foreground resize-none outline-none placeholder:text-muted-foreground max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shrink-0 disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
