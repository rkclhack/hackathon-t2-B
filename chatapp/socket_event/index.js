export default async (io, socket, db) => {
  // 入室メッセージをクライアントに送信する
  socket.on("loginEvent", async (data) => {
    // 過去のメッセージを入室したクライアントにのみ送信
    const { employeeNumber, password } = data
    try {
      const messages = await db.all("SELECT * FROM messages ORDER BY date ASC")
      const user = await db.get(
      "SELECT * FROM users WHERE employee_number = ? AND password = ?",
      [employeeNumber, password]
    )

    if (!user) {
      socket.emit("loginFailed", "社員番号またはパスワードが違います")
      return
    }

      socket.emit("loginSuccess", { userName: user.display_name })
      socket.emit("loadMessages", messages)
    } catch (e) {
      console.error("データベースからロードできませんでした", e)
      socket.emit("loginFailed", "ログインできませんでした")
    }
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