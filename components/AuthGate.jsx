"use client";

import { useState } from "react";
import { sb } from "@/lib/supabaseClient";

export default function AuthGate() {
  const [step, setStep] = useState("email"); // "email" | "code"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  async function handleSendCode(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("Sending your code...");
    const { error } = await sb.auth.signInWithOtp({ email: trimmed, options: { emailRedirectTo: window.location.href } });
    if (error) {
      setStatus("Something went wrong — wait a minute and try again.");
      return;
    }
    setEmail(trimmed);
    setStep("code");
    setStatus("Enter the 6-digit code from your email.");
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    const token = code.trim();
    if (!token || !email) return;
    setStatus("Checking...");
    const { error } = await sb.auth.verifyOtp({ email, token, type: "email" });
    if (error) setStatus("That code didn't work — check it and try again.");
  }

  return (
    <>
      <div className="backdrop" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <div className="win">
          <span className="plate">Sign in</span>
          <div className="mh">
            <div>
              <h2 id="authTitle">Welcome back</h2>
              <p>Sign in to sync your progress across your phone and the web.</p>
            </div>
          </div>
          {step === "email" ? (
            <form onSubmit={handleSendCode}>
              <input
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn" type="submit">
                Send code
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                placeholder="6-digit code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button className="btn" type="submit">
                Verify code
              </button>
            </form>
          )}
          <p className="hint">{status}</p>
        </div>
      </div>
    </>
  );
}
