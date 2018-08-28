import FirebaseService from '../services/FirebaseService';

export default {
  isRoomIdValid: async roomId => FirebaseService.read(`${roomId}/state`),

  createRoom: async roomId => FirebaseService.write(`${roomId}/state`, 'active'),

  fetchMessages: async roomId => FirebaseService.readArray(`${roomId}/messages`),

  postMessage: async ({ roomId, message }) => FirebaseService.push(`${roomId}/messages`, message),

  addChatRoomListener: ({ roomId, callback }) => FirebaseService.database.ref(`${roomId}/messages`).on('value', callback),
};
