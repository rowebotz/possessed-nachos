const VOICE_KEY = 'cq:voice-enabled';

export function isVoiceEnabled() {
  const v = localStorage.getItem(VOICE_KEY);
  return v === null ? true : v === '1';
}

export function toggleVoiceEnabled() {
  const next = isVoiceEnabled() ? '0' : '1';
  localStorage.setItem(VOICE_KEY, next);
}

export function initVoice() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.getVoices();
}

export function speakText(text) {
  if (!isVoiceEnabled()) return;
  if (!('speechSynthesis' in window)) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.05;
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  } catch {}
}