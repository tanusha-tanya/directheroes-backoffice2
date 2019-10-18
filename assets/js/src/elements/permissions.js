export default {
  fromFlow: [],
  fromTrigger: ['sendMedia', 'sendText', 'delay', 'delayTill', 'addCategory', 'removeCategory', 'followers', 'zapier', 'verified', 'topCategory', 'topReply'],
  fromTriggerStep: [],
  fromMessageStep: ['sendText', 'sendMedia', 'delay', 'delayTill', 'addCategory', 'timeout', 'user-input', 'followers', 'zapier', 'verified', 'topCategory', 'topReply'],
  fromActionStep: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'timeout', 'addCategory', 'existingStep', 'verified', 'topCategory', 'topReply'],
  fromCondition: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'addCategory', 'zapier', 'verified', 'topCategory', 'topReply'],
  fromUserInputFails: ['sendText', 'sendMedia', 'delay', 'delayTill', 'timeout', 'followers', 'addCategory', 'verified', 'topCategory', 'topReply'],
  fromUserInput: ['sendText', 'sendMedia', 'delay', 'delayTill', 'followers', 'zapier', 'addCategory', 'removeCategory', 'verified',  'topCategory', 'topReply'],
  fromBroadcastFlow: ['sendText', 'sendMedia', 'delayTill', 'followers', 'verified', 'topCategory'],
}