export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'delayTill', 'addCategory', 'removeCategory', 'followers', 'zapier', 'verified', 'topCategory', 'scarcity', 'hasTag'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'delayTill', 'addCategory', 'timeout', 'user-input', 'followers', 'zapier', 'verified', 'topCategory', 'scarcity', 'hasTag'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'timeout', 'addCategory', 'existingStep', 'verified', 'topCategory', 'scarcity', 'zapier', 'hasTag'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'addCategory', 'zapier', 'verified', 'topCategory', 'scarcity', 'hasTag'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'delayTill', 'timeout', 'followers', 'addCategory', 'verified', 'topCategory', 'scarcity', 'hasTag'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'zapier', 'addCategory', 'removeCategory', 'verified',  'topCategory', 'scarcity', 'hasTag'],
  fromBroadcastFlow: ['sendText', 'sendMedia', 'delayTill', 'followers', 'verified', 'topCategory', 'hasTag'],
}