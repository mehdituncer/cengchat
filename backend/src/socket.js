// ...existing code...

const userSocketMap = new Map(); // Kullanıcı-socket eşleştirmelerini tut

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    // Kullanıcı bağlandığında
    socket.on("setup", (userId) => {
      // Kullanıcının tüm eski soketlerini sakla
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId).add(socket.id);
      
      // Online kullanıcıları yayınla
      const onlineUsers = Array.from(userSocketMap.keys());
      io.emit("getOnlineUsers", onlineUsers);
    });

    // Kullanıcı ayrıldığında
    socket.on("disconnect", () => {
      // Kullanıcıyı bul ve socketi sil
      for (const [userId, sockets] of userSocketMap.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSocketMap.delete(userId);
            // Kullanıcı tamamen çıktığında bildir
            io.emit("userOffline", userId);
          }
        }
      }
      // Online kullanıcıları güncelle
      const onlineUsers = Array.from(userSocketMap.keys());
      io.emit("getOnlineUsers", onlineUsers);
    });
    
    // Online kullanıcıları istendiğinde gönder
    socket.on("getOnlineUsers", () => {
      const onlineUsers = Array.from(userSocketMap.keys());
      socket.emit("getOnlineUsers", onlineUsers);
    });
  });
};
