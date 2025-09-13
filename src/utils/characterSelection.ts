import { type CharacterType, getCharacterTypes, isValidCharacterType } from '../characters'

/**
 * Returns a random character type from available characters
 */
export function getRandomCharacterType(): CharacterType {
  const availableTypes = getCharacterTypes()
  const randomIndex = Math.floor(Math.random() * availableTypes.length)
  return availableTypes[randomIndex]
}

/**
 * Extracts character type from URL query parameter
 * @param urlSearchParams - URLSearchParams object (e.g., from window.location.search)
 * @returns Character type if valid, null otherwise
 */
export function getCharacterFromUrl(urlSearchParams: URLSearchParams): CharacterType | null {
  const characterParam = urlSearchParams.get('character')
  
  if (characterParam && isValidCharacterType(characterParam)) {
    return characterParam
  }
  
  return null
}

/**
 * Selects character type based on URL parameter with random fallback
 * @param urlSearchParams - URLSearchParams object (e.g., from window.location.search)
 * @returns Character type from URL if valid, otherwise random character
 */
export function selectCharacterType(urlSearchParams: URLSearchParams): CharacterType {
  const urlCharacter = getCharacterFromUrl(urlSearchParams)
  return urlCharacter || getRandomCharacterType()
}

/**
 * Convenience function to select character type from current window location
 * @returns Character type from URL if valid, otherwise random character
 */
export function selectCharacterTypeFromCurrentUrl(): CharacterType {
  if (typeof window === 'undefined') {
    // Fallback for SSR or testing environments
    return getRandomCharacterType()
  }
  
  const urlParams = new URLSearchParams(window.location.search)
  return selectCharacterType(urlParams)
}