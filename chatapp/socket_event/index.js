export default async (io, socket, db) => {
  // 入室メッセージをクライアントに送信する
  socket.on("loginEvent", async (data) => {
    // 他のクライアントに入室を通知
    socket.broadcast.emit("loginEvent", data)

    // 過去のメッセージを入室したクライアントにのみ送信
    try {
      const messages = await db.all("SELECT * FROM messages ORDER BY date ASC")
      socket.emit("loadMessages", messages)
    } catch (e) {
      console.error("データベースからロードできませんでした", e)
    }
  })

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    socket.broadcast.emit("exitEvent", data)
  })

  // 投稿メッセージをDBに保存し、全クライアントに送信する
  socket.on("publishEvent", async (data) => {
    try {
      await db.run(
        `INSERT INTO messages (id, sender, date, message, genre, importance)
         VALUES (?, ?, ?, ?, ?, ?)`,
        data.id,
        data.sender,
        data.date,
        data.message,
        data.genre,
        data.importance
      )
      io.sockets.emit("publishEvent", data)
    } catch (e) {
      console.error("データベースに保存できませんでした", e)
    }
  })
}