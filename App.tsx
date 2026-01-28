import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import SettingsModal from './components/SettingsModal';
import WelcomeModal from './components/WelcomeModal';
import ClickEffects from './components/ClickEffects';
import { AppMode, ChatSession, Message } from './types';

const DEFAULT_INSTRUCTION = "You are Glucasia, a helpful, reasoning AI assistant created by Glucasia and 206. Be concise, accurate, and helpful.";

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState<string>(DEFAULT_INSTRUCTION);

  // Load sessions from local storage on mount
  useEffect(() => {
    // Check if first visit
    const hasVisited = localStorage.getItem('glucasia_visited');
    if (!hasVisited) {
      setWelcomeOpen(true);
    }

    const saved = localStorage.getItem('glucasia_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
          setMessages(parsed[0].messages);
          setCurrentInstruction(parsed[0].systemInstruction || DEFAULT_INSTRUCTION);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    } else {
       createNewSession();
    }
  }, []);

  const handleCloseWelcome = () => {
    setWelcomeOpen(false);
    localStorage.setItem('glucasia_visited', 'true');
  };

  // Save sessions when updated
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('glucasia_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Update current session when messages or instructions change
  useEffect(() => {
    if (!currentSessionId) return;

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        // Generate title from first message if "New Chat"
        let title = s.title;
        if (title === "New Chat" && messages.length > 0 && messages[0].role === 'user') {
           title = messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : '');
        }
        return { 
          ...s, 
          messages, 
          title, 
          systemInstruction: currentInstruction,
          updatedAt: Date.now() 
        };
      }
      return s;
    }));
  }, [messages, currentInstruction, currentSessionId]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      systemInstruction: DEFAULT_INSTRUCTION,
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setCurrentInstruction(DEFAULT_INSTRUCTION);
    setMode(AppMode.CHAT);
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
      setCurrentInstruction(session.systemInstruction || DEFAULT_INSTRUCTION);
      setSidebarOpen(false); // Close sidebar on mobile on selection
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
       if (newSessions.length > 0) {
         setCurrentSessionId(newSessions[0].id);
         setMessages(newSessions[0].messages);
         setCurrentInstruction(newSessions[0].systemInstruction || DEFAULT_INSTRUCTION);
       } else {
         createNewSession();
       }
    }
  };

  const handleSaveInstruction = (instruction: string) => {
     setCurrentInstruction(instruction);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.CHAT:
        return (
          <ChatInterface 
            messages={messages} 
            setMessages={setMessages}
            sessionId={currentSessionId || 'temp'}
            systemInstruction={currentInstruction}
          />
        );
      case AppMode.IMAGE_GEN:
        return <ImageGenerator />;
      case AppMode.IMAGE_EDIT:
        return <ImageEditor />;
      default:
        return <ChatInterface messages={messages} setMessages={setMessages} sessionId={currentSessionId || 'temp'} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0f1115] overflow-hidden text-gray-100 font-sans">
      <ClickEffects />
      
      <Sidebar 
        currentMode={mode}
        setMode={setMode}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={createNewSession}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setSettingsOpen(true)}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#17191f] border-b border-gray-800 z-10">
           <button onClick={() => setSidebarOpen(true)} className="text-gray-300 p-1 hover:text-white transition-colors">
             <Menu />
           </button>
           <span className="font-semibold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Glucasia</span>
           <div className="w-8"></div> {/* Spacer for center alignment */}
        </div>

        {/* Animated Content Wrapper */}
        <div key={mode} className="flex-1 flex flex-col h-full overflow-hidden animate-slide-up-fade">
           {renderContent()}
        </div>
        
        <SettingsModal 
          isOpen={settingsOpen} 
          onClose={() => setSettingsOpen(false)}
          currentInstruction={currentInstruction}
          onSave={handleSaveInstruction}
        />

        <WelcomeModal 
          isOpen={welcomeOpen}
          onClose={handleCloseWelcome}
        />
      </div>
    </div>
  );
}

export default App;