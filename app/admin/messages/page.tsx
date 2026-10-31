import { getContactMessages } from "@/lib/db";
import { MessagesManager } from "./messages-manager";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const initialMessages = await getContactMessages();

  return <MessagesManager initialMessages={initialMessages} />;
}

