import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import MessageInput from "./MessageInput";
import avatar from "../assets/avatar.png";

export default function MultipleChat() {
  const [userIds, setUserIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { sendMessageToMultiple, users } = useChatStore();
  const { socket, onlineUsers } = useAuthStore(); // onlineUsers'ı direkt store'dan al

  useEffect(() => {
    const ids = searchParams.get("userIds")?.split(",") || [];
    setUserIds(ids);
    
    // Online durumlarını direkt store'dan gelen onlineUsers ile kontrol et
    const filteredUsers = users
      .filter(user => ids.includes(user._id))
      .map(user => ({
        ...user,
        online: onlineUsers.includes(user._id)
      }));
    
    setSelectedUsers(filteredUsers);
    setLoading(false);
  }, [searchParams, users, onlineUsers]); // onlineUsers'ı dependency olarak ekle

  // Socket event listener'ları ekle
  useEffect(() => {
    if (!socket) return;

    // Socket bağlantısında online kullanıcıları güncelle
    socket.emit("getOnlineUsers");

    // Kullanıcı online olduğunda
    socket.on("userOnline", (userId) => {
      setSelectedUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, online: true } : user
        )
      );
    });

    // Kullanıcı offline olduğunda
    socket.on("userOffline", (userId) => {
      setSelectedUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, online: false } : user
        )
      );
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [socket]);

  const handleSend = async ({ text, image }) => {
    if (!userIds.length) return;
    await sendMessageToMultiple({ userIds, text, image });
  };

  if (loading) return <div>Loading multiple chat...</div>;

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex flex-col h-full rounded-lg overflow-hidden ">
            <div className="flex items-center p-4 gap-4 border-b border-base-300">
              {selectedUsers.map(user => (
                <div key={user._id} className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={user.profilePic || avatar}
                      alt={user.fullName}
                      className="h-10 w-10 border object-cover rounded-full"
                    />
                    {/* Online durumu için gösterge */}
                    <span 
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white
                        ${user.online ? 'bg-green-500' : 'bg-gray-400'}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.fullName}</h3>
                    <p className="text-sm text-base-content/70">
                      {user.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Show a message indicating that messages will be sent individually */}
              <div className="text-center text-zinc-500 py-4">
                Messages will be sent individually to each selected user.
              </div>
            </div>
            <MessageInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}