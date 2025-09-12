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

if (!('webkitAudioContext' in window)) {
  Object.defineProperty(window, 'webkitAudioContext', {
    writable: true,
    value: MockAudioContext
  })
}

// Mock fetch for audio assets - override any existing implementation
global.fetch = ((input: string | URL | Request) => {
  let urlString: string
  if (typeof input === 'string') {
    urlString = input
    // Handle relative URLs by converting them to absolute
    if (urlString.startsWith('/')) {
      urlString = 'http://localhost' + urlString
    }
  } else if (input instanceof URL) {
    urlString = input.href
  } else if (input instanceof Request) {
    urlString = input.url
  } else {
    urlString = String(input)
  }
  
  // Mock audio file requests by default - handle both absolute and relative URLs
  if (urlString.includes('.wav') || urlString.includes('/audio/')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024))
    } as Response)
  }
  // Reject other requests by default
  return Promise.reject(new Error(`Fetch not mocked for URL: ${urlString}`))
}) as typeof fetch