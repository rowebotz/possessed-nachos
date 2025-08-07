export function speak(text) {
  try {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
      return true;
    }
  } catch {}
  try { new Audio('/assets/beep.mp3').play(); } catch {}
  return false;
}