export default async (io, socket, db) => {
  //初回登録用の通信を行う
  socket.on("registerEvent", async (data) => {
  const { userName, employeeNumber, password } = data
    console.log(data)
  try {
    // すでに同じ社員番号が存在するか確認
    const existingUser = await db.get(
      "SELECT * FROM users WHERE employee_id = ?",
      [employeeNumber]
    )

    if (existingUser) {
      socket.emit("registerFailed", "この社員番号はすでに登録されています")
      return
    }

    // ユーザーを登録
    await db.run(
      "INSERT INTO users (display_name, employee_id, password) VALUES (?, ?, ?)",
      [userName, employeeNumber, password]
    )

    // 登録成功メッセージを返す
    socket.emit("registerSuccess", "登録が完了しました。ログインしてください")

  } catch (e) {
    console.error("ユーザー登録に失敗しました", e)
    socket.emit("registerFailed", "登録処理中にエラーが発生しました")
  }
})

  // 入室メッセージをクライアントに送信する
  socket.on("loginEvent", async (data) => {
    // 過去のメッセージを入室したクライアントにのみ送信
    const { employeeNumber, password } = data
    try {
      const messages = await db.all("SELECT * FROM messages ORDER BY date ASC")
      const user = await db.get(
      "SELECT * FROM users WHERE employee_id = ? AND password = ?",
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