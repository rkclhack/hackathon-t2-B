import { Server } from "socket.io"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

// データベースの初期化
const initDatabase = async () => {
  const db = await open({
    filename: "./chatapp.db",
    driver: sqlite3.Database,
  })
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT NOT NULL,
      sender TEXT NOT NULL,
      date DATETIME NOT NULL,
      message TEXT NOT NULL,
      genre INTEGER NOT NULL,
      importance INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTO INCREMENT,
      employee_id TEXT NOT NULL,
      password TEXT NOT NULL,
      display_name TEXT NOT NULL,
    )
  `)
  return db
}

const connectionEvents = (io, socketEvents, db) => {
  io.on("connection", socket => socketEvents(io, socket, db))
}

const socketEvents = (io, socket) => {
  console.log("socket.io - connection")
  socket.on("disconnect", () => {
    console.log(`socket.io - socket.id \`${socket.id}\` disconnected`)
  })
}

export default (options = {}) => ({
  name: "socket.io",
  async configureServer(server) {
    const db = await initDatabase()
    const defaults = { connectionEvents, socketEvents }
    options = Object.assign(defaults, options)
    const io = new Server(server.httpServer)
    options.connectionEvents(io, options.socketEvents, db)
  }
})
