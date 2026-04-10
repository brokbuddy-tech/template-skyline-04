
'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Bot, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getProperties } from '@/lib/api';
import { resolveImage } from '@/lib/property-media';
import { getSmartPropertyMatches } from '@/lib/search';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { MetaballLoader } from './metaball-loader';
import { ProgressiveImage } from './progressive-image';

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
  const [catalog, setCatalog] = useState<Property[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatPopupRef = useRef<HTMLDivElement>(null);

  async function loadCatalog() {
    if (catalog.length > 0 || isCatalogLoading) return catalog;

    setIsCatalogLoading(true);
    try {
      const response = await getProperties({ limit: 200 });
      setCatalog(response.properties);
      return response.properties;
    } catch (error) {
      console.error('Unable to load chatbot catalog', error);
      return [];
    } finally {
      setIsCatalogLoading(false);
    }
  }

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
    if (!isOpen || catalog.length > 0) return;
    void loadCatalog();
  }, [isOpen, catalog.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatPopupRef.current && !chatPopupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    const query = inputValue.trim();
    if (!query) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: query,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const availableProperties = catalog.length > 0 ? catalog : await loadCatalog();
      const foundProperties = getSmartPropertyMatches(availableProperties, query, 4);

      let botResponseText = `I found ${foundProperties.length} properties that match your request.`;
      if (availableProperties.length === 0) {
        botResponseText = "I'm still syncing live listings right now. Please try again in a moment.";
      } else if (foundProperties.length === 0) {
        botResponseText = "Sorry, I couldn't find a close match. Try adding a location, budget, or whether you want to buy, rent, or explore off-plan homes.";
      } else if (foundProperties.length === 1) {
        botResponseText = `I found 1 property that looks like a strong match for "${query}".`;
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
      <div onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer hidden md:block"
        aria-label="Toggle AI Chat"
      >
        <div className="transform scale-[.819]">
            <MetaballLoader />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatPopupRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-[380px] h-[70vh] md:h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col font-body"
            style={{
              borderColor: '#EAEAEA',
            }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200" style={{ borderColor: '#EAEAEA' }}>
              <h2 className="font-headline text-xl font-semibold text-black">SkyLines AI</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                <X className="h-5 w-5 text-gray-500"/>
              </Button>
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
                {(isLoading || isCatalogLoading) && (
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      e.preventDefault();
                      void handleSendMessage();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-full border-accent focus-visible:ring-accent"
                  disabled={isLoading}
                />
                <Button onClick={() => void handleSendMessage()} disabled={isLoading} className="rounded-full w-10 h-10 p-0">
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
  const image = property.media?.[0] || property.images[0];

  return (
    <div className="w-48 flex-shrink-0">
      <Link href={`/properties/${property.id}`} className="block group">
        <div className="bg-white rounded-lg overflow-hidden">
          {image && (
            <ProgressiveImage
              image={image}
              alt={property.title}
              width={200}
              height={150}
              imageClassName="w-full h-24 object-cover"
            />
          )}
          <div className="p-2">
            <h3 className="font-headline text-sm font-semibold truncate text-black">{property.title}</h3>
            <p className="text-xs text-gray-500 truncate">{property.location}</p>
            <p className="mt-1 text-xs font-medium text-accent">
              {(property.currency || 'AED').toUpperCase()} {property.price.toLocaleString()}
            </p>
            <p className="text-xs text-accent mt-2 group-hover:underline">
              View Details →
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
