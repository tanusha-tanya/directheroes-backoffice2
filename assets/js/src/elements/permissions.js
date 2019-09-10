export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'addCategory', 'removeCategory', 'followers', 'zapier'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'timeout', 'user-input', 'followers', 'zapier'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'followers', 'zapier'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'followers', 'zapier'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'followers'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'followers', 'zapier', 'addCategory'],
  fromBroadcastFlow: ['sendText', 'sendMedia', 'followers'],
}