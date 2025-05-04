
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from '@/components/ChatMessage';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Vérifier si la clé API est configurée
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          assistantId: "asst_o79VX4MRoFBuTGEYpZSsLgmh"
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Une erreur est survenue lors de la communication avec l'API.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur de chat:", error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur. Vérifiez que la clé API est configurée.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Chatbot Assistant</h1>
      </div>

      <div className="mt-6">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Discussion avec l'assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 h-[60vh] overflow-y-auto rounded-md border p-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Commencez une conversation avec l'assistant...
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg, index) => (
                    <ChatMessage key={index} role={msg.role} content={msg.content} />
                  ))}
                  {loading && <ChatMessage role="assistant" loading={true} />}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                <Send className="h-4 w-4" />
                <span className="ml-2">Envoyer</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
