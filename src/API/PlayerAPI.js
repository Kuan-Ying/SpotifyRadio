import FirebaseService from '../services/FirebaseService';

export default {
  fetchPlayQueue: async roomId => FirebaseService.readArray(`${roomId}/tracks`),

  addTrackToPlayQueue: async ({ roomId, trackData }) => FirebaseService.push(`${roomId}/tracks`, trackData),

  removeTrackFromPlayQueue: async ({ roomId, trackId }) => FirebaseService.removeChild(`${roomId}/tracks`, trackId),

  addPlayQueueListener: ({ roomId, callback }) => FirebaseService.database.ref(`${roomId}/tracks`).on('value', callback),

  fetchCurrentTrack: async roomId => FirebaseService.read(`${roomId}/currentTrack`),

  updateCurrentTrack: async ({ roomId, track }) => FirebaseService.write(`${roomId}/currentTrack`, track),

  addCurrentTrackListener: ({ roomId, callback }) => FirebaseService.database.ref(`${roomId}/currentTrack`).on('value', callback),
};
