import React from 'react';
import { useGameSettings } from '../hooks/useGameSettings';
import { useAudioContext } from '../audio';

interface AudioControlsProps {
  style?: React.CSSProperties;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ style }) => {
  const { settings, updateSettings } = useGameSettings();
  const { audioState, isInitialized } = useAudioContext();

  const handleMasterVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    updateSettings({
      audio: {
        ...settings.audio,
        masterVolume: volume
      }
    });
  };

  const handleSfxVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    updateSettings({
      audio: {
        ...settings.audio,
        sfxVolume: volume
      }
    });
  };

  const handleAudioToggle = () => {
    updateSettings({
      audio: {
        ...settings.audio,
        enabled: !settings.audio.enabled
      }
    });
  };

  const getAudioStatusColor = () => {
    if (!settings.audio.enabled) return '#ff4444';
    if (!isInitialized) return '#ffaa00';
    if (audioState === 'ready') return '#44ff44';
    if (audioState === 'loading') return '#ffaa00';
    return '#ff4444';
  };

  const getAudioStatusText = () => {
    if (!settings.audio.enabled) return 'Disabled';
    if (!isInitialized) return 'Not Initialized';
    if (audioState === 'ready') return 'Ready';
    if (audioState === 'loading') return 'Loading...';
    if (audioState === 'error') return 'Error';
    return 'Uninitialized';
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '10px',
      border: '2px solid #666',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      minWidth: '300px',
      ...style
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '24px',
        textAlign: 'center'
      }}>
        Audio Controls
      </h3>

      {/* Audio Status */}
      <div style={{ 
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '18px'
      }}>
        <span>Status: </span>
        <span style={{ 
          color: getAudioStatusColor(),
          fontWeight: 'bold'
        }}>
          {getAudioStatusText()}
        </span>
      </div>

      {/* Audio Enable/Disable Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'flex',
          alignItems: 'center',
          fontSize: '20px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={settings.audio.enabled}
            onChange={handleAudioToggle}
            style={{
              width: '24px',
              height: '24px',
              marginRight: '12px',
              cursor: 'pointer'
            }}
          />
          Audio Enabled
        </label>
      </div>

      {/* Master Volume Slider */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block',
          fontSize: '18px',
          marginBottom: '8px'
        }}>
          Master Volume: {Math.round(settings.audio.masterVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.audio.masterVolume}
          onChange={handleMasterVolumeChange}
          disabled={!settings.audio.enabled}
          style={{
            width: '100%',
            height: '24px',
            cursor: settings.audio.enabled ? 'pointer' : 'not-allowed',
            opacity: settings.audio.enabled ? 1 : 0.5
          }}
        />
      </div>

      {/* SFX Volume Slider */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ 
          display: 'block',
          fontSize: '18px',
          marginBottom: '8px'
        }}>
          SFX Volume: {Math.round(settings.audio.sfxVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.audio.sfxVolume}
          onChange={handleSfxVolumeChange}
          disabled={!settings.audio.enabled}
          style={{
            width: '100%',
            height: '24px',
            cursor: settings.audio.enabled ? 'pointer' : 'not-allowed',
            opacity: settings.audio.enabled ? 1 : 0.5
          }}
        />
      </div>
    </div>
  );
};