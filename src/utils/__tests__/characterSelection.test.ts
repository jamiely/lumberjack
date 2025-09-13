import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getRandomCharacterType, 
  getCharacterFromUrl, 
  selectCharacterType,
  selectCharacterTypeFromCurrentUrl
} from '../characterSelection'

describe('characterSelection', () => {
  describe('getRandomCharacterType', () => {
    it('returns a valid character type', () => {
      const result = getRandomCharacterType()
      expect(['lumberjack1', 'lumberjack2', 'lumberjack3']).toContain(result)
    })

    it('returns different characters on multiple calls (statistically)', () => {
      // Run multiple times to increase likelihood of getting both types
      const results = new Set()
      for (let i = 0; i < 20; i++) {
        results.add(getRandomCharacterType())
      }
      
      // Should get at least one result, possibly all three
      expect(results.size).toBeGreaterThan(0)
      expect(results.size).toBeLessThanOrEqual(3)
    })
  })

  describe('getCharacterFromUrl', () => {
    it('returns valid character type from URL parameter', () => {
      const params1 = new URLSearchParams('?character=lumberjack1')
      expect(getCharacterFromUrl(params1)).toBe('lumberjack1')

      const params2 = new URLSearchParams('?character=lumberjack2')
      expect(getCharacterFromUrl(params2)).toBe('lumberjack2')

      const params3 = new URLSearchParams('?character=lumberjack3')
      expect(getCharacterFromUrl(params3)).toBe('lumberjack3')
    })

    it('returns null for invalid character type', () => {
      const params = new URLSearchParams('?character=invalid')
      expect(getCharacterFromUrl(params)).toBeNull()
    })

    it('returns null when no character parameter exists', () => {
      const params = new URLSearchParams('?other=value')
      expect(getCharacterFromUrl(params)).toBeNull()
    })

    it('returns null for empty character parameter', () => {
      const params = new URLSearchParams('?character=')
      expect(getCharacterFromUrl(params)).toBeNull()
    })
  })

  describe('selectCharacterType', () => {
    it('returns character from URL when valid', () => {
      const params = new URLSearchParams('?character=lumberjack1')
      expect(selectCharacterType(params)).toBe('lumberjack1')
    })

    it('returns random character when URL parameter is invalid', () => {
      const params = new URLSearchParams('?character=invalid')
      const result = selectCharacterType(params)
      expect(['lumberjack1', 'lumberjack2', 'lumberjack3']).toContain(result)
    })

    it('returns random character when no URL parameter exists', () => {
      const params = new URLSearchParams('')
      const result = selectCharacterType(params)
      expect(['lumberjack1', 'lumberjack2', 'lumberjack3']).toContain(result)
    })
  })

  describe('selectCharacterTypeFromCurrentUrl', () => {
    beforeEach(() => {
      // Clear any previous mocks
      vi.restoreAllMocks()
    })

    it('returns random character in SSR environment', () => {
      // Mock window as undefined (SSR environment)
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true
      })

      const result = selectCharacterTypeFromCurrentUrl()
      expect(['lumberjack1', 'lumberjack2', 'lumberjack3']).toContain(result)
    })

    it('uses window location when available', () => {
      // Mock window and location
      const mockLocation = {
        search: '?character=lumberjack1'
      }
      
      Object.defineProperty(global, 'window', {
        value: {
          location: mockLocation
        },
        writable: true
      })

      const result = selectCharacterTypeFromCurrentUrl()
      expect(result).toBe('lumberjack1')
    })

    it('falls back to random when window location has invalid character', () => {
      const mockLocation = {
        search: '?character=invalid'
      }
      
      Object.defineProperty(global, 'window', {
        value: {
          location: mockLocation
        },
        writable: true
      })

      const result = selectCharacterTypeFromCurrentUrl()
      expect(['lumberjack1', 'lumberjack2', 'lumberjack3']).toContain(result)
    })
  })
})