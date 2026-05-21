// Web Audio API Ambient Sound Synthesizer for FocusLoop
// 100% offline, zero external assets required.

class AudioSynth {
  constructor() {
    this.audioCtx = null;
    this.currentTrack = null; // 'wind' | 'rain' | 'noise'
    this.isPlaying = false;
    this.volume = 0.5; // 0 to 1

    // Node references
    this.sources = [];
    this.gainNode = null;
    this.lfoNode = null;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Helper to create a buffer of pink noise (better for natural wind/rain than white noise)
  createPinkNoiseBuffer() {
    const bufferSize = 4 * this.audioCtx.sampleRate;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      let pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      data[i] = pink * 0.11; // normalise
    }
    return buffer;
  }

  // Helper to create a buffer of white noise
  createWhiteNoiseBuffer() {
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode) {
      // Smooth volume change to avoid clicks
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  play(track) {
    this.init();
    this.stop(); // Stop any currently playing sound

    this.currentTrack = track;
    this.isPlaying = true;

    // Create main volume gain node
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    this.gainNode.connect(this.audioCtx.destination);

    if (track === 'noise') {
      this.playWhiteNoise();
    } else if (track === 'rain') {
      this.playRain();
    } else if (track === 'wind') {
      this.playForestWind();
    }
  }

  playWhiteNoise() {
    const buffer = this.createWhiteNoiseBuffer();
    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Lowpass filter to make it softer and less harsh
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000; // soft hiss

    source.connect(filter);
    filter.connect(this.gainNode);

    source.start(0);
    this.sources.push(source);
  }

  playRain() {
    // 1. Background rain drone (Filtered pink noise)
    const pinkBuffer = this.createPinkNoiseBuffer();
    const droneSource = this.audioCtx.createBufferSource();
    droneSource.buffer = pinkBuffer;
    droneSource.loop = true;

    const droneFilter = this.audioCtx.createBiquadFilter();
    droneFilter.type = 'bandpass';
    droneFilter.frequency.value = 800; // rain sound center frequency
    droneFilter.Q.value = 0.7;

    droneSource.connect(droneFilter);
    droneFilter.connect(this.gainNode);
    droneSource.start(0);
    this.sources.push(droneSource);

    // 2. High-frequency pitter-patter crackles
    // We generate quick random impulses
    const crackleBuffer = this.createWhiteNoiseBuffer();
    const crackleSource = this.audioCtx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;

    const crackleFilter = this.audioCtx.createBiquadFilter();
    crackleFilter.type = 'peaking';
    crackleFilter.frequency.value = 6000;
    crackleFilter.Q.value = 3.0;
    crackleFilter.gain.value = 15;

    // Fast amplitude modulation to simulate individual drops
    const modulator = this.audioCtx.createGain();
    crackleSource.connect(crackleFilter);
    crackleFilter.connect(modulator);
    modulator.connect(this.gainNode);
    crackleSource.start(0);
    this.sources.push(crackleSource);

    // Automate the random pitter-patter amplitude
    const modInterval = setInterval(() => {
      if (!this.isPlaying || this.currentTrack !== 'rain') {
        clearInterval(modInterval);
        return;
      }
      const randomAmp = Math.random() * 0.15 + 0.05;
      const randomTime = this.audioCtx.currentTime + Math.random() * 0.1;
      if (modulator.gain) {
        modulator.gain.setValueAtTime(randomAmp, randomTime);
      }
    }, 80);
  }

  playForestWind() {
    const pinkBuffer = this.createPinkNoiseBuffer();
    const source = this.audioCtx.createBufferSource();
    source.buffer = pinkBuffer;
    source.loop = true;

    // Wind filter
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 2.0;

    // Create LFO to simulate rising and falling wind gusts
    const lfo = this.audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.06; // extremely slow oscillation (~16s cycle)

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 250; // modulate filter frequency by +/- 250Hz

    // Connect LFO to filter frequency
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(this.gainNode);

    lfo.start(0);
    source.start(0);

    this.sources.push(source);
    this.sources.push(lfo);
  }

  pause() {
    // For this simple synthesizer, pausing and stopping are similar, 
    // but we can track the playing state.
    this.stop();
  }

  stop() {
    this.isPlaying = false;
    this.sources.forEach(src => {
      try {
        src.stop();
      } catch (e) {
        // Source might not have started or already stopped
      }
    });
    this.sources = [];
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }
}

// Export a single instance
const audioSynthInstance = new AudioSynth();
export default audioSynthInstance;
