"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AuthGate from "./AuthGate";
import BlockPicker from "./BlockPicker";
import CalendarView from "./CalendarView";
import CommandNav from "./CommandNav";
import DiaryView from "./DiaryView";
import Hud from "./Hud";
import ScheduleView from "./ScheduleView";
import StatusView from "./StatusView";
import TodayPanel from "./TodayPanel";
import { cloudEnabled, sb } from "@/lib/supabaseClient";
import { loadLocal, saveLocal, sanitizeRemote } from "@/lib/storage";
import {
  applySetDay,
  buildMonths,
  currentBlock,
  compute,
  diaryEntries,
  emptyState,
  keyOf,
  marks,
  plannedActivity,
} from "@/lib/gameLogic";

export default function App() {
  // "today", the rolling 12-month window and the locally cached game state
  // are all resolved together, in one state slot set once on mount — so the
  // server-rendered shell never depends on Date.now()/localStorage, and the
  // boot is a single state transition rather than several in one effect.
  const [boot, setBoot] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const [view, setView] = useState("sched");
  // months[0] is always the current month by construction (buildMonths starts
  // from "today"), so both month indices always start at 0.
  const [mIdx, setMIdx] = useState(0);
  const [calIdx, setCalIdx] = useState(0);
  const [calDayOverride, setCalDayOverride] = useState(null);
  const [masteryFilter, setMasteryFilter] = useState("all");
  const [selectedMastery, setSelectedMastery] = useState("");
  const [diarySpread, setDiarySpread] = useState(0);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.matchMedia("(max-width:690px)").matches : false));
  const [openKey, setOpenKey] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const remoteSaveTimer = useRef(null);
  const gameStateRef = useRef(null);
  useEffect(() => {
    gameStateRef.current = boot?.gameState ?? null;
  }, [boot]);

  useEffect(() => {
    const t = new Date();
    // Only way to read Date.now()/localStorage without a server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBoot({ today: t, months: buildMonths(t), gameState: loadLocal() });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width:690px)");
    function update() {
      setIsMobile(mq.matches);
      setDiarySpread(0);
    }
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  function queueRemoteSave(uid, nextState) {
    if (!cloudEnabled || !uid) return;
    clearTimeout(remoteSaveTimer.current);
    remoteSaveTimer.current = setTimeout(async () => {
      try {
        await sb.from("game_state").upsert({ user_id: uid, data: nextState, updated_at: new Date().toISOString() });
      } catch (e) {
        console.error("Cloud sync failed, will retry on next change", e);
      }
    }, 1000);
  }

  function persist(nextState) {
    setBoot((prev) => ({ ...prev, gameState: nextState }));
    saveLocal(nextState);
    queueRemoteSave(currentUserId, nextState);
  }

  async function loadRemote(uid) {
    if (!cloudEnabled) return;
    try {
      const { data, error } = await sb.from("game_state").select("data").eq("user_id", uid).maybeSingle();
      if (error) throw error;
      const clean = data && data.data ? sanitizeRemote(data.data) : null;
      if (clean) {
        setBoot((prev) => ({ ...prev, gameState: clean }));
      } else {
        const current = gameStateRef.current;
        if (current && (Object.keys(current.plan).length || Object.keys(current.days).length)) {
          queueRemoteSave(uid, current); // first sign-in on this device: push existing local progress to the cloud
        }
      }
    } catch (e) {
      console.error("Could not reach Supabase, showing the local copy", e);
    }
  }

  useEffect(() => {
    if (!cloudEnabled) return;
    const { data: listener } = sb.auth.onAuthStateChange((event, session) => {
      if (session) {
        setCurrentUserId(session.user.id);
        loadRemote(session.user.id);
      } else {
        setCurrentUserId(null);
      }
    });
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = boot?.today ?? null;
  const months = boot?.months ?? null;
  const gameState = boot?.gameState ?? null;

  const c = useMemo(() => {
    if (!gameState || !months || !today) return null;
    return compute(gameState, months, today);
  }, [gameState, months, today]);

  const cb = useMemo(() => (today ? currentBlock(today) : null), [today]);
  const calDay = calDayOverride ?? (today ? today.getDate() : 1);

  function handleSetDay(k, idx, v) {
    const { state: nextState, lastResult: lr, changed } = applySetDay(gameState, months, today, k, idx, v);
    if (!changed) return;
    setLastResult(lr);
    persist(nextState);
  }

  function handleVerdict(v) {
    const cur = marks(gameState, cb.k)[cb.idx] || 0;
    handleSetDay(cb.k, cb.idx, cur === v ? 0 : v);
  }

  function openPick(k) {
    setLastResult(null);
    setOpenKey(k);
  }
  function closePick() {
    setLastResult(null);
    setOpenKey(null);
  }

  function handleChooseActivity(key, id) {
    setLastResult(null);
    persist({ ...gameState, plan: { ...gameState.plan, [key]: id } });
  }

  function handleClearBlock(key) {
    const nextPlan = { ...gameState.plan };
    delete nextPlan[key];
    const nextDays = { ...gameState.days };
    delete nextDays[key];
    setLastResult(null);
    persist({ plan: nextPlan, days: nextDays });
    closePick();
  }

  function handleResetConfirmed() {
    setLastResult(null);
    persist(emptyState());
  }

  function handleSignOut() {
    sb?.auth.signOut();
  }

  function onPrevMonth() {
    if (mIdx > 0) {
      setLastResult(null);
      setMIdx(mIdx - 1);
    }
  }
  function onNextMonth() {
    if (mIdx < months.length - 1) {
      setLastResult(null);
      setMIdx(mIdx + 1);
    }
  }

  function onPrevCalMonth() {
    if (calIdx > 0) {
      const next = calIdx - 1;
      setCalIdx(next);
      setCalDayOverride(next === 0 ? today.getDate() : 1);
    }
  }
  function onNextCalMonth() {
    if (calIdx < months.length - 1) {
      setCalIdx(calIdx + 1);
      setCalDayOverride(1);
    }
  }
  function onEditCalBlock() {
    const { y, m } = months[calIdx];
    const i = calDay <= 10 ? 0 : calDay <= 20 ? 1 : 2;
    openPick(keyOf(y, m, i));
  }

  function onFilterChange(filter) {
    setMasteryFilter(filter);
    setSelectedMastery("");
  }

  if (!gameState || !months || !c || !cb) return null;

  const todayActivity = plannedActivity(gameState, cb.k);
  const todayValue = marks(gameState, cb.k)[cb.idx] || 0;

  return (
    <>
      <div className="wrap">
        <Hud today={today} cb={cb} gold={c.gold} stress={c.stress} />
        <TodayPanel
          activity={todayActivity}
          value={todayValue}
          cb={cb}
          lastResult={lastResult}
          onVerdict={handleVerdict}
          onPlanNow={() => openPick(cb.k)}
        />
        <CommandNav view={view} onChange={setView} />
        <ScheduleView
          hidden={view !== "sched"}
          y={months[mIdx].y}
          m={months[mIdx].m}
          mIdx={mIdx}
          monthsLength={months.length}
          state={gameState}
          today={today}
          blocks={c.blocks}
          onPrev={onPrevMonth}
          onNext={onNextMonth}
          onOpenSlot={openPick}
        />
        <StatusView
          hidden={view !== "status"}
          c={c}
          masteryFilter={masteryFilter}
          selectedMastery={selectedMastery}
          onFilterChange={onFilterChange}
          onSelectMastery={setSelectedMastery}
        />
        <CalendarView
          hidden={view !== "cal"}
          y={months[calIdx].y}
          m={months[calIdx].m}
          calIdx={calIdx}
          monthsLength={months.length}
          calDay={calDay}
          state={gameState}
          today={today}
          onPrev={onPrevCalMonth}
          onNext={onNextCalMonth}
          onSelectDay={setCalDayOverride}
          onEditBlock={onEditCalBlock}
        />
        <DiaryView
          hidden={view !== "log"}
          entries={diaryEntries(gameState, months, today)}
          isMobile={isMobile}
          diarySpread={diarySpread}
          onChangeSpread={setDiarySpread}
          cloudEnabled={cloudEnabled}
          onResetConfirmed={handleResetConfirmed}
          onSignOut={handleSignOut}
        />
      </div>

      {openKey && (
        <BlockPicker
          key={openKey}
          openKey={openKey}
          state={gameState}
          c={c}
          today={today}
          lastResult={lastResult}
          onClose={closePick}
          onSetDay={handleSetDay}
          onChooseActivity={handleChooseActivity}
          onClearBlock={handleClearBlock}
        />
      )}

      {cloudEnabled && !currentUserId && <AuthGate />}
    </>
  );
}
