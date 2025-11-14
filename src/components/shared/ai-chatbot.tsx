'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { intelligentAIPropertySearch } from '@/ai/flows/intelligent-ai-property-search';
import { properties } from '@/lib/data';
import { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  properties?: Property[];
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          text: 'Hello, what kind of property are you looking for?',
          sender: 'bot',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await intelligentAIPropertySearch({ query: inputValue });
      const foundProperties = properties.filter((p) => result.propertyIds.includes(p.id));

      let botResponseText = `I found ${foundProperties.length} properties that match your request:`;
      if (foundProperties.length === 0) {
        botResponseText = "Sorry, I couldn't find any properties matching your request. Please try again with different criteria.";
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        properties: foundProperties,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I'm sorry, I'm having trouble searching right now. Please try again later.",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-8 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col font-body"
            style={{
              borderColor: '#EAEAEA',
            }}
          >
            <div className="p-4 border-b border-gray-200" style={{ borderColor: '#EAEAEA' }}>
              <h2 className="font-headline text-xl font-semibold text-black">Monks AI</h2>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex items-start gap-3',
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-black">
                        <Bot className="w-5 h-5 text-black" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl p-3 text-sm',
                        message.sender === 'user'
                          ? 'bg-accent text-white rounded-br-none'
                          : 'bg-white text-black border border-black rounded-bl-none'
                      )}
                    >
                      <p>{message.text}</p>
                      {message.properties && message.properties.length > 0 && (
                        <div className="mt-2 -mr-3">
                           <div className="flex overflow-x-auto gap-3 pb-2 pr-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {message.properties.map((prop) => (
                              <PropertyCardInChat key={prop.id} property={prop} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                     {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-black">
                        <User className="w-5 h-5 text-black" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-black">
                        <Bot className="w-5 h-5 text-black" />
                      </div>
                      <div className="max-w-[75%] rounded-2xl p-3 text-sm bg-white text-black border border-black rounded-bl-none">
                         <div className="flex items-center gap-2">
                           <span className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                           <span className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                           <span className="h-2 w-2 bg-accent rounded-full animate-bounce"></span>
                         </div>
                      </div>
                    </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200" style={{ borderColor: '#EAEAEA' }}>
              <div className="flex items-center gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-full border-accent focus-visible:ring-accent"
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading} className="rounded-full w-10 h-10 p-0">
                  <Send className="w-5 h-5"/>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


function PropertyCardInChat({ property }: { property: Property }) {
  const image = PlaceHolderImages.find((img) => img.id === property.images[0]);

  return (
    <div className="w-48 flex-shrink-0">
      <Link href={`/properties/${property.id}`} className="block group">
        <div className="bg-white rounded-lg overflow-hidden">
          {image && (
            <Image
              src={image.imageUrl}
              alt={property.title}
              width={200}
              height={150}
              className="w-full h-24 object-cover"
            />
          )}
          <div className="p-2">
            <h3 className="font-headline text-sm font-semibold truncate text-black">{property.title}</h3>
            <p className="text-xs text-gray-500 truncate">{property.location}</p>
            <p className="text-xs text-accent mt-2 group-hover:underline">
              View Details →
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
