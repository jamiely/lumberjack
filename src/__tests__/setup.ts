import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock AudioContext for tests
class MockAudioContext {
  state = 'running'
  destination = {
    connect: () => {},
    disconnect: () => {}
  }
  currentTime = 0
  
  createGain() {
    return {
      connect: () => {},
      disconnect: () => {},
      gain: {
        setValueAtTime: () => {},
        linearRampToValueAtTime: () => {}
      }
    }
  }
  
  createBufferSource() {
    return {
      connect: () => {},
      disconnect: () => {},
      start: () => {},
      stop: () => {},
      buffer: null,
      loop: false,
      onended: null
    }
  }
  
  createBuffer(channels: number, length: number, sampleRate: number) {
    return { channels, length, sampleRate }
  }
  
  decodeAudioData() {
    // Return a proper mock AudioBuffer that can be used by the AudioManager
    return Promise.resolve({
      channels: 1, 
      length: 1024, 
      sampleRate: 44100,
      duration: 1024 / 44100,
      numberOfChannels: 1,
      getChannelData: () => new Float32Array(1024)
    })
  }
  
  suspend() {
    this.state = 'suspended'
    return Promise.resolve()
  }
  
  resume() {
    this.state = 'running'
    return Promise.resolve()
  }
  
  close() {
    return Promise.resolve()
  }
}

// Mock Web Audio API - only if not already defined by individual tests
if (!window.AudioContext) {
  Object.defineProperty(window, 'AudioContext', {
    writable: true,
    value: MockAudioContext
  })
}

if (!window.webkitAudioContext) {
  Object.defineProperty(window, 'webkitAudioContext', {
    writable: true,
    value: MockAudioContext
  })
}

// Mock fetch for audio assets - provide a default implementation
// but allow tests to override it with vi.mocked(global.fetch)
if (!global.fetch) {
  global.fetch = ((url: string) => {
    // Mock audio file requests by default
    if (typeof url === 'string' && url.includes('.wav')) {
      return Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024))
      } as Response)
    }
    // Reject other requests by default
    return Promise.reject(new Error('Fetch not available in test environment'))
  }) as typeof fetch
}