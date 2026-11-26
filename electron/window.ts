// Window placement for the cabinet: fill the display the game opens on, whatever its orientation.
// A fixed 1080x1920 window overflowed shorter portrait monitors (Vermilion's is 1050x1680).
export const FULLSCREEN_FLAG = '--fullscreen'

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export function windowLayout(display: { bounds: Rectangle; workArea: Rectangle }, argv: readonly string[]) {
  const fullscreen = argv.includes(FULLSCREEN_FLAG)
  const { x, y, width, height } = fullscreen ? display.bounds : display.workArea
  return { fullscreen, bounds: { x, y, width, height } }
}
