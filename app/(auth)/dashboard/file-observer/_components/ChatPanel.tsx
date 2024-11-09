import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";

export default function ChatPanel({
    documentId,
}: {
    documentId: Id<"documents">;
}) {
    // Fetch chats from Convex API for a specific document
    //   const chats = useQuery(api.chats.getChatsForDocument, { documentId });
    const chats = useQuery(api.chats.getChatsForDocument, { documentId });
    const askQuestion = useAction(api.documents.askQuestion);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); // Reset error state
        setSuccess(false); // Reset success state
        setLoading(true); // Set loading state

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const text = formData.get("text") as string;

        if (!text) {
            setError("Please provide a question.");
            setLoading(false);
            return;
        }

        try {
            // Call the askQuestion action with the input and documentId
            const response = await askQuestion({ question: text, documentId });
            console.log(response);
            setSuccess(true); // Set success state
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="dark:bg-gray-900 bg-slate-100 flex flex-col gap-2 p-6 rounded-xl">
        <div className="h-[350px] overflow-y-auto space-y-3">
          <div className="dark:bg-slate-950 rounded p-3">
            AI: Ask any question using AI about this document below:
          </div>
          {chats?.map((chat) => (
            <div
              className={cn(
                {
                  "dark:bg-slate-800 bg-slate-200": chat.isHuman,
                  "dark:bg-slate-950 bg-slate-300": !chat.isHuman,
                  "text-right": chat.isHuman,
                },
                "rounded p-4 whitespace-pre-line"
              )}
            >
              {chat.isHuman ? "YOU" : "AI"}: {chat.text}
            </div>
          ))}
        </div>

            <div className="flex gap-2 mt-4">
                <form onSubmit={handleSubmit} className="w-full flex space-x-2">
                    <Input name="text" placeholder="Ask your question..." required />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "SEND"}
                    </Button>
                </form>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Question sent successfully!</p>}
        </div>
    );
}