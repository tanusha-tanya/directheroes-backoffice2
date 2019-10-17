export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'addCategory', 'removeCategory', 'followers', 'zapier', 'verified', 'topCategory', 'topReply'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'addCategory', 'timeout', 'user-input', 'followers', 'zapier', 'verified', 'topCategory', 'topReply'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'followers', 'timeout', 'addCategory', 'existingStep', 'verified', 'topCategory', 'topReply'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'followers', 'addCategory', 'zapier', 'verified', 'topCategory', 'topReply'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'timeout', 'followers', 'addCategory', 'verified', 'topCategory', 'topReply'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'followers', 'zapier', 'addCategory', 'removeCategory', 'verified',  'topCategory', 'topReply'],
  fromBroadcastFlow: ['sendText', 'sendMedia', 'followers', 'verified', 'topCategory'],
}