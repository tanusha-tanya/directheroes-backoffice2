export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'addCategory', 'removeCategory'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'timeout', 'user-input'],
  fromActionStep: ['sendText', 'sendMedia', 'delay'],
  fromCondition: ['sendText', 'sendMedia', 'delay'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay'],
  fromUserInput: ['sendText', 'sendMedia', 'delay'],
  fromBroadcastFlow: ['sendText', 'sendMedia'],
}