import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, AlertTriangle, CheckCircle, Camera, Shield, Terminal, Wifi, Zap } from 'lucide-react';

export default function SecureHackerDoor() {
  const [key, setKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [scanning, setScanning] = useState(true);
  const [doorOpen, setDoorOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  const [systemStatus, setSystemStatus] = useState('ACTIVE');
  
  // 🔐 MASTER KEY (Encrypted) - Change this to set your password
  const encryptedKey = 'MTEyMjM='; // Base64 of '11223'
  
  // 🔐 Secret Salt for additional security
  const secretSalt = 'X9#mK$pL2@qR';
  
  // 🔐 Decrypt function
  const decryptKey = (encrypted) => {
    try {
      return atob(encrypted);
    } catch {
      return null;
    }
  };
  
  // 🔐 XOR Encryption
  const xorEncrypt = (input, secretKey) => {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(input.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length));
    }
    return btoa(result);
  };
  
  // 🔐 Hash function for secure comparison
  const hashInput = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  };
  
  const correctKey = decryptKey(encryptedKey);
  
  // 🔐 Generate unique device fingerprint
  useEffect(() => {
    const generateFingerprint = () => {
      const nav = window.navigator;
      const screen = window.screen;
      const data = [
        nav.userAgent,
        nav.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage
      ].join('###');
      
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36).toUpperCase();
    };
    
    setDeviceFingerprint(generateFingerprint());
  }, []);
  
  // 🔐 Anti-debugging and security measures
  useEffect(() => {
    // Detect DevTools
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || 
          window.outerHeight - window.innerHeight > threshold) {
        console.clear();
        setIsLocked(true);
        setLockTimer(300);
        setSystemStatus('COMPROMISED');
      }
    };
    
    const devToolsInterval = setInterval(detectDevTools, 1000);
    
    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      setAttempts(prev => prev + 1);
      setSystemStatus('SUSPICIOUS');
      return false;
    };
    
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const handleKeyDown = (e) => {
      if (e.keyCode === 123 || 
          (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
          (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        setAttempts(prev => prev + 1);
        setSystemStatus('SUSPICIOUS');
        return false;
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearInterval(devToolsInterval);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // 🔐 Lockout timer countdown
  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLocked(false);
      if (systemStatus === 'COMPROMISED') {
        setSystemStatus('ACTIVE');
      }
    }
  }, [lockTimer, systemStatus]);
  
  // 🔐 Auto-lock after 5 failed attempts
  useEffect(() => {
    if (attempts >= 5 && !isLocked) {
      setIsLocked(true);
      setLockTimer(60);
      setSystemStatus('LOCKED');
    }
  }, [attempts, isLocked]);

  // Initialize system
  useEffect(() => {
    const scanTimer = setTimeout(() => setScanning(false), 2000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // 🔐 Clear console periodically
    const consoleClear = setInterval(() => {
      console.clear();
    }, 3000);
    
    // 🔐 Disable console methods
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
    
    return () => {
      clearTimeout(scanTimer);
      clearInterval(timeInterval);
      clearInterval(consoleClear);
    };
  }, []);

  // 🔐 Open Screen 2 with encrypted token
  const openScreen2 = () => {
    const secureToken = xorEncrypt(`UNLOCK_${Date.now()}_${deviceFingerprint}`, secretSalt);
    
    // For Kodular WebView
    if (window.AppInventor) {
      window.AppInventor.setWebViewString(secureToken);
    }
    
    // PostMessage for communication
    if (window.parent) {
      window.parent.postMessage({ 
        action: 'openScreen2', 
        status: 'unlocked',
        token: secureToken,
        fingerprint: deviceFingerprint,
        timestamp: Date.now()
      }, '*');
    }
  };

  // 🔐 Handle unlock attempt
  const handleSubmit = () => {
    if (isLocked) {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 500);
      return;
    }
    
    // Rate limiting
    const now = Date.now();
    const lastAttempt = parseInt(window.lastAttemptTime || '0');
    if (now - lastAttempt < 2000) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 1000);
      return;
    }
    window.lastAttemptTime = now.toString();
    
    // Hash comparison for security
    const inputHash = hashInput(key + secretSalt);
    const correctHash = hashInput(correctKey + secretSalt);
    
    if (inputHash === correctHash) {
      setIsUnlocked(true);
      setShowWarning(false);
      setAttempts(0);
      setSystemStatus('ACCESS GRANTED');
      
      setTimeout(() => {
        setDoorOpen(true);
        setTimeout(() => {
          openScreen2();
        }, 1500);
      }, 800);
    } else {
      setGlitchEffect(true);
      setShowWarning(true);
      setAttempts(prev => prev + 1);
      setKey('');
      setSystemStatus('ACCESS DENIED');
      
      // Log failed attempt
      const failedAttempts = JSON.parse(window.failedLog || '[]');
      failedAttempts.push({
        time: now,
        fingerprint: deviceFingerprint
      });
      window.failedLog = JSON.stringify(failedAttempts);
      
      setTimeout(() => {
        setShowWarning(false);
        setGlitchEffect(false);
        setSystemStatus('ACTIVE');
      }, 2500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && key.length > 0 && !isLocked) {
      handleSubmit();
    }
  };
  
  // 🔐 Prevent copy-paste
  const handlePaste = (e) => {
    e.preventDefault();
    setAttempts(prev => prev + 1);
    return false;
  };
  
  const handleCopy = (e) => {
    e.preventDefault();
    return false;
  };

  // Success screen
  if (doorOpen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-full h-1 bg-green-500 animate-pulse" style={{
            top: '30%',
            boxShadow: '0 0 20px #22c55e'
          }} />
          <div className="absolute w-full h-1 bg-green-500 animate-pulse" style={{
            top: '70%',
            boxShadow: '0 0 20px #22c55e',
            animationDelay: '0.3s'
          }} />
        </div>
        
        <div className="text-center z-10">
          <Shield className="w-32 h-32 text-green-500 mx-auto mb-6 animate-pulse" style={{
            filter: 'drop-shadow(0 0 30px #22c55e)'
          }} />
          <h1 className="text-6xl font-bold text-green-500 font-mono mb-4 animate-pulse">
            ACCESS GRANTED
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-green-400 font-mono">SECURITY CLEARANCE: MAXIMUM</p>
          </div>
          <p className="text-green-300 font-mono text-sm mb-2">Initiating secure connection...</p>
          <p className="text-green-600 font-mono text-xs">DEVICE ID: {deviceFingerprint}</p>
          
          <div className="w-80 h-2 bg-gray-800 rounded-full mx-auto mt-8 overflow-hidden">
            <div className="h-full bg-green-500" style={{
              width: '100%',
              animation: 'loading 1.5s ease-in-out'
            }} />
          </div>
          
          <div className="mt-8 text-green-500 font-mono text-sm animate-pulse">
            ▓▓▓▓▓▓▓▓▓▓ TRANSFERRING TO SECURE AREA ▓▓▓▓▓▓▓▓▓▓
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 overflow-hidden relative select-none ${glitchEffect ? 'animate-pulse' : ''}`}
         onCopy={handleCopy}
         onCut={handleCopy}>
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'grid 20s linear infinite'
        }} />
      </div>

      {/* Matrix falling code */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500 font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 100}px`,
              animation: `fall ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Math.random().toString(2).substring(2, 10)}
          </div>
        ))}
      </div>

      {/* Top system bar */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-90 border-b-2 border-cyan-500 p-3 z-40">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Terminal className="w-5 h-5 text-cyan-500 animate-pulse" />
            <span className="text-cyan-500 font-mono text-sm font-bold">SECURITY SYSTEM v2.5.1</span>
            <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="text-gray-600 font-mono text-xs">DEVICE:{deviceFingerprint.substring(0, 8)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-mono text-xs font-bold ${
              systemStatus === 'ACTIVE' ? 'text-green-500' :
              systemStatus === 'ACCESS GRANTED' ? 'text-green-400' :
              systemStatus === 'ACCESS DENIED' ? 'text-red-500' :
              systemStatus === 'LOCKED' ? 'text-orange-500' :
              systemStatus === 'SUSPICIOUS' ? 'text-yellow-500' :
              'text-red-600'
            }`}>
              ● {systemStatus}
            </span>
            <div className="text-cyan-500 font-mono text-sm">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>
        </div>
      </div>

      {/* CCTV Camera */}
      <div className="absolute top-20 right-8 bg-black bg-opacity-90 border-2 border-red-500 rounded-lg p-3 shadow-2xl z-40" style={{
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)'
      }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Camera className={`w-8 h-8 ${scanning ? 'text-red-500' : 'text-green-500'}`} />
            {scanning && (
              <div className="absolute inset-0 border-2 border-red-500 rounded animate-ping" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-mono font-bold">CCTV-ALPHA-01</span>
            <span className={`text-xs font-mono font-bold ${scanning ? 'text-red-500' : 'text-green-500'}`}>
              {scanning ? '● SCANNING...' : '● RECORDING'}
            </span>
            <span className="text-xs text-gray-600 font-mono">LIVE FEED</span>
          </div>
        </div>
      </div>

      {/* Security log */}
      <div className="absolute top-20 left-8 bg-black bg-opacity-90 border-2 border-orange-500 rounded-lg p-3 shadow-2xl z-40" style={{
        boxShadow: '0 0 30px rgba(249, 115, 22, 0.5)'
      }}>
        <div className="text-orange-500 font-mono text-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-bold">SECURITY LOG</span>
          </div>
          <div className="text-xs mb-1">
            FAILED: <span className="text-red-500 font-bold text-lg">{attempts}</span><span className="text-gray-500">/5</span>
          </div>
          {attempts >= 3 && attempts < 5 && (
            <div className="text-xs text-red-500 animate-pulse font-bold bg-red-950 px-2 py-1 rounded mt-2">
              🚨 HIGH ALERT
            </div>
          )}
          {isLocked && (
            <div className="text-xs text-red-600 animate-bounce font-bold bg-red-950 px-2 py-1 rounded mt-2">
              🔒 LOCKDOWN: {lockTimer}s
            </div>
          )}
        </div>
      </div>

      {/* Warning overlay */}
      {(showWarning || isLocked) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center" style={{
          background: 'repeating-linear-gradient(45deg, rgba(153, 27, 27, 0.4), rgba(153, 27, 27, 0.4) 10px, rgba(185, 28, 28, 0.4) 10px, rgba(185, 28, 28, 0.4) 20px)',
          animation: 'flash 0.5s infinite'
        }}>
          <div className="bg-black border-4 border-red-600 p-12 rounded-xl shadow-2xl transform scale-110" style={{
            boxShadow: '0 0 60px rgba(220, 38, 38, 0.9)'
          }}>
            <AlertTriangle className="w-28 h-28 text-red-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-5xl font-bold text-red-500 font-mono text-center mb-4" style={{
              textShadow: '0 0 30px rgba(239, 68, 68, 0.9)'
            }}>
              {isLocked ? '🔒 SYSTEM LOCKED' : '⚠️ ACCESS DENIED'}
            </h2>
            <p className="text-red-400 font-mono text-center text-xl mb-3">
              {isLocked ? `LOCKDOWN: ${lockTimer} SECONDS` : 'INVALID SECURITY KEY'}
            </p>
            <p className="text-orange-500 font-mono text-center text-base mb-6">
              {isLocked ? 'MAXIMUM ATTEMPTS EXCEEDED' : 'UNAUTHORIZED ACCESS ATTEMPT'}
            </p>
            <div className="text-center">
              <div className="text-red-500 font-mono text-lg animate-pulse font-bold bg-black bg-opacity-70 p-3 rounded-lg border-2 border-red-500">
                🚨 INTRUSION ALERT 🚨
              </div>
              <div className="text-gray-400 font-mono text-xs mt-4">
                ALL ATTEMPTS ARE BEING LOGGED
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main door */}
      <div className="relative z-30">
        <div className={`transition-all duration-1000 ${isUnlocked ? 'scale-110' : 'scale-100'}`}>
          
          <div className={`relative w-[440px] h-[680px] bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-xl border-4 transition-all duration-500 ${
            isUnlocked ? 'border-green-500 shadow-green-500/50' : 
            showWarning || isLocked ? 'border-red-500 shadow-red-500/50' : 
            'border-gray-600 shadow-gray-600/30'
          } shadow-2xl`} style={{
            boxShadow: isUnlocked ? '0 0 70px rgba(34, 197, 94, 0.6)' : 
                       (showWarning || isLocked) ? '0 0 70px rgba(239, 68, 68, 0.6)' : 
                       '0 25px 70px rgba(0, 0, 0, 0.9)'
          }}>
            
            {/* Door panels */}
            <div className="absolute inset-4 flex gap-3">
              {/* Left door */}
              <div className={`flex-1 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg border-2 border-gray-600 transition-all duration-1000 origin-left ${
                isUnlocked ? '-translate-x-full opacity-0' : ''
              }`} style={{
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.6)'
              }}>
                <div className="h-full flex flex-col justify-center items-center p-6">
                  <div className="w-full space-y-6">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-full h-3 bg-gray-900 rounded shadow-inner" />
                    ))}
                  </div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800 rounded-full border-2 border-gray-700 shadow-lg" />
                </div>
              </div>

              {/* Right door */}
              <div className={`flex-1 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg border-2 border-gray-600 transition-all duration-1000 origin-right ${
                isUnlocked ? 'translate-x-full opacity-0' : ''
              }`} style={{
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.6)'
              }}>
                <div className="h-full flex flex-col justify-center items-center p-6">
                  <div className="w-full space-y-6">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-full h-3 bg-gray-900 rounded shadow-inner" />
                    ))}
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-800 rounded-full border-2 border-gray-700 shadow-lg" />
                </div>
              </div>
            </div>

            {/* Security panel */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-black bg-opacity-95 p-10 rounded-xl border-2 border-cyan-500 shadow-2xl backdrop-blur-sm w-full max-w-sm" style={{
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.5)'
              }}>
                
                {/* Lock icon */}
                <div className="text-center mb-8">
                  {isUnlocked ? (
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-pulse" style={{
                      filter: 'drop-shadow(0 0 25px #22c55e)'
                    }} />
                  ) : (
                    <Lock className={`w-24 h-24 mx-auto transition-all duration-300 ${
                      showWarning || isLocked ? 'text-red-500' : 'text-cyan-500'
                    }`} style={{
                      filter: (showWarning || isLocked) ? 'drop-shadow(0 0 25px #ef4444)' : 'drop-shadow(0 0 25px #06b6d4)'
                    }} />
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-cyan-500 text-center mb-3 font-mon
