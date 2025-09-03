"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, Loader2 } from "lucide-react"
// import { vendorsAPI, chatAPI } from "@/services/api"
import { formatDistanceToNow, format } from "date-fns"
import { vendorsAPI, chatAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

const Chat = () => {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState("")
  const [chats, setChats] = useState([])
  const [vendors, setVendors] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // ---- Fetch vendors
  const fetchVendors = async () => {
    try {
      const response = await vendorsAPI.getAll()
      console.log("response,,", response);
      setVendors(response.data.vendors || [])
    } catch (err) {
      console.error("Error fetching vendors:", err)
      setError("Failed to load vendors. Please try again later.")
    }
  }

  // ---- Fetch chats
  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChats()
      const chatsData = response.data || []
      console.log("chatsData",chatsData);
      setChats(chatsData)
      
      // If there's a selected chat, update its data
      if (selectedChat) {
        const updatedChat = chatsData.find(c => c.id === selectedChat.id)
        if (updatedChat) setSelectedChat(updatedChat)
      }
    } catch (err) {
      console.error("Error fetching chats:", err)
      setError("Failed to load chats. Please try again later.")
    }
  }

  // ---- Start or select chat with vendor
  const handleSelectVendor = async (vendor) => {
    try {
      setIsLoading(true)
      
      // Check if chat already exists with this vendor
      const existingChat = chats.find(chat => 
        chat.participants.some(p => p.id === vendor.id)
      )
      
      if (existingChat) {
        // If chat exists, select it
        setSelectedChat(existingChat)
        const response = await chatAPI.getMessages(existingChat.id, { page: 1, limit: 20 })
        setMessages(response.data.messages || [])
      } else {
        // Create new chat if it doesn't exist
        const response = await chatAPI.createChat({
          participantId: vendor.id,
          type: 'direct'
        })
        
        const newChat = response.data
        setSelectedChat(newChat)
        setChats(prev => [newChat, ...prev])
        setMessages([])
      }
    } catch (err) {
      console.error("Error starting chat:", err)
      setError("Failed to start chat. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ---- Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || isSending) return
    const messageContent = message.trim()
    setMessage("")
    setIsSending(true)

    console.log("messageContent", messageContent);

    // Create optimistic message
    const tempMessageId = `temp-${Date.now()}`
    const optimisticMessage = {
      id: tempMessageId,
      chatId: selectedChat.id,
      senderId: user.id,
      content: messageContent,
      createdAt: new Date().toISOString(),
      User: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
    }

    // Optimistic update
    setMessages(prev => [...prev, optimisticMessage])
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    console.log("messages", messages);
    console.log("selectedChat", selectedChat);

    try {
      // Prepare message data
      const messageData = {
        message: messageContent, // This is the actual message text
        messageType: 'text',
        // Add any other required fields here
      }
      
      // Send to server
      const response = await chatAPI.sendMessage(selectedChat.id, messageData)
      
      // If the message was successfully sent, refresh the messages
      if (response.data) {
        const messagesResponse = await chatAPI.getMessages(selectedChat.id)
        setMessages(messagesResponse.data.messages || [])
      }
      
      // Update chat list to show latest message
      await fetchChats()
      
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
      // Revert optimistic update on error
      setMessages(prev => prev.filter(m => m.id !== tempMessageId))
    } finally {
      setIsSending(false)
    }
  }

  // ---- Formatters
  const formatTime = (timestamp) => format(new Date(timestamp), "h:mm a")
  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return format(date, "MMMM d, yyyy")
  }

  // ---- Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = {}
    messages?.forEach((m) => {
      const date = formatMessageDate(m.createdAt)
      if (!grouped[date]) grouped[date] = []
      grouped[date].push({
        ...m,
        isOwn: m.senderId === user.id
      })
    })
    return grouped
  }
  const groupedMessages = groupMessagesByDate(messages)

  // ---- Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await Promise.all([fetchVendors(), fetchChats()])
      setIsLoading(false)
    }
    init()
  }, [])

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border overflow-hidden">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center p-4 max-w-md">
            <div className="text-red-500 mb-2">Error loading chat</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {vendors.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No vendors available</div>
              ) : (
                vendors?.map((vendor) => {
                  // Check if there's an existing chat with this vendor
                  const existingChat = chats.find(chat => 
                    chat.participants?.some(p => p.id === vendor.id)
                  )
                  const lastMessage = existingChat?.Messages?.[0]
                  
                  return (
                    <div
                      key={vendor.id}
                      onClick={() => handleSelectVendor(vendor)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedChat?.participants?.some(p => p.id === vendor.id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {vendor?.firstName?.charAt(0) || "V"}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">
                              {vendor.companyName ||
                                `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() ||
                                "Vendor"}
                            </h3>
                            {lastMessage?.createdAt && (
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDistanceToNow(new Date(lastMessage.createdAt))} ago
                              </span>
                            )}
                          </div>
                          {lastMessage ? (
                            <p className="text-sm text-gray-500 truncate">
                              {lastMessage.senderId === user.id ? "You: " : ""}
                              {lastMessage.message}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No messages yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {selectedChat?.participants?.find(p => p.id !== user.id)?.firstName?.charAt(0) || "V"}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">
                        {(() => {
                          const otherParticipant = selectedChat?.participants?.find(p => p.id !== user.id);
                          return otherParticipant?.companyName || 
                                 `${otherParticipant?.firstName || ''} ${otherParticipant?.lastName || ''}`.trim() || 
                                 'Vendor';
                        })()}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedChat?.lastMessageAt
                          ? `Last active ${formatDistanceToNow(new Date(selectedChat.lastMessageAt))} ago`
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Video className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-4 bg-gray-50">
                  {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-4">
                  <div className="text-center mb-4 text-sm text-gray-500 font-medium">
                    {date}
                  </div>
                  asdf
                  {dateMessages.map((msg, index, arr) => {
                    const isOwn = msg.senderId === user.id
                    const showAvatar = !isOwn && (
                      index === 0 || 
                      arr[index - 1].senderId !== msg.senderId
                    )
                    const showName = !isOwn && showAvatar
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1 px-2`}
                      >
                        {showAvatar && (
                          <div className="flex-shrink-0 mr-2 self-end mb-1">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                              {msg.User?.firstName?.[0] || 'U'}
                            </div>
                          </div>
                        )}
                        
                        <div className={`max-w-xs lg:max-w-md ${!showAvatar && !isOwn ? 'ml-10' : ''}`}>
                          {showName && (
                            <div className="text-xs text-gray-600 font-medium mb-1 ml-2">
                              {msg.User?.firstName} {msg.User?.lastName}
                            </div>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwn 
                                ? 'bg-blue-500 text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <div className="whitespace-pre-wrap break-words">
                              {msg.content}
                            </div>
                            <div 
                              className={`text-xs mt-1 text-right ${
                                isOwn ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
                  <div ref={messagesEndRef} />
                </div>
                {
                  console.log("selectedChat", selectedChat)
                }

                  <div className="p-4 border-t bg-white flex items-center space-x-2">
                    
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <Smile className="h-5 w-5 text-gray-500" />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isSending}
                      className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>

              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
                  <p className="text-gray-500">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
