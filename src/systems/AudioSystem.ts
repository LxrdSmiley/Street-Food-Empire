import type { AudioEventName } from '../types/gameTypes';

interface ToneStep {
  frequency: number;
  durationMs: number;
  type?: OscillatorType;
  delayMs?: number;
}

const EVENT_TONES: Record<AudioEventName, ToneStep[]> = {
  button_tap: [{ frequency: 520, durationMs: 42, type: 'sine' }],
  food_prep_start: [{ frequency: 220, durationMs: 80, type: 'triangle' }],
  food_ready: [
    { frequency: 520, durationMs: 60, type: 'sine' },
    { frequency: 720, durationMs: 70, type: 'sine', delayMs: 55 },
  ],
  serve_success: [
    { frequency: 440, durationMs: 55, type: 'triangle' },
    { frequency: 660, durationMs: 75, type: 'triangle', delayMs: 50 },
  ],
  coin_gain: [
    { frequency: 760, durationMs: 38, type: 'sine' },
    { frequency: 980, durationMs: 46, type: 'sine', delayMs: 36 },
  ],
  upgrade_bought: [
    { frequency: 360, durationMs: 70, type: 'triangle' },
    { frequency: 540, durationMs: 70, type: 'triangle', delayMs: 62 },
    { frequency: 720, durationMs: 90, type: 'triangle', delayMs: 124 },
  ],
  level_up: [
    { frequency: 520, durationMs: 70, type: 'sine' },
    { frequency: 660, durationMs: 70, type: 'sine', delayMs: 65 },
    { frequency: 880, durationMs: 110, type: 'sine', delayMs: 130 },
  ],
  rush_start: [
    { frequency: 300, durationMs: 80, type: 'sawtooth' },
    { frequency: 450, durationMs: 90, type: 'sawtooth', delayMs: 78 },
  ],
  rush_end: [
    { frequency: 440, durationMs: 80, type: 'triangle' },
    { frequency: 260, durationMs: 120, type: 'triangle', delayMs: 80 },
  ],
};

export class AudioSystem {
  private audioContext?: AudioContext;
  private unlocked = false;
  private soundEnabled: boolean;

  constructor(soundEnabled: boolean) {
    this.soundEnabled = soundEnabled;
  }

  setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  isEnabled(): boolean {
    return this.soundEnabled;
  }

  unlock(): void {
    const AudioContextConstructor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContextConstructor();
    }

    if (this.audioContext.state === 'suspended') {
      void this.audioContext.resume();
    }

    this.unlocked = true;
  }

  play(eventName: AudioEventName): void {
    if (!this.soundEnabled || !this.unlocked || !this.audioContext) {
      return;
    }

    const steps = EVENT_TONES[eventName];
    const now = this.audioContext.currentTime;

    steps.forEach((step) => {
      this.playTone(step, now);
    });
  }

  private playTone(step: ToneStep, baseTime: number): void {
    if (!this.audioContext) {
      return;
    }

    const startTime = baseTime + (step.delayMs ?? 0) / 1000;
    const durationSeconds = step.durationMs / 1000;
    const endTime = startTime + durationSeconds;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = step.type ?? 'sine';
    oscillator.frequency.setValueAtTime(step.frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.045, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime + 0.01);
  }
}
