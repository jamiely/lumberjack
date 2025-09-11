import { useEffect } from 'react';
import { useGameEvents } from './useGameEvents.js';
import { useGameAudio } from '../audio/hooks/useGameAudio.js';

export const useAudioEventHandlers = () => {
  const { subscribe } = useGameEvents();
  const { playChopSound, playHitSound, playGameOverSound, playTimerWarning } = useGameAudio();
  
  useEffect(() => {
    const unsubscribeChop = subscribe('chop', playChopSound);
    const unsubscribeHit = subscribe('hit', playHitSound);
    const unsubscribeGameOver = subscribe('gameOver', playGameOverSound);
    const unsubscribeTimer = subscribe('timerWarning', playTimerWarning);
    
    return () => {
      unsubscribeChop();
      unsubscribeHit();
      unsubscribeGameOver();
      unsubscribeTimer();
    };
  }, [subscribe, playChopSound, playHitSound, playGameOverSound, playTimerWarning]);
};