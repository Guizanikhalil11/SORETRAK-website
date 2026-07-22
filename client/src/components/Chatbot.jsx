import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import axios from 'axios'

export default function Chatbot() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const sessionIdRef = useRef('session_' + Date.now())

  const getWelcome = useCallback(() => {
    return i18n.language === 'ar'
      ? 'مرحباً بكم! أنا مساعد SORETRAK الافتراضي. يمكنني مساعدتكم في:\n\n- مواعيد الحافلات\n- الأسعار والمسارات\n- حجز التذاكر\n- الاشتراكات\n\nكيف يمكنني مساعدتكم؟'
      : 'Bienvenue ! Je suis l\'assistant virtuel de SORETRAK. Je peux vous aider avec :\n\n- Horaires des bus\n- Prix et itinéraires\n- Réservation de billets\n- Abonnements\n\nComment puis-je vous aider ?'
  }, [i18n.language])

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: 1, text: getWelcome(), sender: 'bot' }])
    }
  }, [i18n.language, getWelcome])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = { id: Date.now(), text: input.trim(), sender: 'user' }
    const userInput = input.trim()
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await axios.post('/api/chatbot', {
        message: userInput,
        language: i18n.language,
        sessionId: sessionIdRef.current
      })
      const reply = response.data.response || response.data.reply || response.data.message
      if (reply) {
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }])
      }
    } catch (err) {
      const errorMsg = i18n.language === 'ar'
        ? 'عذراً، حدث خطأ تقني. يرجى المحاولة مرة أخرى أو التواصل معنا على +216 77 300 011'
        : 'Désolé, une erreur technique. Réessayez ou contactez-nous au +216 77 300 011'
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: errorMsg, sender: 'bot' }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickReplies = i18n.language === 'ar'
    ? ['مواعيد', 'أسعار', 'الخطوط', 'الاتصال']
    : ['Horaires', 'Prix', 'Lignes', 'Contact']

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 bg-gradient-to-br from-secondary to-secondary-dark hover:from-secondary-dark hover:to-secondary"
        aria-label="Chat"
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {isOpen && (
        <div className="fixed z-50 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fadeInUp
          bottom-16 right-2 w-[calc(100vw-16px)] h-[70vh] max-h-[520px]
          sm:bottom-24 sm:right-6 sm:w-[370px] sm:h-[520px]">
          <div className="bg-gradient-to-r from-secondary to-secondary-dark text-white p-3 sm:p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">SORETRAK Assistant</div>
                  <div className="text-[10px] sm:text-xs text-white/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-300 rounded-full animate-pulse flex-shrink-0" />
                    {i18n.language === 'ar' ? 'متصل الآن' : 'En ligne'}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-lg p-1.5 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 sm:space-y-3 bg-gray-50/50 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0 shadow-sm">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl rounded-br-md shadow-md'
                      : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary/10 rounded-lg flex items-center justify-center ml-1.5 sm:ml-2 mt-0.5 flex-shrink-0">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0 shadow-sm">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="bg-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(reply); setTimeout(handleSend, 100) }}
                  className="text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 bg-secondary/10 text-secondary rounded-full hover:bg-secondary/20 transition-colors border border-secondary/20"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="p-2.5 sm:p-3 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-gray-50 min-w-0"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-secondary to-secondary-dark rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:shadow-secondary/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
