import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Pause, RotateCcw, PawPrint, Home } from 'lucide-react';

const ZenApp = () => {
  const [sessionLength, setSessionLength] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [totalSessionTime, setTotalSessionTime] = useState(sessionLength * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Load saved sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zenSessions');
    if (saved) setSessionsCompleted(parseInt(saved));
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      localStorage.setItem('zenSessions', newSessions.toString());
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionsCompleted]);

  // Breathing animation
  useEffect(() => {
    if (isRunning) {
      const breathInterval = setInterval(() => {
        setBreathPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
      }, 4000);
      return () => clearInterval(breathInterval);
    }
  }, [isRunning]);

  const handleSessionChange = (length: number) => {
    setSessionLength(length);
    const seconds = length * 60;
    setTimeLeft(seconds);
    setTotalSessionTime(seconds);
    setIsRunning(false);
    setIsCustomMode(false);
  };

  const handleCustomTime = () => {
    const mins = parseInt(customMinutes) || 0;
    const secs = parseInt(customSeconds) || 0;
    const totalSeconds = mins * 60 + secs;

    if (totalSeconds > 0) {
      setSessionLength(Math.ceil(totalSeconds / 60));
      setTimeLeft(totalSeconds);
      setTotalSessionTime(totalSeconds);
      setIsRunning(false);
      setIsCustomMode(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalSessionTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSessionTime - timeLeft) / totalSessionTime) * 100;

  return (
    <div className="from-primary/5 via-background to-secondary/5 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br p-6">
      {/* Animated background orbs */}
      <div className="bg-primary/10 absolute top-[-20%] right-[-10%] h-80 w-80 rounded-full blur-3xl" />
      <div className="bg-accent/10 absolute bottom-[-10%] left-[-5%] h-64 w-64 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center gap-2"
      >
        <PawPrint className="text-primary h-6 w-6" />
        <span className="font-heading text-foreground text-xl font-bold">
          Purrfectly Zen
        </span>
      </motion.div>

      {/* Weekly Challenge Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="from-accent/50 to-primary/20 border-primary/30 mb-6 rounded-full border bg-gradient-to-r px-6 py-3 shadow-lg"
        data-testid="banner-weekly-challenge"
      >
        <p className="text-foreground text-center text-sm font-bold">
          🏆 This Week: Meditate 7 Days Straight!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/95 overflow-hidden rounded-[2rem] border-none shadow-lg backdrop-blur-xl transition-shadow hover:shadow-xl">
          <div className="flex flex-col items-center gap-8 p-12">
            {/* Title */}
            <div className="space-y-2 text-center">
              <h1 className="font-heading text-foreground text-4xl font-bold">
                Zen Time
              </h1>
              <p className="text-muted-foreground">
                Meditate with your inner cat
              </p>
            </div>

            {/* Breathing Circle Animation */}
            <div className="relative flex h-48 w-48 items-center justify-center">
              <motion.div
                className="border-primary/20 absolute h-full w-full rounded-full border-8"
                animate={{
                  scale: breathPhase === 'inhale' ? 1 : 0.8,
                  opacity: breathPhase === 'inhale' ? 0.3 : 0.1,
                }}
                transition={{ duration: 4 }}
              />
              <motion.div
                className="bg-primary/30 absolute h-32 w-32 rounded-full blur-lg"
                animate={{
                  scale: breathPhase === 'inhale' ? 1 : 0.6,
                }}
                transition={{ duration: 4 }}
              />
              <div className="relative z-10 text-center">
                <div className="font-heading text-primary text-5xl font-bold">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-muted-foreground font-hand mt-2 text-sm">
                  {isRunning &&
                    (breathPhase === 'inhale'
                      ? 'Breathe in... notice the calm'
                      : 'Breathe out... release the tension')}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className="bg-secondary/30 h-2 overflow-hidden rounded-full">
                <motion.div
                  className="from-primary to-accent h-full bg-gradient-to-r"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="text-muted-foreground text-center text-xs">
                {Math.round(progress)}% complete
              </div>
            </div>

            {/* Session Length Selector */}
            <div className="w-full space-y-3">
              <div className="grid w-full grid-cols-3 gap-2">
                {[1, 5, 10].map((length) => (
                  <motion.button
                    key={length}
                    onClick={() => handleSessionChange(length)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`button-session-${length}`}
                    className={`rounded-xl px-3 py-2 font-bold transition-all ${
                      sessionLength === length && !isCustomMode
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {length}m
                  </motion.button>
                ))}
              </div>

              {/* Custom Time Input */}
              <div className="bg-secondary/20 space-y-3 rounded-xl p-4">
                <p className="text-muted-foreground text-center text-xs font-medium">
                  Custom Duration
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    placeholder="Min"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    data-testid="input-custom-minutes"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/50 flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="Sec"
                    value={customSeconds}
                    onChange={(e) => setCustomSeconds(e.target.value)}
                    data-testid="input-custom-seconds"
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/50 flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>
                <motion.button
                  onClick={handleCustomTime}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="button-set-custom"
                  className={`w-full rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                    isCustomMode && (customMinutes || customSeconds)
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card hover:bg-card/80 text-foreground'
                  }`}
                >
                  Set Custom
                </motion.button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex w-full justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  data-testid="button-toggle-session"
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-full px-6 py-3 shadow-lg"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start
                    </>
                  )}
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  data-testid="button-reset-session"
                  onClick={handleReset}
                  className="border-primary text-primary hover:bg-primary/10 rounded-full border-2 px-6 py-3 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="border-border/40 w-full border-t pt-6">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Heart className="h-5 w-5 fill-current text-red-400" />
                  <span className="font-heading text-foreground font-bold">
                    {sessionsCompleted} sessions completed
                  </span>
                </motion.div>
                <p className="text-muted-foreground mt-2 text-xs">
                  {timeLeft === 0
                    ? 'You did it. You showed up for yourself. 🐱'
                    : 'Like a cat stretching, let your body relax. 🐱'}
                </p>
              </div>
            </div>

            {/* Back Home Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <a href="/">
                <button
                  data-testid="button-back-home"
                  className="border-primary text-primary hover:bg-primary/10 flex w-full items-center justify-center gap-2 rounded-full border-2 px-6 py-2 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </button>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Decorative footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-muted-foreground font-hand mt-8 text-center text-sm"
      >
        Find your zen. One breath at a time. 🐱✨
      </motion.div>
    </div>
  );
};

export default ZenApp;
