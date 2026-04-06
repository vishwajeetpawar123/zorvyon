import { useState, useEffect, useRef } from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useUIStore } from '../../store/useUIStore';
import { getAiInsights, getTopCategories } from '../../utils/insightEngine';
import { getLisaResponse, ChatMessage } from './api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export function LisaAIPage() {
  const { transactions } = useTransactionStore();
  const { profileName, currency } = useUIStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stats = getTopCategories(transactions);
  const insights = getAiInsights(transactions, currency);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial analysis on mount
  useEffect(() => {
    const triggerInitialAnalysis = async () => {
      // Don't re-trigger if we already have messages
      if (messages.length > 0) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const responseText = await getLisaResponse([], {
          transactions,
          stats,
          insights,
          profileName,
          currency
        });
        
        setMessages([
          { role: 'model', parts: [{ text: responseText }] }
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize LISA AI');
      } finally {
        setIsLoading(false);
      }
    };

    triggerInitialAnalysis();
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await getLisaResponse(newMessages, {
        transactions,
        stats,
        insights,
        profileName,
        currency
      });
      
      setMessages([...newMessages, { role: 'model', parts: [{ text: responseText }] }]);
    } catch (err: any) {
      setError(err.message || 'Failed to get a response from LISA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 max-w-4xl mx-auto pb-4">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent-primary" /> LISA AI
          </h1>
          <p className="text-text-secondary mt-1">Your Lead Intelligent Savings Assistant</p>
        </div>
      </header>

      <Card glass className="flex-1 flex flex-col overflow-hidden border-border-default shadow-2xl relative">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 premium-scrollbar">
          {messages.length === 0 && !isLoading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <Bot className="h-12 w-12 text-accent-primary animate-pulse" />
              <p className="text-text-secondary font-medium">Initializing analysis...</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-bg-elevated border border-border-default text-text-primary' 
                  : 'bg-accent-primary text-white'
              }`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-accent-glow text-text-primary rounded-tr-none border border-accent-primary/20' 
                  : 'bg-bg-elevated text-text-primary rounded-tl-none border border-border-default shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap prose prose-invert max-w-none">
                  {msg.parts[0].text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 sm:gap-4 animate-in fade-in duration-300">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-accent-primary text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-bg-elevated border border-border-default px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-accent-primary" />
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest italic">LISA is thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium flex items-center gap-3 animate-in shake duration-300">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold">LISA Encountered a Problem</p>
                <p className="opacity-80">{error}</p>
                {error.includes('API key') && (
                  <p className="mt-2 text-xs bg-error/20 p-2 rounded border border-error/30 font-mono">
                    Add VITE_AI_API_KEY="..." to .env.local
                  </p>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-bg-elevated/50 border-t border-border-default backdrop-blur-md">
          <form onSubmit={handleSend} className="flex gap-2 max-w-3xl mx-auto items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your spending..."
                className="w-full bg-bg-surface text-text-primary border-border-default hover:border-border-active focus:border-accent-primary focus:ring-1 focus:ring-accent-primary rounded-2xl px-4 py-3 pr-12 text-sm transition-all resize-none max-h-32 min-h-[48px] premium-scrollbar outline-none shadow-inner"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="absolute right-3 bottom-3 flex items-center">
                {input.length > 0 && (
                  <span className="text-[10px] text-text-muted mr-2 font-mono">Shift+Enter for newline</span>
                )}
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className={`h-12 w-12 rounded-2xl p-0 flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 ${isLoading ? 'opacity-50' : ''}`}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
