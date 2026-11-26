import { describe, expect, it } from 'vitest'
import { windowLayout } from './window'

// Vermilion's rotated monitor with a taskbar along the bottom.
const portrait = {
  bounds: { x: 0, y: 0, width: 1050, height: 1680 },
  workArea: { x: 0, y: 0, width: 1050, height: 1632 },
}

describe('windowLayout', () => {
  it('fills the work area of a portrait display', () => {
    expect(windowLayout(portrait, ['electron', 'main.js'])).toEqual({
      fullscreen: false,
      bounds: portrait.workArea,
    })
  })

  it('covers the whole display with --fullscreen', () => {
    expect(windowLayout(portrait, ['Lumberjack.exe', '--fullscreen'])).toEqual({
      fullscreen: true,
      bounds: portrait.bounds,
    })
  })
})
