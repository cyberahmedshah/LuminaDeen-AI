[1mdiff --git a/templates/index.html b/templates/index.html[m
[1mindex 41f2b26..6edd3f2 100644[m
[1m--- a/templates/index.html[m
[1m+++ b/templates/index.html[m
[36m@@ -1,902 +1,457 @@[m
[31m-<!DOCTYPE html>[m
[32m+[m[32m<!doctype html>[m
 <html lang="en">[m
[31m-<head>[m
[31m-<meta charset="UTF-8">[m
[31m-<meta name="viewport" content="width=device-width, initial-scale=1.0">[m
[31m-<title>LuminaDeen AI — Islamic Knowledge Assistant</title>[m
[31m-<link rel="preconnect" href="https://fonts.googleapis.com">[m
[31m-<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>[m
[31m-<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">[m
[31m-[m
[31m-<style>[m
[31m-  :root {[m
[31m-    --bg-primary: #0A1929;[m
[31m-    --bg-secondary: #10243D;[m
[31m-    --bg-tertiary: #0D1F35;[m
[31m-    --accent: #16A34A;[m
[31m-    --accent-light: #22C55E;[m
[31m-    --accent-glow: rgba(22, 163, 74, 0.15);[m
[31m-    --text-primary: #F8FAFC;[m
[31m-    --text-muted: #94A3B8;[m
[31m-    --text-dim: #64748B;[m
[31m-    --border: rgba(255,255,255,0.08);[m
[31m-    --border-accent: rgba(22, 163, 74, 0.3);[m
[31m-    --glass-bg: rgba(16, 36, 61, 0.75);[m
[31m-    --glass-border: rgba(255,255,255,0.10);[m
[31m-    --user-bubble: rgba(22, 163, 74, 0.15);[m
[31m-    --ai-bubble: rgba(16, 36, 61, 0.9);[m
[31m-    --radius-sm: 8px;[m
[31m-    --radius-md: 14px;[m
[31m-    --radius-lg: 20px;[m
[31m-    --radius-xl: 28px;[m
[31m-    --font-display: 'Cormorant Garamond', Georgia, serif;[m
[31m-    --font-body: 'DM Sans', system-ui, sans-serif;[m
[31m-    --shadow-glow: 0 0 40px rgba(22, 163, 74, 0.08);[m
[31m-    --shadow-card: 0 4px 24px rgba(0,0,0,0.3);[m
[31m-  }[m
[31m-[m
[31m-  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }[m
[31m-[m
[31m-  html, body {[m
[31m-    height: 100%;[m
[31m-    overflow: hidden;[m
[31m-    font-family: var(--font-body);[m
[31m-    background: var(--bg-primary);[m
[31m-    color: var(--text-primary);[m
[31m-    -webkit-font-smoothing: antialiased;[m
[31m-  }[m
[31m-[m
[31m-  .geo-pattern {[m
[31m-    position: fixed;[m
[31m-    inset: 0;[m
[31m-    pointer-events: none;[m
[31m-    z-index: 0;[m
[31m-    opacity: 0.035;[m
[31m-    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.8'%3E%3Cpolygon points='60,10 110,35 110,85 60,110 10,85 10,35'/%3E%3Cpolygon points='60,25 95,42.5 95,77.5 60,95 25,77.5 25,42.5'/%3E%3Cpolygon points='60,40 80,50 80,70 60,80 40,70 40,50'/%3E%3Cline x1='60' y1='10' x2='60' y2='40'/%3E%3Cline x1='110' y1='35' x2='80' y2='50'/%3E%3Cline x1='110' y1='85' x2='80' y2='70'/%3E%3Cline x1='60' y1='110' x2='60' y2='80'/%3E%3Cline x1='10' y1='85' x2='40' y2='70'/%3E%3Cline x1='10' y1='35' x2='40' y2='50'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3C/g%3E%3C/svg%3E");[m
[31m-    background-size: 120px 120px;[m
[31m-  }[m
[31m-[m
[31m-  #app {[m
[31m-    position: relative;[m
[31m-    z-index: 1;[m
[31m-    display: flex;[m
[31m-    flex-direction: column;[m
[31m-    height: 100dvh;[m
[31m-    height: 100vh;[m
[31m-  }[m
[31m-[m
[31m-  header {[m
[31m-    position: sticky;[m
[31m-    top: 0;[m
[31m-    z-index: 100;[m
[31m-    backdrop-filter: blur(20px) saturate(180%);[m
[31m-    -webkit-backdrop-filter: blur(20px) saturate(180%);[m
[31m-    background: var(--glass-bg);[m
[31m-    border-bottom: 1px solid var(--glass-border);[m
[31m-    box-shadow: 0 1px 30px rgba(0,0,0,0.25);[m
[31m-    padding: 0 24px;[m
[31m-    height: 68px;[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    justify-content: space-between;[m
[31m-    flex-shrink: 0;[m
[31m-  }[m
[31m-[m
[31m-  .header-left {[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    gap: 14px;[m
[31m-  }[m
[31m-[m
[31m-  .logo-mark {[m
[31m-    width: 42px;[m
[31m-    height: 42px;[m
[31m-    background: linear-gradient(135deg, #1a4a2e, #16A34A);[m
[31m-    border-radius: 12px;[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    justify-content: center;[m
[31m-    border: 1px solid rgba(34, 197, 94, 0.3);[m
[31m-    box-shadow: 0 0 20px rgba(22,163,74,0.2), inset 0 1px 0 rgba(255,255,255,0.1);[m
[31m-    flex-shrink: 0;[m
[31m-  }[m
[31m-[m
[31m-  .logo-mark svg { width: 22px; height: 22px; }[m
[31m-[m
[31m-  .header-titles { display: flex; flex-direction: column; }[m
[31m-[m
[31m-  .header-title {[m
[31m-    font-family: var(--font-display);[m
[31m-    font-size: 18px;[m
[31m-    font-weight: 600;[m
[31m-    letter-spacing: 0.02em;[m
[31m-    color: var(--text-primary);[m
[31m-    line-height: 1.2;[m
[31m-  }[m
[31m-[m
[31m-  .header-subtitle {[m
[31m-    font-size: 11px;[m
[31m-    font-weight: 400;[m
[31m-    color: var(--text-muted);[m
[31m-    letter-spacing: 0.08em;[m
[31m-    text-transform: uppercase;[m
[31m-  }[m
[31m-[m
[31m-  .header-badge {[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    gap: 6px;[m
[31m-    padding: 5px 12px;[m
[31m-    background: rgba(22, 163, 74, 0.12);[m
[31m-    border: 1px solid rgba(22, 163, 74, 0.25);[m
[31m-    border-radius: 20px;[m
[31m-    font-size: 12px;[m
[31m-    color: var(--accent-light);[m
[31m-    font-weight: 400;[m
[31m-    letter-spacing: 0.03em;[m
[31m-  }[m
[31m-[m
[31m-  .header-badge::before {[m
[31m-    content: '';[m
[31m-    width: 6px;[m
[31m-    height: 6px;[m
[31m-    background: var(--accent-light);[m
[31m-    border-radius: 50%;[m
[31m-    box-shadow: 0 0 6px var(--accent-light);[m
[31m-    animation: pulse 2s ease-in-out infinite;[m
[31m-  }[m
[31m-[m
[31m-  @keyframes pulse {[m
[31m-    0%, 100% { opacity: 1; }[m
[31m-    50% { opacity: 0.4; }[m
[31m-  }[m
[31m-[m
[31m-  #chat-area {[m
[31m-    flex: 1;[m
[31m-    overflow-y: auto;[m
[31m-    padding: 32px 24px 20px;[m
[31m-    scroll-behavior: smooth;[m
[31m-  }[m
[31m-[m
[31m-  #chat-area::-webkit-scrollbar { width: 4px; }[m
[31m-  #chat-area::-webkit-scrollbar-track { background: transparent; }[m
[31m-  #chat-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }[m
[31m-[m
[31m-  .messages-inner {[m
[31m-    max-width: 760px;[m
[31m-    margin: 0 auto;[m
[31m-    display: flex;[m
[31m-    flex-direction: column;[m
[31m-    gap: 28px;[m
[31m-  }[m
[31m-[m
[31m-  #welcome {[m
[31m-    max-width: 680px;[m
[31m-    margin: 40px auto 0;[m
[31m-    text-align: center;[m
[31m-    animation: fadeUp 0.6s ease both;[m
[31m-  }[m
[31m-[m
[31m-  @keyframes fadeUp {[m
[31m-    from { opacity: 0; transform: translateY(20px); }[m
[31m-    to { opacity: 1; transform: translateY(0); }[m
[31m-  }[m
[31m-[m
[31m-  .crescent-wrap {[m
[31m-    width: 72px;[m
[31m-    height: 72px;[m
[31m-    margin: 0 auto 24px;[m
[31m-    background: radial-gradient(ellipse at 30% 30%, rgba(22,163,74,0.2), rgba(22,163,74,0.05));[m
[31m-    border: 1px solid rgba(22, 163, 74, 0.2);[m
[31m-    border-radius: 50%;[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    justify-content: center;[m
[31m-    box-shadow: 0 0 40px rgba(22, 163, 74, 0.12);[m
[31m-    animation: float 3s ease-in-out infinite;[m
[31m-  }[m
[31m-[m
[31m-  @keyframes float {[m
[31m-    0%, 100% { transform: translateY(0); }[m
[31m-    50% { transform: translateY(-5px); }[m
[31m-  }[m
[31m-[m
[31m-  .crescent-wrap svg { width: 36px; height: 36px; }[m
[31m-[m
[31m-  .welcome-greeting {[m
[31m-    font-family: var(--font-display);[m
[31m-    font-size: clamp(28px, 5vw, 40px);[m
[31m-    font-weight: 500;[m
[31m-    color: var(--text-primary);[m
[31m-    letter-spacing: 0.01em;[m
[31m-    margin-bottom: 12px;[m
[31m-    line-height: 1.15;[m
[31m-  }[m
[31m-[m
[31m-  .welcome-desc {[m
[31m-    font-size: 15px;[m
[31m-    color: var(--text-muted);[m
[31m-    line-height: 1.65;[m
[31m-    max-width: 480px;[m
[31m-    margin: 0 auto 36px;[m
[31m-    font-weight: 300;[m
[31m-  }[m
[31m-[m
[31m-  .suggestions-grid {[m
[31m-    display: grid;[m
[31m-    grid-template-columns: repeat(2, 1fr);[m
[31m-    gap: 12px;[m
[31m-    max-width: 580px;[m
[31m-    margin: 0 auto;[m
[31m-  }[m
[31m-[m
[31m-  .suggestion-card {[m
[31m-    background: var(--bg-secondary);[m
[31m-    border: 1px solid var(--border);[m
[31m-    border-radius: var(--radius-lg);[m
[31m-    padding: 16px 18px;[m
[31m-    text-align: left;[m
[31m-    cursor: pointer;[m
[31m-    transition: all 0.25s ease;[m
[31m-    position: relative;[m
[31m-    overflow: hidden;[m
[31m-  }[m
[31m-[m
[31m-  .suggestion-card::before {[m
[31m-    content: '';[m
[31m-    position: absolute;[m
[31m-    inset: 0;[m
[31m-    background: linear-gradient(135deg, var(--accent-glow), transparent);[m
[31m-    opacity: 0;[m
[31m-    transition: opacity 0.25s ease;[m
[31m-  }[m
[31m-[m
[31m-  .suggestion-card:hover {[m
[31m-    border-color: var(--border-accent);[m
[31m-    transform: translateY(-2px);[m
[31m-    box-shadow: var(--shadow-card), 0 0 20px rgba(22,163,74,0.08);[m
[31m-  }[m
[31m-[m
[31m-  .suggestion-card:hover::before { opacity: 1; }[m
[31m-  .suggestion-card:active { transform: translateY(0); }[m
[31m-[m
[31m-  .suggestion-icon {[m
[31m-    width: 30px;[m
[31m-    height: 30px;[m
[31m-    background: rgba(22, 163, 74, 0.12);[m
[31m-    border-radius: 8px;[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    justify-content: center;[m
[31m-    margin-bottom: 10px;[m
[31m-    border: 1px solid rgba(22, 163, 74, 0.2);[m
[31m-  }[m
[31m-[m
[31m-  .suggestion-icon svg { width: 15px; height: 15px; color: var(--accent-light); }[m
[31m-[m
[31m-  .suggestion-title {[m
[31m-    font-size: 13.5px;[m
[31m-    font-weight: 500;[m
[31m-    color: var(--text-primary);[m
[31m-    line-height: 1.4;[m
[31m-  }[m
[31m-[m
[31m-  .suggestion-sub {[m
[31m-    font-size: 12px;[m
[31m-    color: var(--text-muted);[m
[31m-    margin-top: 3px;[m
[31m-    font-weight: 300;[m
[31m-  }[m
[31m-[m
[31m-  .message {[m
[31m-    display: flex;[m
[31m-    gap: 14px;[m
[31m-    animation: fadeUp 0.35s ease both;[m
[31m-  }[m
[31m-[m
[31m-  .message.user {[m
[31m-    flex-direction: row-reverse;[m
[31m-    align-self: flex-end;[m
[31m-    max-width: 82%;[m
[31m-  }[m
[31m-[m
[31m-  .message.ai { max-width: 92%; }[m
[31m-[m
[31m-  .avatar {[m
[31m-    width: 34px;[m
[31m-    height: 34px;[m
[31m-    border-radius: 10px;[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    justify-content: center;[m
[31m-    flex-shrink: 0;[m
[31m-    margin-top: 2px;[m
[31m-  }[m
[31m-[m
[31m-  .avatar.ai-av {[m
[31m-    background: linear-gradient(135deg, #1a4a2e, #16A34A);[m
[31m-    border: 1px solid rgba(34, 197, 94, 0.3);[m
[31m-    box-shadow: 0 0 12px rgba(22,163,74,0.15);[m
[31m-  }[m
[31m-[m
[31m-  .avatar.user-av {[m
[31m-    background: rgba(148, 163, 184, 0.15);[m
[31m-    border: 1px solid var(--border);[m
[31m-  }[m
[31m-[m
[31m-  .avatar svg { width: 17px; height: 17px; }[m
[31m-[m
[31m-  .bubble {[m
[31m-    padding: 14px 18px;[m
[31m-    border-radius: var(--radius-lg);[m
[31m-    line-height: 1.7;[m
[31m-    font-size: 15px;[m
[31m-    font-weight: 300;[m
[31m-  }[m
[31m-[m
[31m-  .message.user .bubble {[m
[31m-    background: var(--user-bubble);[m
[31m-    border: 1px solid rgba(22, 163, 74, 0.25);[m
[31m-    border-bottom-right-radius: var(--radius-sm);[m
[31m-    color: var(--text-primary);[m
[31m-  }[m
[31m-[m
[31m-  .message.ai .bubble {[m
[31m-    background: var(--ai-bubble);[m
[31m-    border: 1px solid var(--border);[m
[31m-    border-bottom-left-radius: var(--radius-sm);[m
[31m-    color: var(--text-primary);[m
[31m-    box-shadow: 0 2px 12px rgba(0,0,0,0.15);[m
[31m-  }[m
[31m-[m
[31m-  .message-meta {[m
[31m-    font-size: 11px;[m
[31m-    color: var(--text-dim);[m
[31m-    margin-top: 5px;[m
[31m-    padding: 0 4px;[m
[31m-  }[m
[31m-[m
[31m-  .message.user .message-meta { text-align: right; }[m
[31m-[m
[31m-  .typing-indicator {[m
[31m-    display: flex;[m
[31m-    gap: 14px;[m
[31m-    animation: fadeUp 0.35s ease both;[m
[31m-  }[m
[31m-[m
[31m-  .typing-dots {[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    gap: 5px;[m
[31m-    padding: 14px 18px;[m
[31m-    background: var(--ai-bubble);[m
[31m-    border: 1px solid var(--border);[m
[31m-    border-radius: var(--radius-lg);[m
[31m-    border-bottom-left-radius: var(--radius-sm);[m
[31m-  }[m
[31m-[m
[31m-  .typing-dots span {[m
[31m-    width: 7px;[m
[31m-    height: 7px;[m
[31m-    background: var(--text-muted);[m
[31m-    border-radius: 50%;[m
[31m-    animation: bounce 1.2s ease-in-out infinite;[m
[31m-  }[m
[31m-[m
[31m-  .typing-dots span:nth-child(2) { animation-delay: 0.15s; }[m
[31m-  .typing-dots span:nth-child(3) { animation-delay: 0.3s; }[m
[31m-[m
[31m-  @keyframes bounce {[m
[31m-    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }[m
[31m-    40% { transform: translateY(-6px); opacity: 1; }[m
[31m-  }[m
[31m-[m
[31m-  #input-section {[m
[31m-    padding: 16px 24px 24px;[m
[31m-    background: linear-gradient(to top, var(--bg-primary) 70%, transparent);[m
[31m-    flex-shrink: 0;[m
[31m-  }[m
[31m-[m
[31m-  .input-wrap { max-width: 760px; margin: 0 auto; }[m
[31m-[m
[31m-  .input-container {[m
[31m-    display: flex;[m
[31m-    align-items: flex-end;[m
[31m-    gap: 10px;[m
[31m-    background: var(--bg-secondary);[m
[31m-    border: 1px solid var(--border);[m
[31m-    border-radius: var(--radius-xl);[m
[31m-    padding: 10px 10px 10px 20px;[m
[31m-    transition: border-color 0.2s ease, box-shadow 0.2s ease;[m
[31m-    box-shadow: 0 2px 20px rgba(0,0,0,0.2);[m
[31m-  }[m
[31m-[m
[31m-  .input-container:focus-within {[m
[31m-    border-color: rgba(22, 163, 74, 0.4);[m
[31m-    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.08), 0 2px 20px rgba(0,0,0,0.2);[m
[31m-  }[m
[31m-[m
[31m-  #prompt {[m
[31m-    flex: 1;[m
[31m-    background: transparent;[m
[31m-    border: none;[m
[31m-    outline: none;[m
[31m-    color: var(--text-primary);[m
[31m-    font-family: var(--font-body);[m
[31m-    font-size: 15px;[m
[31m-    font-weight: 300;[m
[31m-    line-height: 1.6;[m
[31m-    resize: none;[m
[31m-    min-height: 24px;[m
[31m-    max-height: 160px;[m
[31m-    padding: 4px 0;[m
[31m-    overflow-y: auto;[m
[31m-  }[m
[31m-[m
[31m-  #prompt::placeholder { color: var(--text-dim); }[m
[31m-  #prompt::-webkit-scrollbar { display: none; }[m
[31m-[m
[31m-  #send-btn {[m
[31m-    width: 42px;[m
[31m-    height: 42px;[m
[31m-    background: linear-gradient(135deg, #16A34A, #22C55E);[m
[31m-    border: none;[m
[31m-    border-radius: 14px;[m
[31m-    cursor: pointer;[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    justify-content: center;[m
[31m-    transition: all 0.2s ease;[m
[31m-    flex-shrink: 0;[m
[31m-    box-shadow: 0 2px 12px rgba(22, 163, 74, 0.3);[m
[31m-  }[m
[31m-[m
[31m-  #send-btn:hover {[m
[31m-    transform: scale(1.05);[m
[31m-    box-shadow: 0 4px 20px rgba(22, 163, 74, 0.4);[m
[31m-  }[m
[31m-[m
[31m-  #send-btn:active { transform: scale(0.96); }[m
[31m-[m
[31m-  #send-btn:disabled {[m
[31m-    background: rgba(100,116,139,0.3);[m
[31m-    box-shadow: none;[m
[31m-    cursor: not-allowed;[m
[31m-    transform: none;[m
[31m-  }[m
[31m-[m
[31m-  #send-btn svg { width: 18px; height: 18px; }[m
[31m-[m
[31m-  .input-footer {[m
[31m-    text-align: center;[m
[31m-    margin-top: 10px;[m
[31m-    font-size: 11.5px;[m
[31m-    color: var(--text-dim);[m
[31m-    letter-spacing: 0.02em;[m
[31m-  }[m
[31m-[m
[31m-  .input-footer span {[m
[31m-    font-family: var(--font-display);[m
[31m-    font-style: italic;[m
[31m-    color: rgba(148, 163, 184, 0.6);[m
[31m-    font-size: 12px;[m
[31m-  }[m
[31m-[m
[31m-  @media (max-width: 600px) {[m
[31m-    header { padding: 0 16px; }[m
[31m-    .header-badge { display: none; }[m
[31m-    #chat-area { padding: 20px 16px 16px; }[m
[31m-    #input-section { padding: 12px 16px 20px; }[m
[31m-    .suggestions-grid { grid-template-columns: 1fr; }[m
[31m-    #welcome { margin-top: 20px; }[m
[31m-    .welcome-greeting { font-size: 26px; }[m
[31m-    .message.user { max-width: 92%; }[m
[31m-  }[m
[31m-[m
[31m-  @media (max-width: 400px) {[m
[31m-    .header-subtitle { display: none; }[m
[31m-    .header-title { font-size: 16px; }[m
[31m-  }[m
[31m-[m
[31m-  /* Header Navigation */[m
[31m-  .header-nav {[m
[31m-    display: flex;[m
[31m-    gap: 16px;[m
[31m-    align-items: center;[m
[31m-    margin-left: auto;[m
[31m-    margin-right: 20px;[m
[31m-  }[m
[31m-  .header-nav-link {[m
[31m-    font-size: 13.5px;[m
[31m-    font-weight: 500;[m
[31m-    color: var(--text-muted);[m
[31m-    text-decoration: none;[m
[31m-    transition: all 0.2s ease;[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    gap: 6px;[m
[31m-    padding: 6px 12px;[m
[31m-    border-radius: 8px;[m
[31m-    border: 1px solid transparent;[m
[31m-  }[m
[31m-  .header-nav-link:hover {[m
[31m-    color: var(--text-primary);[m
[31m-    background: rgba(255, 255, 255, 0.05);[m
[31m-  }[m
[31m-  .header-nav-link.active {[m
[31m-    color: var(--accent-light);[m
[31m-    background: rgba(22, 163, 74, 0.1);[m
[31m-    border: 1px solid rgba(22, 163, 74, 0.2);[m
[31m-  }[m
[31m-[m
[31m-  /* Zakat Promo Banner */[m
[31m-  .zakat-promo-banner {[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    gap: 16px;[m
[31m-    background: linear-gradient(135deg, rgba(22, 163, 74, 0.12), rgba(16, 36, 61, 0.8));[m
[31m-    border: 1px solid rgba(22, 163, 74, 0.25);[m
[31m-    border-radius: var(--radius-lg);[m
[31m-    padding: 16px 20px;[m
[31m-    margin: 0 auto 28px;[m
[31m-    max-width: 580px;[m
[31m-    text-align: left;[m
[31m-    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);[m
[31m-    animation: fadeUp 0.6s ease both;[m
[31m-  }[m
[31m-  .zakat-promo-icon {[m
[31m-    font-size: 24px;[m
[31m-    background: rgba(22, 163, 74, 0.15);[m
[31m-    width: 44px;[m
[31m-    height: 44px;[m
[31m-    border-radius: 50%;[m
[31m-    display: flex;[m
[31m-    align-items: center;[m
[31m-    justify-content: center;[m
[31m-    border: 1px solid rgba(22, 163, 74, 0.2);[m
[31m-    flex-shrink: 0;[m
[31m-  }[m
[31m-  .zakat-promo-text-wrap {[m
[31m-    flex: 1;[m
[31m-  }[m
[31m-  .zakat-promo-title {[m
[31m-    font-family: var(--font-body);[m
[31m-    font-size: 14.5px;[m
[31m-    font-weight: 600;[m
[31m-    color: var(--accent-light);[m
[31m-    margin-bottom: 2px;[m
[31m-  }[m
[31m-  .zakat-promo-desc {[m
[31m-    font-size: 12.5px;[m
[31m-    color: var(--text-muted);[m
[31m-    line-height: 1.4;[m
[31m-  }[m
[31m-  .zakat-promo-btn {[m
[31m-    padding: 8px 16px;[m
[31m-    background: var(--accent);[m
[31m-    color: white;[m
[31m-    border-radius: 10px;[m
[31m-    font-size: 13px;[m
[31m-    font-weight: 500;[m
[31m-    text-decoration: none;[m
[31m-    transition: all 0.2s ease;[m
[31m-    white-space: nowrap;[m
[31m-    box-shadow: 0 2px 10px rgba(22, 163, 74, 0.3);[m
[31m-  }[m
[31m-  .zakat-promo-btn:hover {[m
[31m-    background: var(--accent-light);[m
[31m-    transform: translateY(-1px);[m
[31m-    box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4);[m
[31m-  }[m
[31m-[m
[31m-  @media (max-width: 768px) {[m
[31m-    .header-nav {[m
[31m-      gap: 6px;[m
[31m-      margin-right: 10px;[m
[31m-    }[m
[31m-    .header-nav-link span {[m
[31m-      display: none;[m
[31m-    }[m
[31m-    .header-nav-link {[m
[31m-      padding: 6px 10px;[m
[31m-    }[m
[31m-  }[m
[31m-[m
[31m-  @media (max-width: 600px) {[m
[31m-    .zakat-promo-banner {[m
[31m-      flex-direction: column;[m
[31m-      align-items: flex-start;[m
[31m-      gap: 12px;[m
[31m-      padding: 16px;[m
[31m-    }[m
[31m-    .zakat-promo-btn {[m
[31m-      align-self: stretch;[m
[31m-      text-align: center;[m
[31m-    }[m
[31m-  }[m
[31m-</style>[m
[31m-</head>[m
[31m-<body>[m
[31m-[m
[31m-<div class="geo-pattern" aria-hidden="true"></div>[m
[32m+[m[32m  <head>[m
[32m+[m[32m    <meta charset="UTF-8" />[m
[32m+[m[32m    <meta[m
[32m+[m[32m      name="viewport"[m
[32m+[m[32m      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"[m
[32m+[m[32m    />[m
[32m+[m[32m    <title>LuminaDeen AI — Islamic Knowledge Assistant</title>[m
[32m+[m[32m    <link rel="preconnect" href="https://fonts.googleapis.com" />[m
[32m+[m[32m    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />[m
[32m+[m[32m    <link[m
[32m+[m[32m      href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"[m
[32m+[m[32m      rel="stylesheet"[m
[32m+[m[32m    />[m
[32m+[m
[32m+[m[32m    <!-- Progressive Web App and Favicon parameters [1.2.6] -->[m
[32m+[m[32m    <link[m
[32m+[m[32m      rel="shortcut icon"[m
[32m+[m[32m      type="image/png"[m
[32m+[m[32m      href="/static/icons/icon-192x192.png"[m
[32m+[m[32m    />[m
[32m+[m[32m    <link rel="apple-touch-icon" href="/static/icons/icon-192x192.png" />[m
[32m+[m[32m    <link rel="manifest" href="/manifest.json" />[m
[32m+[m[32m    <meta name="theme-color" content="#10b981" />[m
[32m+[m
[32m+[m[32m    <!-- External CSS Style Link -->[m
[32m+[m[32m    <link rel="stylesheet" href="/static/style.css" />[m
[32m+[m
[32m+[m[32m    <!-- External Script Link with Defer -->[m
[32m+[m[32m    <script src="/static/script.js" defer></script>[m
[32m+[m[32m  </head>[m
[32m+[m[32m  <body>[m
[32m+[m[32m    <!-- Fluid Ambient Parallax Bottom Waves -->[m
[32m+[m[32m    <div class="fluid-ambient-container" aria-hidden="true">[m
[32m+[m[32m      <div class="fluid-blob blob-blue"></div>[m
[32m+[m[32m      <div class="fluid-blob blob-violet"></div>[m
[32m+[m[32m    </div>[m
 [m
[31m-<div id="app">[m
[32m+[m[32m    <div class="geometric-overlay" aria-hidden="true"></div>[m
 [m
[31m-  <header role="banner">[m
[31m-    <div class="header-left">[m
[31m-      <div class="logo-mark" aria-hidden="true">[m
[31m-        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">[m
[31m-          <path d="M12 3.5C12 3.5 8.5 6.5 8.5 11C8.5 14.5 10.5 17.5 12 18.5C13.5 17.5 15.5 14.5 15.5 11C15.5 6.5 12 3.5 12 3.5Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.8)" stroke-width="1.2" stroke-linejoin="round"/>[m
[31m-          <path d="M12 3.5C10 5.5 7 8 7 11C7 14.5 9.5 17.5 12 18.5" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" stroke-linecap="round"/>[m
[31m-          <circle cx="12" cy="11" r="2" fill="rgba(255,255,255,0.9)"/>[m
[31m-          <path d="M9 20.5h6M10.5 18.5v2M13.5 18.5v2" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-linecap="round"/>[m
[31m-        </svg>[m
[31m-      </div>[m
[31m-      <div class="header-titles">[m
[31m-        <div class="header-title">LuminaDeen AI</div>[m
[31m-        <div class="header-subtitle">Islamic Knowledge Assistant</div>[m
[32m+[m[32m    <!-- Onboarding Modal Portal -->[m
[32m+[m[32m    <div id="onboarding-overlay" class="onboarding-overlay">[m
[32m+[m[32m      <div class="onboarding-card">[m
[32m+[m[32m        <div class="onboarding-logo">[m
[32m+[m[32m          <img src="/static/icons/icon-192x192.png" alt="LuminaDeen Logo" />[m
[32m+[m[32m        </div>[m
[32m+[m[32m        <h2 class="onboarding-title">Assalamu Alaikum</h2>[m
[32m+[m[32m        <p class="onboarding-subtitle">[m
[32m+[m[32m          Welcome to LuminaDeen AI. Please enter your name to initialize your[m
[32m+[m[32m          personal study dashboard.[m
[32m+[m[32m        </p>[m
[32m+[m[32m        <div class="onboarding-input-wrap">[m
[32m+[m[32m          <input[m
[32m+[m[32m            type="text"[m
[32m+[m[32m            id="onboarding-name-input"[m
[32m+[m[32m            placeholder="Your name..."[m
[32m+[m[32m            maxlength="20"[m
[32m+[m[32m            required[m
[32m+[m[32m          />[m
[32m+[m[32m          <button id="onboarding-submit-btn">Begin Journey</button>[m
[32m+[m[32m        </div>[m
       </div>[m
     </div>[m
[31m-    <div class="header-nav">[m
[31m-      <a href="/" class="header-nav-link active">💬 <span>AI Assistant</span></a>[m
[31m-      <a href="/zakat-calculator" class="header-nav-link">🧮 <span>Calculator</span></a>[m
[31m-      <a href="/zakat-guide" class="header-nav-link">📖 <span>Guide</span></a>[m
[31m-    </div>[m
[31m-    <div class="header-badge" role="status" aria-label="AI online">Online</div>[m
[31m-  </header>[m
 [m
[31m-  <main id="chat-area" role="main" aria-label="Chat conversation" aria-live="polite">[m
[31m-    <div class="messages-inner" id="messages">[m
[32m+[m[32m    <!-- Google Search Grounding Trigger Portal Modal -->[m
[32m+[m[32m    <div[m
[32m+[m[32m      id="topics-overlay"[m
[32m+[m[32m      class="topics-overlay"[m
[32m+[m[32m      onclick="closeGroundedTopics(event)"[m
[32m+[m[32m    >[m
[32m+[m[32m      <div class="topics-card" onclick="event.stopPropagation()">[m
[32m+[m[32m        <div class="topics-card-header">[m
[32m+[m[32m          <h2 class="topics-card-title">Today's Discussion Topics</h2>[m
[32m+[m[32m          <div class="topics-header-actions">[m
[32m+[m[32m            <!-- Interactive Refresh topics -->[m
[32m+[m[32m            <button[m
[32m+[m[32m              class="refresh-topics-btn"[m
[32m+[m[32m              onclick="refreshGroundedTopics(event)"[m
[32m+[m[32m              title="Pull fresh topics"[m
[32m+[m[32m            >[m
[32m+[m[32m              <svg[m
[32m+[m[32m                viewBox="0 0 24 24"[m
[32m+[m[32m                fill="none"[m
[32m+[m[32m                stroke="currentColor"[m
[32m+[m[32m                stroke-width="2.5"[m
[32m+[m[32m                style="width: 14px; height: 14px"[m
[32m+[m[32m              >[m
[32m+[m[32m                <path[m
[32m+[m[32m                  d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67"[m
[32m+[m[32m                  stroke-linecap="round"[m
[32m+[m[32m                  stroke-linejoin="round"[m
[32m+[m[32m                />[m
[32m+[m[32m              </svg>[m
[32m+[m[32m            </button>[m
[32m+[m[32m            <button[m
[32m+[m[32m              class="close-topics-btn"[m
[32m+[m[32m              onclick="closeGroundedTopics(event)"[m
[32m+[m[32m            >[m
[32m+[m[32m              ✕[m
[32m+[m[32m            </button>[m
[32m+[m[32m          </div>[m
[32m+[m[32m        </div>[m
[32m+[m[32m        <div class="topics-list-container" id="topics-list-container">[m
[32m+[m[32m          <!-- Generated Dynamically in Script -->[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    </div>[m
 [m
[31m-      <div id="welcome" role="region" aria-label="Welcome">[m
[31m-        <div class="crescent-wrap" aria-hidden="true">[m
[31m-          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">[m
[31m-            <path d="M18 6C13.5 6 10 9.5 10 14C10 18.5 13.5 22 18 22C19.5 22 20.9 21.6 22.1 20.9C20.7 22.2 18.9 23 17 23C12.6 23 9 19.4 9 15C9 10.6 12.6 7 17 7C17.7 7 18.4 7.1 19 7.3C18.7 6.4 18.4 6 18 6Z" fill="#22C55E" opacity="0.3"/>[m
[31m-            <path d="M20 5C15.6 5 12 8.6 12 13C12 17.4 15.6 21 20 21C21.5 21 22.9 20.6 24.1 19.9C22.1 21.8 19.4 23 16.5 23C10.7 23 6 18.3 6 12.5C6 6.7 10.7 2 16.5 2C18.8 2 20.9 2.7 22.6 4C21.8 4.3 20.9 5 20 5Z" fill="#22C55E" opacity="0.9"/>[m
[31m-            <circle cx="26" cy="8" r="1.5" fill="#22C55E" opacity="0.6"/>[m
[31m-            <circle cx="29" cy="13" r="1" fill="#22C55E" opacity="0.4"/>[m
[31m-          </svg>[m
[32m+[m[32m    <div id="app">[m
[32m+[m[32m      <!-- Interactive Sidebar backdrop layer -->[m
[32m+[m[32m      <div class="sidebar-backdrop" id="sidebar-backdrop"></div>[m
[32m+[m
[32m+[m[32m      <!-- Collapsible Navigation Sidebar -->[m
[32m+[m[32m      <aside id="sidebar">[m
[32m+[m[32m        <div class="sidebar-header">[m
[32m+[m[32m          <button class="new-chat-btn" id="new-chat-btn">[m
[32m+[m[32m            <svg[m
[32m+[m[32m              viewBox="0 0 24 24"[m
[32m+[m[32m              fill="none"[m
[32m+[m[32m              stroke="currentColor"[m
[32m+[m[32m              stroke-width="2"[m
[32m+[m[32m            >[m
[32m+[m[32m              <path[m
[32m+[m[32m                d="M12 5v14M5 12h14"[m
[32m+[m[32m                stroke-linecap="round"[m
[32m+[m[32m                stroke-linejoin="round"[m
[32m+[m[32m              />[m
[32m+[m[32m            </svg>[m
[32m+[m[32m            <span>New Chat</span>[m
[32m+[m[32m          </button>[m
         </div>[m
[31m-        <h1 class="welcome-greeting">Assalamu Alaikum</h1>[m
[31m-        <p class="welcome-desc">Ask questions about Islam, Quran, Hadith, Seerah, Fiqh, and Islamic history. I am here to guide you with knowledge.</p>[m
[31m-        [m
[31m-        <!-- New Integrated Feature Showcase Banner -->[m
[31m-        <div class="zakat-promo-banner" role="region" aria-label="Zakat Calculator Feature">[m
[31m-          <div class="zakat-promo-icon">✨</div>[m
[31m-          <div class="zakat-promo-text-wrap">[m
[31m-            <h3 class="zakat-promo-title">New Feature: Sharia Zakat Calculator</h3>[m
[31m-            <p class="zakat-promo-desc">Accurately calculate your Zakat on gold, silver, cash, crops, and business investments. Real-time Nisab thresholds supported.</p>[m
[32m+[m
[32m+[m[32m        <!-- Active dynamic history stream -->[m
[32m+[m[32m        <div class="sidebar-scroll">[m
[32m+[m[32m          <div class="history-section-label">Recents</div>[m
[32m+[m[32m          <div class="history-list" id="history-list">[m
[32m+[m[32m            <!-- Rendered in script -->[m
           </div>[m
[31m-          <a href="/zakat-calculator" class="zakat-promo-btn">Open Calculator</a>[m
         </div>[m
 [m
[31m-        <div class="suggestions-grid" role="list" aria-label="Suggested questions">[m
[31m-          <button class="suggestion-card" role="listitem" onclick="sendSuggestion('Explain Surah Al-Fatiha — its meaning and significance in Islam')" aria-label="Suggestion: Explain Surah Al-Fatiha">[m
[31m-            <div class="suggestion-icon" aria-hidden="true">[m
[31m-              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">[m
[31m-                <path d="M3 4h10M3 8h7M3 12h5"/>[m
[31m-                <path d="M12 10l2 2-2 2" opacity="0.7"/>[m
[31m-              </svg>[m
[32m+[m[32m        <!-- Profile Settings bar -->[m
[32m+[m[32m        <div class="sidebar-footer">[m
[32m+[m[32m          <div class="profile-bar">[m
[32m+[m[32m            <div class="profile-meta">[m
[32m+[m[32m              <div class="profile-circle" id="profile-avatar-circle">LD</div>[m
[32m+[m[32m              <span[m
[32m+[m[32m                class="profile-name"[m
[32m+[m[32m                id="profile-name-display"[m
[32m+[m[32m                onclick="renameProfile(event)"[m
[32m+[m[32m                >User</span[m
[32m+[m[32m              >[m
             </div>[m
[31m-            <div class="suggestion-title">Explain Surah Al-Fatiha</div>[m
[31m-            <div class="suggestion-sub">Meaning & significance</div>[m
[31m-          </button>[m
[31m-          <button class="suggestion-card" role="listitem" onclick="sendSuggestion('What is Tawakkul in Islam? How do we practice it in daily life?')" aria-label="Suggestion: What is Tawakkul">[m
[31m-            <div class="suggestion-icon" aria-hidden="true">[m
[31m-              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">[m
[31m-                <circle cx="8" cy="6" r="3"/>[m
[31m-                <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>[m
[32m+[m[32m            <button[m
[32m+[m[32m              class="settings-btn"[m
[32m+[m[32m              id="settings-btn"[m
[32m+[m[32m              aria-label="Settings panel"[m
[32m+[m[32m            >[m
[32m+[m[32m              <svg[m
[32m+[m[32m                viewBox="0 0 24 24"[m
[32m+[m[32m                fill="none"[m
[32m+[m[32m                stroke="currentColor"[m
[32m+[m[32m                stroke-width="2"[m
[32m+[m[32m                style="width: 18px; height: 18px"[m
[32m+[m[32m              >[m
[32m+[m[32m                <path[m
[32m+[m[32m                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"[m
[32m+[m[32m                />[m
[32m+[m[32m                <circle cx="12" cy="12" r="3" />[m
               </svg>[m
[31m-            </div>[m
[31m-            <div class="suggestion-title">What is Tawakkul?</div>[m
[31m-            <div class="suggestion-sub">Trust & reliance on Allah</div>[m
[31m-          </button>[m
[31m-          <button class="suggestion-card" role="listitem" onclick="sendSuggestion('Tell me about the Seerah — the life of Prophet Muhammad ﷺ')" aria-label="Suggestion: Tell me about the Seerah">[m
[31m-            <div class="suggestion-icon" aria-hidden="true">[m
[31m-              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">[m
[31m-                <path d="M8 2L8 14M2 8l6-6 6 6"/>[m
[31m-                <circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/>[m
[32m+[m[32m            </button>[m
[32m+[m[32m          </div>[m
[32m+[m
[32m+[m[32m          <!-- Settings Dropdown containing Export & Schema-Defensive Import Backup features -->[m
[32m+[m[32m          <div class="settings-dropdown" id="settings-dropdown">[m
[32m+[m[32m            <!-- Persistent Sun/Moon Theme switcher -->[m
[32m+[m[32m            <button class="context-option" onclick="toggleViewTheme()">[m
[32m+[m[32m              <svg[m
[32m+[m[32m                viewBox="0 0 24 24"[m
[32m+[m[32m                fill="none"[m
[32m+[m[32m                stroke="currentColor"[m
[32m+[m[32m                stroke-width="2"[m
[32m+[m[32m                style="width: 14px; height: 14px"[m
[32m+[m[32m              >[m
[32m+[m[32m                <circle cx="12" cy="12" r="5" />[m
[32m+[m[32m                <path[m
[32m+[m[32m                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"[m
[32m+[m[32m                />[m
               </svg>[m
[31m-            </div>[m
[31m-            <div class="suggestion-title">Tell me about the Seerah</div>[m
[31m-            <div class="suggestion-sub">Life of the Prophet ﷺ</div>[m
[31m-          </button>[m
[31m-          <button class="suggestion-card" role="listitem" onclick="sendSuggestion('Explain the Hadith about intentions — the Hadith of Niyyah — and its lessons')" aria-label="Suggestion: Explain a Hadith">[m
[31m-            <div class="suggestion-icon" aria-hidden="true">[m
[31m-              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">[m
[31m-                <rect x="2" y="2" width="12" height="12" rx="2"/>[m
[31m-                <path d="M5 8h6M5 5.5h6M5 10.5h4"/>[m
[32m+[m[32m              <span id="theme-toggle-text">Light Mode</span>[m
[32m+[m[32m            </button>[m
[32m+[m[32m            <button class="context-option" onclick="exportHistory()">[m
[32m+[m[32m              <svg[m
[32m+[m[32m                viewBox="0 0 24 24"[m
[32m+[m[32m                fill="none"[m
[32m+[m[32m                stroke="currentColor"[m
[32m+[m[32m                stroke-width="2"[m
[32m+[m[32m                style="width: 14px; height: 14px"[m
[32m+[m[32m              >[m
[32m+[m[32m                <path[m
[32m+[m[32m                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 3v8m0-8l3 3m-3-3L9 6"[m
[32m+[m[32m                  stroke-linecap="round"[m
[32m+[m[32m                  stroke-linejoin="round"[m
[32m+[m[32m                />[m
               </svg>[m
[31m-            </div>[m
[31m-            <div class="suggestion-title">Explain a Hadith</div>[m
[31m-            <div class="suggestion-sub">Hadith of Niyyah & its lessons</div>[m
[31m-          </button>[m
[32m+[m[32m              <span>Export History</span>[m
[32m+[m[32m            </button>[m
[32m+[m[32m            <button class="context-option" onclick="triggerImport()">[m
[32m+[m[32m              <svg[m
[32m+[m[32m                viewBox="0 0 24 24"[m
[32m+[m[32m                fill="none"[m
[32m+[m[32m                stroke="currentColor"[m
[32m+[m[32m                stroke-width="2"[m
[32m+[m[32m                style="width: 14px; height: 14px"[m
[32m+[m[32m              >[m
[32m+[m[32m                <path[m
[32m+[m[32m                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 11V3m0 8l3-3m-3 3L9 8"[m
[32m+[m[32m                  stroke-linecap="round"[m
[32m+[m[32m                  stroke-linejoin="round"[m
[32m+[m[32m                />[m
[32m+[m[32m              </svg>[m
[32m+[m[32m              <span>Import History</span>[m
[32m+[m[32m            </button>[m
[32m+[m[32m            <button[m
[32m+[m[32m              class="context-option"[m
[32m+[m[32m              onclick="clearAllHistory()"[m
[32m+[m[32m              style="color: #f87171"[m
[32m+[m[32m            >[m
[32m+[m[32m              <svg[m
[32m+[m[32m                viewBox="0 0 24 24"[m
[32m+[m[32m                fill="none"[m
[32m+[m[32m                stroke="currentColor"[m
[32m+[m[32m                stroke-width="2"[m
[32m+[m[32m                style="width: 14px; height: 14px"[m
[32m+[m[32m              >[m
[32m+[m[32m                <path[m
[32m+[m[32m                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"[m
[32m+[m[32m                  stroke-linecap="round"[m
[32m+[m[32m                  stroke-linejoin="round"[m
[32m+[m[32m                />[m
[32m+[m[32m              </svg>[m
[32m+[m[32m              <span>Delete All History</span>[m
[32m+[m[32m            </button>[m
[32m+[m[32m          </div>[m
         </div>[m
[31m-      </div>[m
[31m-[m
[31m-    </div>[m
[31m-  </main>[m
[31m-[m
[31m-  <footer id="input-section" role="contentinfo">[m
[31m-    <div class="input-wrap">[m
[31m-      <div class="input-container" role="form" aria-label="Message input">[m
[31m-        <textarea[m
[31m-          id="prompt"[m
[31m-          placeholder="Ask anything about Islam..."[m
[31m-          rows="1"[m
[31m-          aria-label="Type your question"[m
[31m-          aria-multiline="true"[m
[31m-        ></textarea>[m
[31m-        <button id="send-btn" aria-label="Send message" disabled>[m
[31m-          <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">[m
[31m-            <path d="M9 14V4M9 4L4.5 8.5M9 4L13.5 8.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>[m
[31m-          </svg>[m
[31m-        </button>[m
[31m-      </div>[m
[31m-      <div class="input-footer">[m
[31m-        <span>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>[m
[31m-        &nbsp;·&nbsp; LuminaDeen AI may make errors. Verify with scholars.[m
[32m+[m[32m      </aside>[m
[32m+[m
[32m+[m[32m      <!-- Global Workspace Canvas -->[m
[32m+[m[32m      <div class="workspace">[m
[32m+[m[32m        <header role="banner">[m
[32m+[m[32m          <div class="header-left">[m
[32m+[m[32m            <button[m
[32m+[m[32m              class="sidebar-toggle"[m
[32m+[m[32m              id="sidebar-toggle"[m
[32m+[m[32m              aria-label="Toggle Navigation Panel"[m
[32m+[m[32m            >[m
[32m+[m[32m              <svg[m
[32m+[m[32m                class="nav-icon menu-icon"[m
[32m+[m[32m                viewBox="0 0 24 24"[m
[32m+[m[32m                fill="none"[m
[32m+[m[32m                stroke="currentColor"[m
[32m+[m[32m                stroke-width="2.2"[m
[32m+[m[32m                stroke-linecap="round"[m
[32m+[m[32m              >[m
[32m+[m[32m                <line x1="4" y1="6" x2="20" y2="6"></line>[m
[32m+[m[32m                <line x1="4" y1="12" x2="20" y2="12"></line>[m
[32m+[m[32m                <line x1="4" y1="18" x2="20" y2="18"></line>[m
[32m+[m[32m              </svg>[m
[32m+[m[32m              <svg[m
[32m+[m[32m                class="nav-icon close-icon"[m
[32m+[m[32m                viewBox="0 0 24 24"[m
[32m+[m[32m                fill="none"[m
[32m+[m[32m                stroke="currentColor"[m
[32m+[m[32m                stroke-width="2.2"[m
[32m+[m[32m                stroke-linecap="round"[m
[32m+[m[32m                stroke-linejoin="round"[m
[32m+[m[32m              >[m
[32m+[m[32m                <line x1="4" y1="6" x2="15" y2="6"></line>[m
[32m+[m[32m                <line x1="4" y1="12" x2="13" y2="12"></line>[m
[32m+[m[32m                <line x1="4" y1="18" x2="15" y2="18"></line>[m
[32m+[m[32m                <polyline points="19 7 15 12 19 17"></polyline>[m
[32m+[m[32m              </svg>[m
[32m+[m[32m            </button>[m
[32m+[m[32m            <div class="brand-block" id="brand-block">[m
[32m+[m[32m              <img[m
[32m+[m[32m                src="/static/icons/icon-192x192.png"[m
[32m+[m[32m                alt="LuminaDeen Logo"[m
[32m+[m[32m                class="brand-logo-img"[m
[32m+[m[32m              />[m
[32m+[m[32m              <span class="brand-title">LuminaDeen AI</span>[m
[32m+[m[32m            </div>[m
[32m+[m[32m          </div>[m
[32m+[m[32m          <div class="header-spacer"></div>[m
[32m+[m[32m        </header>[m
[32m+[m
[32m+[m[32m        <!-- Chat workspace list streams -->[m
[32m+[m[32m        <main id="chat-area" role="main">[m
[32m+[m[32m          <div class="messages-inner" id="messages">[m
[32m+[m[32m            <!-- Welcome Dashboard -->[m
[32m+[m[32m            <div id="welcome-canvas">[m
[32m+[m[32m              <h1 class="welcome-greeting">[m
[32m+[m[32m                Level up your Faith, <span id="greeting-user-name">User</span>[m
[32m+[m[32m              </h1>[m
[32m+[m[32m              <button class="explore-btn" onclick="openGroundedTopics(event)">[m
[32m+[m[32m                <svg[m
[32m+[m[32m                  viewBox="0 0 24 24"[m
[32m+[m[32m                  fill="none"[m
[32m+[m[32m                  stroke="currentColor"[m
[32m+[m[32m                  stroke-width="2.5"[m
[32m+[m[32m                  stroke-linecap="round"[m
[32m+[m[32m                  stroke-linejoin="round"[m
[32m+[m[32m                >[m
[32m+[m[32m                  <circle cx="12" cy="12" r="10" />[m
[32m+[m[32m                  <path[m
[32m+[m[32m                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.42M17.66 17.66l1.41 1.42M2 12h2M20 12h2M6.34 17.66l-1.41 1.42M19.07 4.93l-1.41 1.42"[m
[32m+[m[32m                  />[m
[32m+[m[32m                </svg>[m
[32m+[m[32m                <span>✨ Choose Topics</span>[m
[32m+[m[32m              </button>[m
[32m+[m[32m            </div>[m
[32m+[m[32m          </div>[m
[32m+[m[32m        </main>[m
[32m+[m
[32m+[m[32m        <!-- Bottom input section capsules -->[m
[32m+[m[32m        <footer id="input-section" role="contentinfo">[m
[32m+[m[32m          <div class="input-wrap">[m
[32m+[m[32m            <div class="input-container" role="form">[m
[32m+[m[32m              <!-- Unified Model Dropdown Chip (Excluding Pro) -->[m
[32m+[m[32m              <div class="model-selector">[m
[32m+[m[32m                <div[m
[32m+[m[32m                  class="model-pill"[m
[32m+[m[32m                  id="model-pill"[m
[32m+[m[32m                  title="LuminaDeen powered by Google Gemini API"[m
[32m+[m[32m                >[m
[32m+[m[32m                  <span id="model-pill-text">3.5 Flash</span>[m
[32m+[m[32m                  <svg[m
[32m+[m[32m                    viewBox="0 0 24 24"[m
[32m+[m[32m                    fill="none"[m
[32m+[m[32m                    stroke="currentColor"[m
[32m+[m[32m                    stroke-width="2.5"[m
[32m+[m[32m                  >[m
[32m+[m[32m                    <path[m
[32m+[m[32m                      d="M19 9l-7 7-7-7"[m
[32m+[m[32m                      stroke-linecap="round"[m
[32m+[m[32m                      stroke-linejoin="round"[m
[32m+[m[32m                    />[m
[32m+[m[32m                  </svg>[m
[32m+[m[32m                </div>[m
[32m+[m
[32m+[m[32m                <div class="model-popover" id="model-popover">[m
[32m+[m[32m                  <div[m
[32m+[m[32m                    class="model-option-card active"[m
[32m+[m[32m                    data-model="gemini-3.5-flash"[m
[32m+[m[32m                    title="Gemini 3.5 Flash: Next-gen high speed model by Google"[m
[32m+[m[32m                  >[m
[32m+[m[32m                    <div class="model-meta">[m
[32m+[m[32m                      <span class="model-label">3.5 Flash</span>[m
[32m+[m[32m                      <span class="model-desc">All-around help</span>[m
[32m+[m[32m                    </div>[m
[32m+[m[32m                    <svg[m
[32m+[m[32m                      class="model-check"[m
[32m+[m[32m                      viewBox="0 0 24 24"[m
[32m+[m[32m                      fill="none"[m
[32m+[m[32m                      stroke="currentColor"[m
[32m+[m[32m                      stroke-width="3"[m
[32m+[m[32m                    >[m
[32m+[m[32m                      <path[m
[32m+[m[32m                        d="M5 13l4 4L19 7"[m
[32m+[m[32m                        stroke-linecap="round"[m
[32m+[m[32m                        stroke-linejoin="round"[m
[32m+[m[32m                      />[m
[32m+[m[32m                    </svg>[m
[32m+[m[32m                  </div>[m
[32m+[m[32m                  <div[m
[32m+[m[32m                    class="model-option-card"[m
[32m+[m[32m                    data-model="gemini-3.1-flash-lite"[m
[32m+[m[32m                    title="Gemini 3.1 Flash-Lite: Lightweight fast model by Google"[m
[32m+[m[32m                  >[m
[32m+[m[32m                    <div class="model-meta">[m
[32m+[m[32m                      <span class="model-label">3.1 Flash-Lite</span>[m
[32m+[m[32m                      <span class="model-desc">Fastest answers</span>[m
[32m+[m[32m                    </div>[m
[32m+[m[32m                    <svg[m
[32m+[m[32m                      class="model-check"[m
[32m+[m[32m                      viewBox="0 0 24 24"[m
[32m+[m[32m                      fill="none"[m
[32m+[m[32m                      stroke="currentColor"[m
[32m+[m[32m                      stroke-width="3"[m
[32m+[m[32m                    >[m
[32m+[m[32m                      <path[m
[32m+[m[32m                        d="M5 13l4 4L19 7"[m
[32m+[m[32m                        stroke-linecap="round"[m
[32m+[m[32m                        stroke-linejoin="round"[m
[32m+[m[32m                      />[m
[32m+[m[32m                    </svg>[m
[32m+[m[32m                  </div>[m
[32m+[m[32m                  <div[m
[32m+[m[32m                    class="model-option-card"[m
[32m+[m[32m                    data-model="gemini-2.5-flash"[m
[32m+[m[32m                    title="Gemini 2.5 Flash: Standard fast performance model by Google"[m
[32m+[m[32m                  >[m
[32m+[m[32m                    <div class="model-meta">[m
[32m+[m[32m                      <span class="model-label">2.5 Flash</span>[m
[32m+[m[32m                      <span class="model-desc">Standard balanced speed</span>[m
[32m+[m[32m                    </div>[m
[32m+[m[32m                    <svg[m
[32m+[m[32m                      class="model-check"[m
[32m+[m[32m                      viewBox="0 0 24 24"[m
[32m+[m[32m                      fill="none"[m
[32m+[m[32m                      stroke="currentColor"[m
[32m+[m[32m                      stroke-width="3"[m
[32m+[m[32m                    >[m
[32m+[m[32m                      <path[m
[32m+[m[32m                        d="M5 13l4 4L19 7"[m
[32m+[m[32m                        stroke-linecap="round"[m
[32m+[m[32m                        stroke-linejoin="round"[m
[32m+[m[32m                      />[m
[32m+[m[32m                    </svg>[m
[32m+[m[32m                  </div>[m
[32m+[m[32m                </div>[m
[32m+[m[32m              </div>[m
[32m+[m[32m              <!-- Secured close of model-selector -->[m
[32m+[m
[32m+[m[32m              <textarea[m
[32m+[m[32m                id="prompt"[m
[32m+[m[32m                placeholder="Ask LuminaDeen..."[m
[32m+[m[32m                rows="1"[m
[32m+[m[32m                aria-label="Islamic Knowledge Inquiry"[m
[32m+[m[32m              ></textarea>[m
[32m+[m
[32m+[m[32m              <button id="send-btn" aria-label="Submit Question" disabled>[m
[32m+[m[32m                <svg[m
[32m+[m[32m                  viewBox="0 0 24 24"[m
[32m+[m[32m                  fill="none"[m
[32m+[m[32m                  stroke="currentColor"[m
[32m+[m[32m                  stroke-width="2.5"[m
[32m+[m[32m                >[m
[32m+[m[32m                  <path[m
[32m+[m[32m                    d="M14 5l7 7m0 0l-7 7m7-7H3"[m
[32m+[m[32m                    stroke-linecap="round"[m
[32m+[m[32m                    stroke-linejoin="round"[m
[32m+[m[32m                  />[m
[32m+[m[32m                </svg>[m
[32m+[m[32m              </button>[m
[32m+[m[32m            </div>[m
[32m+[m[32m            <!-- Secured close of input-container -->[m
[32m+[m[32m            <div class="input-footer">[m
[32m+[m[32m              <span>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>[m
[32m+[m[32m              &nbsp;·&nbsp; Verify citations with Quranic chapters and primary[m
[32m+[m[32m              Hadith books.[m
[32m+[m[32m            </div>[m
[32m+[m[32m          </div>[m
[32m+[m[32m        </footer>[m
       </div>[m
     </div>[m
[31m-  </footer>[m
[31m-[m
[31m-</div>[m
[31m-[m
[31m-<script>[m
[31m-  const prompt = document.getElementById('prompt');[m
[31m-  const sendBtn = document.getElementById('send-btn');[m
[31m-  const messagesEl = document.getElementById('messages');[m
[31m-  const welcome = document.getElementById('welcome');[m
[31m-  const chatArea = document.getElementById('chat-area');[m
[31m-[m
[31m-  let isTyping = false;[m
[31m-  let messageCount = 0;[m
[31m-[m
[31m-const defaults = [[m
[31m-    `Jazakallahu Khayran for your question. This topic requires deeper research. I recommend consulting a qualified Islamic scholar for an accurate answer. May Allah ﷻ grant us all beneficial knowledge. آمين`,[m
[31m-[m
[31m-    `This is a beautiful question. While I work to expand my knowledge base, I encourage you to explore authentic Islamic sources such as <strong style="color:var(--accent-light)">sunnah.com</strong> for Hadith and <strong style="color:var(--accent-light)">quran.com</strong> for Quranic references. May Allah guide us all. آمين`[m
[31m-];[m
[31m-[m
[31m-  prompt.addEventListener('input', () => {[m
[31m-    prompt.style.height = 'auto';[m
[31m-    prompt.style.height = Math.min(prompt.scrollHeight, 160) + 'px';[m
[31m-    sendBtn.disabled = !prompt.value.trim();[m
[31m-  });[m
[31m-[m
[31m-  prompt.addEventListener('keydown', e => {[m
[31m-    if (e.key === 'Enter' && !e.shiftKey) {[m
[31m-      e.preventDefault();[m
[31m-      if (!sendBtn.disabled) handleSend();[m
[31m-    }[m
[31m-  });[m
[31m-[m
[31m-  sendBtn.addEventListener('click', handleSend);[m
[31m-[m
[31m-  function sendSuggestion(text) {[m
[31m-    prompt.value = text;[m
[31m-    prompt.dispatchEvent(new Event('input'));[m
[31m-    handleSend();[m
[31m-  }[m
[31m-[m
[31m-  function handleSend() {[m
[31m-    const text = prompt.value.trim();[m
[31m-    if (!text || isTyping) return;[m
[31m-[m
[31m-    if (welcome.parentNode) welcome.remove();[m
[31m-[m
[31m-    addUserMessage(text);[m
[31m-    prompt.value = '';[m
[31m-    prompt.style.height = 'auto';[m
[31m-    sendBtn.disabled = true;[m
[31m-[m
[31m-    setTimeout(() => showTyping(), 350);[m
[31m-    setTimeout(async () => {[m
[31m-    removeTyping();[m
[31m-    const reply = await generateResponse(text);[m
[31m-    addAIMessage(reply);[m
[31m-}, 1800 + Math.random() * 800);[m
[31m-  }[m
[31m-[m
[31m-  function addUserMessage(text) {[m
[31m-    messageCount++;[m
[31m-    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });[m
[31m-    const el = document.createElement('div');[m
[31m-    el.className = 'message user';[m
[31m-    el.setAttribute('role', 'article');[m
[31m-    el.setAttribute('aria-label', 'Your message');[m
[31m-    el.innerHTML = `[m
[31m-      <div class="avatar user-av" aria-hidden="true">[m
[31m-        <svg viewBox="0 0 18 18" fill="none" stroke="rgba(148,163,184,0.8)" stroke-width="1.5" stroke-linecap="round">[m
[31m-          <circle cx="9" cy="6" r="3.5"/>[m
[31m-          <path d="M2 16c0-3.9 3.1-7 7-7s7 3.1 7 7"/>[m
[31m-        </svg>[m
[31m-      </div>[m
[31m-      <div>[m
[31m-        <div class="bubble">${escapeHtml(text)}</div>[m
[31m-        <div class="message-meta">${now}</div>[m
[31m-      </div>`;[m
[31m-    messagesEl.appendChild(el);[m
[31m-    scrollToBottom();[m
[31m-  }[m
[31m-[m
[31m-  function addAIMessage(text) {[m
[31m-    messageCount++;[m
[31m-    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });[m
[31m-    const el = document.createElement('div');[m
[31m-    el.className = 'message ai';[m
[31m-    el.setAttribute('role', 'article');[m
[31m-    el.setAttribute('aria-label', 'LuminaDeen AI response');[m
[31m-    el.innerHTML = `[m
[31m-      <div class="avatar ai-av" aria-hidden="true">[m
[31m-        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">[m
[31m-          <path d="M9 2.5C9 2.5 6.5 4.5 6.5 7.5C6.5 9.8 7.8 11.8 9 12.5C10.2 11.8 11.5 9.8 11.5 7.5C11.5 4.5 9 2.5 9 2.5Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" stroke-width="1" stroke-linejoin="round"/>[m
[31m-          <circle cx="9" cy="7.5" r="1.5" fill="white"/>[m
[31m-          <path d="M7 14.5h4M8 12.5v2M10 12.5v2" stroke="rgba(255,255,255,0.6)" stroke-width="0.9" stroke-linecap="round"/>[m
[31m-        </svg>[m
[31m-      </div>[m
[31m-      <div>[m
[31m-        <div class="bubble">${text}</div>[m
[31m-        <div class="message-meta">LuminaDeen AI · ${now}</div>[m
[31m-      </div>`;[m
[31m-    messagesEl.appendChild(el);[m
[31m-    scrollToBottom();[m
[31m-  }[m
[31m-[m
[31m-  let typingEl = null;[m
[31m-[m
[31m-  function showTyping() {[m
[31m-    isTyping = true;[m
[31m-    typingEl = document.createElement('div');[m
[31m-    typingEl.className = 'typing-indicator';[m
[31m-    typingEl.setAttribute('aria-label', 'AI is thinking');[m
[31m-    typingEl.setAttribute('aria-live', 'polite');[m
[31m-    typingEl.innerHTML = `[m
[31m-      <div class="avatar ai-av" aria-hidden="true">[m
[31m-        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">[m
[31m-          <path d="M9 2.5C9 2.5 6.5 4.5 6.5 7.5C6.5 9.8 7.8 11.8 9 12.5C10.2 11.8 11.5 9.8 11.5 7.5C11.5 4.5 9 2.5 9 2.5Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" stroke-width="1" stroke-linejoin="round"/>[m
[31m-          <circle cx="9" cy="7.5" r="1.5" fill="white"/>[m
[31m-        </svg>[m
[31m-      </div>[m
[31m-      <div class="typing-dots" aria-hidden="true">[m
[31m-        <span></span><span></span><span></span>[m
[31m-      </div>`;[m
[31m-    messagesEl.appendChild(typingEl);[m
[31m-    scrollToBottom();[m
[31m-  }[m
[31m-[m
[31m-  function removeTyping() {[m
[31m-    isTyping = false;[m
[31m-    if (typingEl) { typingEl.remove(); typingEl = null; }[m
[31m-  }[m
[31m-[m
[31m-  function scrollToBottom() {[m
[31m-    chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });[m
[31m-  }[m
[31m-[m
[31m-  function escapeHtml(str) {[m
[31m-    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\n/g,'<br>');[m
[31m-  }[m
[31m-[m
[31m-  const responses = {[m
[31m-    fatiha: `<strong style="color:var(--accent-light)">Surah Al-Fatiha</strong> — "The Opening" — is the first chapter of the Holy Quran and the most recited prayer in Islam, repeated seventeen times daily in our five prayers.<br><br>Its seven verses are a complete dialogue between the servant and Allah ﷻ. We begin by praising Him as <em>Ar-Rahman Ar-Rahim</em> (The Most Gracious, Most Merciful), acknowledge His sovereignty on the Day of Judgment, and declare our complete dependence: <em>"You alone we worship, and You alone we seek for help."</em><br><br>The closing verses are a supplication — a heartfelt plea to be guided on the Straight Path: the path of those Allah has blessed, not those who earned anger or went astray.<br><br>The Prophet ﷺ called it <em>Umm al-Quran</em> (Mother of the Quran) — it is a prayer, a praise, and a complete worldview in seven verses.`,[m
[31m-[m
[31m-    tawakkul: `<strong style="color:var(--accent-light)">Tawakkul</strong> (تَوَكُّل) is the Islamic concept of placing complete trust and reliance upon Allah ﷻ, while fulfilling one's own responsibilities with full effort.<br><br>It is beautifully illustrated in the hadith where a man asked the Prophet ﷺ whether he should tie his camel or leave it and trust Allah. The Prophet ﷺ replied: <em>"Tie your camel, then put your trust in Allah."</em><br><br><strong style="color:var(--text-primary);font-weight:500">How to practice Tawakkul:</strong><br>• Do your best in all affairs — it is not passivity<br>• Make sincere du'a and rely on Allah for the outcome<br>• Accept Allah's decree (qadar) with contentment<br>• Remember that Allah's plan is better than ours<br><br>Tawakkul is the believer's anchor — it brings peace in uncertainty, strength in hardship, and gratitude in blessing.`,[m
[31m-[m
[31m-    seerah: `The <strong style="color:var(--accent-light)">Seerah</strong> (السيرة النبوية) is the biography of the Prophet Muhammad ﷺ, the most complete account of any human life in history.<br><br><strong style="color:var(--text-primary);font-weight:500">Key chapters of his blessed life:</strong><br><br><strong>Birth & Early Life</strong> — Born in Makkah in 570 CE, orphaned young, raised by his grandfather and uncle Abu Talib. Known as <em>Al-Amin</em> — the Trustworthy.<br><br><strong>Prophethood</strong> — At 40, he received the first revelation in the Cave of Hira. He spent 13 years in Makkah calling people to Allah, facing persecution with patience.<br><br><strong>The Hijra</strong> — The migration to Madinah in 622 CE, which marks the beginning of the Islamic calendar — a turning point in history.<br><br><strong>Madinah & Legacy</strong> — He built a community based on justice, mercy, and brotherhood. At his passing in 632 CE, the entire Arabian Peninsula had embraced Islam.<br><br>The Seerah is our greatest practical guide — a living model of how to be human.`,[m
[31m-[m
[31m-    hadith: `The <strong style="color:var(--accent-light)">Hadith of Niyyah</strong> (Hadith of Intentions) is the first hadith in Imam Bukhari's and Imam Muslim's collections, considered one of the foundational principles of Islam.<br><br><em style="color:var(--text-muted);font-style:italic">"Actions are judged by intentions, and every person will get what they intended. Whoever migrates for the sake of Allah and His Messenger, his migration will be to Allah and His Messenger. Whoever migrates for worldly gain or to marry a woman, his migration is to whatever he migrated for."</em><br><strong style="font-size:13px;color:var(--text-dim)">— Prophet Muhammad ﷺ (Bukhari & Muslim)</strong><br><br><strong style="color:var(--text-primary);font-weight:500">Lessons:</strong><br>• The heart's intention transforms an ordinary act into worship<br>• Sincerity (ikhlas) is the soul of every deed<br>• The same action performed for different reasons yields different rewards<br>• We are accountable for what we truly intend, not just what we appear to do<br><br>Scholars say this single hadith encompasses one-third of the entire religion.`[m
[31m-  };[m
[31m-[m
[31m-  async function generateResponse(text) {[m
[31m-    const response = await fetch("/ask", {[m
[31m-      method: "POST",[m
[31m-      headers: { "Content-Type": "application/json" },[m
[31m-      body: JSON.stringify({ question: text })[m
[31m-    });[m
[31m-    const data = await response.json();[m
[31m-    return data.answer;[m
[31m-  }[m
[31m-</script>[m
[31m-</body>[m
[31m-</html>[m
\ No newline at end of file[m
[32m+[m[32m  </body>[m
[32m+[m[32m</html>[m
