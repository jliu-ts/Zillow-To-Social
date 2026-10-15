/**
 * Web Audio API procedural music synthesizer for Real Estate Reels
 * Zero external audio files or 404 dependencies
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentTrack = 'luxury-lofi';
  private masterGain: GainNode | null = null;
  private volume = 0.4;

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume() {
    return this.volume;
  }

  public isAudioPlaying() {
    return this.isPlaying;
  }

  public getCurrentTrack() {
    return this.currentTrack;
  }

  public play(trackId: string = 'luxury-lofi') {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.stop();
    this.isPlaying = true;
    this.currentTrack = trackId;

    let step = 0;
    const bpm = trackId === 'upbeat-tech' ? 120 : trackId === 'cinematic-drone' ? 70 : 88;
    const intervalMs = (60 / bpm / 2) * 1000;

    // Chord progressions for luxury vibe
    // E.g. Dbmaj9 -> Bbm9 -> Gbmaj7 -> Ab7sus
    const lofiChords = [
      [277.18, 349.23, 415.30, 523.25], // Dbmaj7
      [233.08, 277.18, 349.23, 440.00], // Bbm9
      [185.00, 233.08, 277.18, 349.23], // Gbmaj7
      [207.65, 277.18, 311.13, 415.30], // Absus
    ];

    const techBass = [130.81, 130.81, 146.83, 164.81, 174.61, 164.81, 146.83, 130.81];

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      if (trackId === 'luxury-lofi') {
        // Play chord swell every 8 steps (bar start)
        if (step % 8 === 0) {
          const chordIndex = Math.floor(step / 8) % lofiChords.length;
          const notes = lofiChords[chordIndex];
          notes.forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            const filter = this.ctx!.createBiquadFilter();

            osc.type = i === 0 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.08, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(now);
            osc.stop(now + 2.0);
          });
        }

        // Soft sub kick on 0 and 4
        if (step % 4 === 0) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(110, now);
          kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
          kickGain.gain.setValueAtTime(0.2, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          kickOsc.connect(kickGain);
          kickGain.connect(this.masterGain);
          kickOsc.start(now);
          kickOsc.stop(now + 0.25);
        }

        // Soft snare brush on 2 and 6
        if (step % 8 === 4) {
          this.playWhiteNoise(now, 0.05, 0.12, 1800);
        }
      } else if (trackId === 'upbeat-tech') {
        // Tech house bass line
        const note = techBass[step % techBass.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(note, now);
        bassGain.gain.setValueAtTime(0.12, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain);
        bassOsc.start(now);
        bassOsc.stop(now + 0.18);

        // Hi hat on offbeats
        if (step % 2 === 1) {
          this.playWhiteNoise(now, 0.03, 0.05, 6000);
        }

        // Kick on every quarter beat
        if (step % 2 === 0) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.frequency.setValueAtTime(140, now);
          kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
          kickGain.gain.setValueAtTime(0.25, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          kickOsc.connect(kickGain);
          kickGain.connect(this.masterGain);
          kickOsc.start(now);
          kickOsc.stop(now + 0.15);
        }
      } else {
        // Cinematic drone
        if (step % 16 === 0) {
          const droneOsc = this.ctx.createOscillator();
          const droneGain = this.ctx.createGain();
          droneOsc.type = 'sine';
          droneOsc.frequency.setValueAtTime(110, now);
          droneGain.gain.setValueAtTime(0.001, now);
          droneGain.gain.linearRampToValueAtTime(0.15, now + 1.5);
          droneGain.gain.linearRampToValueAtTime(0.001, now + 3.8);
          droneOsc.connect(droneGain);
          droneGain.connect(this.masterGain);
          droneOsc.start(now);
          droneOsc.stop(now + 4.0);
        }
      }

      step++;
    }, intervalMs);
  }

  private playWhiteNoise(now: number, duration: number, vol: number, filterFreq: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(trackId?: string) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play(trackId || this.currentTrack);
    }
    return this.isPlaying;
  }
}

export const audioSynth = new AudioSynthesizer();
