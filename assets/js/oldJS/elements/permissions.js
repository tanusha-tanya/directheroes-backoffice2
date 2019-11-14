export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'addCategory', 'removeCategory', 'followers', 'zapier', 'verified'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'addCategory', 'timeout', 'user-input', 'followers', 'zapier', 'verified'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'followers', 'timeout', 'addCategory', 'existingStep', 'verified'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'followers', 'addCategory', 'zapier', 'verified', 'user-input'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'timeout', 'followers', 'addCategory', 'verified', 'existingStep'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'followers', 'zapier', 'addCategory', 'removeCategory', 'verified'],
  fromBroadcastFlow: ['sendText', 'sendMedia'],
}