export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'delayTill', 'addCategory', 'removeCategory', 'followers', 'zapier', 'verified', 'topCategory', 'scarcity'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'delayTill', 'addCategory', 'timeout', 'user-input', 'followers', 'zapier', 'verified', 'topCategory', 'scarcity'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'timeout', 'addCategory', 'existingStep', 'verified', 'topCategory', 'scarcity', 'zapier'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'addCategory', 'zapier', 'verified', 'topCategory', 'scarcity'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'delayTill', 'timeout', 'followers', 'addCategory', 'verified', 'topCategory', 'scarcity'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'zapier', 'addCategory', 'removeCategory', 'verified',  'topCategory', 'scarcity'],
  fromBroadcastFlow: ['sendText', 'sendMedia', 'delayTill', 'followers', 'verified', 'topCategory'],
}