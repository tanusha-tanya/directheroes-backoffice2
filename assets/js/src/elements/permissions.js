export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'addCategory', 'removeCategory', 'followers', 'webhook'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'timeout', 'user-input', 'followers', 'webhook'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'followers', 'webhook'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'followers', 'webhook'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'followers'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'followers', 'webhook'],
  fromBroadcastFlow: ['sendText', 'sendMedia', 'followers'],
}