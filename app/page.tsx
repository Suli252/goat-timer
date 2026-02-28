"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState("theme1")
  const [showThemes, setShowThemes] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (running) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10)
      }, 10)
    }

    return () => clearInterval(interval)
  }, [running])

  function toggleTimer() {
    setRunning((prev) => !prev)
  }

  function resetTimer() {
    setTime(0)
    setRunning(false)
  }

  function formatTime(ms: number) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`
  }

  async function handleLogin() {
    const email = prompt("Email:")
    const password = prompt("Senha:")
    if (!email || !password) return

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) alert(error.message)
    else setUser(data.user)
  }

  async function handleSignUp() {
    const email = prompt("Email:")
    const password = prompt("Senha:")
    if (!email || !password) return

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) alert(error.message)
    else alert("Usuário criado!")
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  const themes: any = {
    theme1: {
      pageBg: "#ffffff",
      timerBg: "#ffffff",
      border: "#93c5fd",
      text: "#2563eb",
      menuText: "#000000",
    },
    theme2: {
      pageBg: "#000000",
      timerBg: "#111111",
      border: "#6b7280",
      text: "#ef4444",
      menuText: "#ffffff",
    },
    theme3: {
      pageBg: "linear-gradient(135deg, #7c3aed, #06b6d4)",
      timerBg: "rgba(0,0,0,0.25)",
      border: "#fef9c3",
      text: "#facc15",
      menuText: "#facc15",
    },
  }

  return (
    <div
      onClick={toggleTimer}
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: themes[theme].pageBg,
        transition: "0.4s",
        cursor: "pointer",
      }}
    >
      {/* AUTH */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: 10,
          color: themes[theme].menuText,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!user ? (
          <>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignUp}>Sign Up</button>
          </>
        ) : (
          <button onClick={handleLogout}>Quit</button>
        )}
      </div>

      {/* RELÓGIO */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          gap: 15,
          fontSize: "28px",
          color: themes[theme].menuText,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Abrir cores */}
        <span
          style={{ cursor: "pointer" }}
          onClick={() => setShowThemes(!showThemes)}
        >
          ⏰
        </span>

        {/* Reset */}
        <span
          style={{ cursor: "pointer" }}
          onClick={resetTimer}
        >
          🫷⏰
        </span>
      </div>

      {/* MENU CORES */}
      {showThemes && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            color: themes[theme].menuText,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setTheme("theme1")}>
            White + Blue
          </button>

          <button onClick={() => setTheme("theme2")}>
            Black + Red
          </button>

          <button onClick={() => setTheme("theme3")}>
            Colorful + Yellow
          </button>
        </div>
      )}

      {/* CRONÔMETRO */}
      <div
        style={{
          fontSize: "100px",
          fontWeight: "bold",
          padding: "50px 100px",
          borderRadius: "30px",
          background: themes[theme].timerBg,
          border: `5px solid ${themes[theme].border}`,
          color: themes[theme].text,
          transition: "0.3s",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}
      >
        {formatTime(time)}
      </div>
    </div>
  )
}
