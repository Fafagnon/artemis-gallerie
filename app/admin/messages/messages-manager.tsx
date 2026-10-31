"use client";

import React, { useState } from "react";
import { ContactMessage } from "@/types/artemis";
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Phone,
  ExternalLink,
  Clock,
  User,
  Inbox,
  Search,
} from "lucide-react";

interface MessagesManagerProps {
  initialMessages: ContactMessage[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  const handleToggleStatus = async (msg: ContactMessage) => {
    const newStatus = msg.status === "unread" ? "read" : "unread";
    try {
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, status: newStatus }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: newStatus } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous supprimer définitivement ce message ?")) return;
    try {
      await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread" && m.status !== "unread") return false;
    if (filter === "read" && m.status !== "read") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = `${m.firstName} ${m.lastName}`.toLowerCase().includes(q);
      const matchContact = m.contactInfo.toLowerCase().includes(q);
      const matchMsg = (m.message || "").toLowerCase().includes(q);
      return matchName || matchContact || matchMsg;
    }
    return true;
  });

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  // Helper to extract clean digits for WhatsApp
  const getWhatsAppLink = (contact: string) => {
    const digits = contact.replace(/[^0-9]/g, "");
    if (digits.length >= 8) {
      return `https://wa.me/${digits}`;
    }
    return null;
  };

  const isEmail = (contact: string) => contact.includes("@");

  return (
    <div className="space-y-8">
      {/* Top Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-or font-semibold mb-1 flex items-center gap-2">
            <Inbox className="w-3.5 h-3.5" />
            <span>Direction Galerie Artemis</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            Boîte de réception
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Demandes de renseignements et contacts reçus depuis le site public.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-zinc-850 border border-zinc-800 text-xs">
            <span className="text-zinc-400">Total : </span>
            <span className="font-bold text-white">{messages.length}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
            <span className="text-amber-400">Non lus : </span>
            <span className="font-bold text-amber-300">{unreadCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#141416] p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Tous ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "unread"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Non lus ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "read"
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Traités ({messages.length - unreadCount})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 bg-[#0B0B0D] border border-zinc-750 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-or"
          />
        </div>
      </div>

      {/* Message List */}
      {filteredMessages.length === 0 ? (
        <div className="py-20 text-center bg-[#141416]/50 rounded-2xl border border-zinc-850">
          <Mail className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-300 font-medium">Aucun message pour l'instant</p>
          <p className="text-xs text-zinc-500 mt-1">
            Les messages envoyés depuis le formulaire de contact du site apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const waUrl = getWhatsAppLink(msg.contactInfo);
            const isUnread = msg.status === "unread";

            return (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isUnread
                    ? "bg-[#18181C] border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : "bg-[#141416] border-zinc-800 opacity-90"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full grid place-content-center text-xs font-bold ${
                        isUnread
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">
                          {msg.firstName} {msg.lastName}
                        </span>
                        {isUnread && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                        <span className="font-medium text-zinc-300 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-or" />
                          {msg.contactInfo}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-zinc-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 text-xs font-semibold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Répondre WhatsApp</span>
                      </a>
                    )}

                    {isEmail(msg.contactInfo) && (
                      <a
                        href={`mailto:${msg.contactInfo}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </a>
                    )}

                    <button
                      onClick={() => handleToggleStatus(msg)}
                      className={`p-2 rounded-lg text-xs transition-colors ${
                        isUnread
                          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                          : "bg-zinc-850 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                      }`}
                      title={isUnread ? "Marquer comme traité" : "Marquer comme non lu"}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${!isUnread ? "text-green-500" : ""}`}
                      />
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                      title="Supprimer le message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                {msg.message ? (
                  <div className="mt-3 p-4 rounded-xl bg-[#0E0E10] border border-zinc-800 text-sm text-zinc-200 leading-relaxed font-light">
                    {msg.message}
                  </div>
                ) : (
                  <div className="mt-2 text-xs italic text-zinc-500">
                    (Aucun message texte laissé, demande de rappel direct).
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

