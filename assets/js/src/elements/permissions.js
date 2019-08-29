export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'addCategory', 'removeCategory', 'followers'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'timeout', 'user-input', 'followers'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'followers'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'followers'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'followers'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'followers'],
  fromBroadcastFlow: ['sendText', 'sendMedia', 'followers'],
}