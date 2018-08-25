import FirebaseService from '../services/FirebaseService';

export default {
  fetchPlayQueue: async () => FirebaseService.readArray('tracks'),

  addTrackToPlayQueue: async trackData => FirebaseService.push('tracks', trackData),

  removeTrackFromPlayQueue: async trackId => FirebaseService.removeChild('tracks', trackId),

  addPlayQueueListener: callback => FirebaseService.database.ref('tracks').on('value', callback),

  fetchCurrentTrack: async () => FirebaseService.read('currentTrack'),

  updateCurrentTrack: async track => FirebaseService.write('currentTrack', track),

  addCurrentTrackListener: callback => FirebaseService.database.ref('currentTrack').on('value', callback),
};
