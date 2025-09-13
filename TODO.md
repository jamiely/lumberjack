* Add a typecheck npm script, and add it to the `npm run check` command.
* There is a slight gap between the right branch and trunk.
* The lumberjack always faces to the left. When he is on the left, he should face to the right.
* The branches should be drawn behind the trunk
* When the game is over, the final position of the lumberjack is not drawn correctly. The lumberjack should be under the branch.
* The chosen sprite for the player is inconsistent between attract, play, and gameover screens when chosen randomly. Whoever is displayed in the attract screen should be shown in the play screen. Whoever is on the play screen should be on the game over screen. If we go from game over screen to either screen, we can choose a new character sprite.