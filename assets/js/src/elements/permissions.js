export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'addCategory', 'removeCategory', 'followers', 'zapier'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'addCategory', 'timeout', 'user-input', 'followers', 'zapier'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'followers'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'followers', 'addCategory', 'zapier'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'followers'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'followers', 'zapier', 'addCategory', 'removeCategory'],
  fromBroadcastFlow: ['sendText', 'sendMedia', 'followers'],
}