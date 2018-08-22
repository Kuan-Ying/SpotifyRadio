import FirebaseService from '../services/FirebaseService';

export default {
  fetchPlayQueue: async () => FirebaseService.readArray('tracks'),

  addTrackToPlayQueue: async trackData => FirebaseService.push('tracks', trackData),

  fetchCurrentTrack: async () => FirebaseService.read('currentTrack'),

  updateCurrentTrack: async track => FirebaseService.write('currentTrack', track),
};
