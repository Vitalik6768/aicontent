'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from "ai/react"
import { useRef, useEffect } from 'react'
import { Send, User, Bot } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatUi() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/vector1/',
    onError: (e) => {
      console.error(e)
    }
  })
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight)
    }
  }, [messages])

  return (
    <main className="flex flex-col w-full h-screen max-h-dvh">
      <header className="p-4 border-b w-full">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">LangChain Chat</h1>
          <span className="text-sm text-muted-foreground">Powered by AI</span>
        </div>
      </header>

      <ScrollArea ref={scrollAreaRef} className="flex-grow p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-2.5 ${
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-[#a09a9a]'
                }`}>
                  {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`max-w-[75%] rounded-lg p-3 ${
                  m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-[#a09a9a]'
                }`}>
                  <p className="text-sm">{m.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <footer className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
          <Input
            className="flex-grow"
            placeholder="Type your message here..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send size={18} />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </footer>
    </main>
  )
}