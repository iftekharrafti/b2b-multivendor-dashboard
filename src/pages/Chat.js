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
      console.log("response", response);
      setVendors(response.data || [])
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
      console.log("chatsData", chatsData);
      setChats(chatsData)
      if (chatsData.length > 0 && !selectedChat) {
        handleSelectChat(chatsData[0])
      }
    } catch (err) {
      console.error("Error fetching chats:", err)
      setError("Failed to load chats. Please try again later.")
    }
  }

  // ---- Select chat
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat)
    try {
      const response = await chatAPI.getMessages(chat.id, { page: 1, limit: 20 })
      setMessages(response.data.messages || [])
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError("Failed to load messages. Please try again later.")
    }
  }

  // ---- Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || isSending) return
    const messageContent = message.trim()
    setMessage("")
    setIsSending(true)

    try {
      const newMessage = {
        id: Date.now(),
        chatId: selectedChat.id,
        senderId: user.id,
        content: messageContent,
        createdAt: new Date().toISOString(),
        isOwn: true,
      }

      // optimistic update
      setMessages((prev) => [...prev, newMessage])
      await chatAPI.sendMessage(selectedChat.id, { message: messageContent })
      await fetchChats()
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
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
    messages.forEach((m) => {
      const date = formatMessageDate(m.createdAt)
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(m)
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
              {chats.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No chats yet.</div>
              ) : (
                chats.map((chat) => {
                  const other = chat.participants?.find((p) => p.id !== user.id)
                  const lastMessage = chat.Messages?.[0]
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleSelectChat(chat)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedChat?.id === chat.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {other?.firstName?.charAt(0) || "V"}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">
                              {other?.companyName ||
                                `${other?.firstName || ""} ${other?.lastName || ""}`.trim() ||
                                "Vendor"}
                            </h3>
                            {chat.lastMessageAt && (
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDistanceToNow(new Date(chat.lastMessageAt))} ago
                              </span>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                              {lastMessage.senderId === user.id ? "You: " : ""}
                              {lastMessage.message}
                            </p>
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
                      {selectedChat.participantNames?.[0]?.charAt(0) || "V"}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">
                        {selectedChat.participantNames?.join(", ") || "Chat"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedChat.lastMessageAt
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
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                      <div className="text-center text-xs text-gray-500 my-2">{date}</div>
                      {msgs.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex mb-2 ${
                            msg.senderId === user.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`px-3 py-2 rounded-lg max-w-xs ${
                              msg.senderId === user.id
                                ? "bg-blue-500 text-white"
                                : "bg-white border"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <span className="text-[10px] text-gray-400 block text-right">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
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
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
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
