export function speak(text: string, opts?: { rate?: number; pitch?: number; lang?: string }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = opts?.rate ?? 1.0;
  utter.pitch = opts?.pitch ?? 1.0;
  utter.lang = opts?.lang ?? 'en-US';
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith('en') && /female|english/i.test(v.name)) || voices[0];
  if (preferred) utter.voice = preferred;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export function preloadVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve();
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length > 0) return resolve();
    const handler = () => {
      synth.getVoices();
      resolve();
      synth.removeEventListener('voiceschanged', handler);
    };
    synth.addEventListener('voiceschanged', handler);
  });
}