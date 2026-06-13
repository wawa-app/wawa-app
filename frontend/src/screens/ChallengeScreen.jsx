import React from 'react';
import ChallengeCaptureScreen from './challenge/ChallengeCaptureScreen';
import { listPhotos, pickRandom, seedPhotos } from '../utils/photos';

export default function ChallengeScreen() {
  const [target, setTarget] = React.useState(null);

  const loadTarget = React.useCallback(async () => {
    await seedPhotos();
    const photos = await listPhotos();
    setTarget(pickRandom(photos));
  }, []);

  React.useEffect(() => {
    loadTarget();
  }, [loadTarget]);

  const handleCaptured = React.useCallback((photoUri) => {
    console.log('Challenge photo captured:', photoUri);
  }, []);

  return (
    <ChallengeCaptureScreen
      target={target}
      onCaptured={handleCaptured}
      onChangeTarget={loadTarget}
    />
  );
}
