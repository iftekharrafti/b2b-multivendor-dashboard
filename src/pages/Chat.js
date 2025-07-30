"use client"

import { useState, useEffect } from "react"
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react"

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState("")
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // Mock chat data
    const mockChats = [
      {
        id: 1,
        name: "ABC Construction Co.",
        lastMessage: "Thank you for the quote. When can you deliver?",
        timestamp: "2024-01-20T15:30:00Z",
        unread: 2,
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
      },
      {
        id: 2,
        name: "XYZ Manufacturing",
        lastMessage: "We need to discuss the bulk pricing.",
        timestamp: "2024-01-20T14:15:00Z",
        unread: 0,
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
      },
      {
        id: 3,
        name: "BuildRight Inc.",
        lastMessage: "Order has been received. Processing now.",
        timestamp: "2024-01-20T10:45:00Z",
        unread: 1,
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
      },
    ]

    setChats(mockChats)
    setSelectedChat(mockChats[0])
  }, [])

  useEffect(() => {
    if (selectedChat) {
      // Mock messages for selected chat
      const mockMessages = [
        {
          id: 1,
          senderId: selectedChat.id,
          senderName: selectedChat.name,
          content: "Hi, I'm interested in your industrial steel pipes.",
          timestamp: "2024-01-20T14:00:00Z",
          isOwn: false,
        },
        {
          id: 2,
          senderId: "me",
          senderName: "You",
          content: "Hello! Thank you for your interest. What quantity are you looking for?",
          timestamp: "2024-01-20T14:05:00Z",
          isOwn: true,
        },
        {
          id: 3,
          senderId: selectedChat.id,
          senderName: selectedChat.name,
          content: "We need about 500 units for our construction project.",
          timestamp: "2024-01-20T14:10:00Z",
          isOwn: false,
        },
        {
          id: 4,
          senderId: "me",
          senderName: "You",
          content: "Perfect! For 500 units, I can offer you a bulk discount. Let me prepare a quote for you.",
          timestamp: "2024-01-20T14:15:00Z",
          isOwn: true,
        },
        {
          id: 5,
          senderId: selectedChat.id,
          senderName: selectedChat.name,
          content: "Thank you for the quote. When can you deliver?",
          timestamp: "2024-01-20T15:30:00Z",
          isOwn: false,
        },
      ]
      setMessages(mockMessages)
    }
  }, [selectedChat])

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: messages.length + 1,
        senderId: "me",
        senderName: "You",
        content: message,
        timestamp: new Date().toISOString(),
        isOwn: true,
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="flex h-full">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Chat List Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat?.id === chat.id ? "bg-blue-50 border-blue-200" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.avatar || "/placeholder.svg"}
                      alt={chat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                      <p className="text-xs text-gray-500">{formatTime(chat.timestamp)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedChat.avatar || "/placeholder.svg"}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">{selectedChat.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={!message.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
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
    </div>
  )
}

export default Chat
