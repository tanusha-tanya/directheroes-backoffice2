/**
 * ToDo:
 * Next version: Remove all permission except for Condition
 */
export default {
  fromFlow: [],
  fromTrigger: [
    'sendMedia',
    'sendText',
    'delay',
    'addCategory',
    'removeCategory',
    'existingStep',
    'followers',
    'zapier',
    'verified'],
  fromTriggerStep: [],
  fromMessageStep: [
    'sendText',
    'sendMedia',
    'delay',
    'addCategory',
    'timeout',
    'user-input',
    'followers',
    'existingStep',
    'zapier',
    'verified'],
  fromLinkedMessageStep: [
    'sendText',
    'sendMedia',
    'delay',
  ],
  fromActionStep: [
    'sendText',
    'sendMedia',
    'delay',
    'followers',
    'timeout',
    'addCategory',
    'existingStep',
    'verified',
    'zapier'],
  fromCondition: [
    'sendText',
    'sendMedia',
    'delay',
    'followers',
    'addCategory',
    'existingStep',
    'zapier',
    'verified'],
  fromConditionTimeout: [
    'user-input',
  ],
  fromUserInputFails: [
    'sendText',
    'sendMedia',
    'delay',
    'timeout',
    'followers',
    'existingStep',
    'addCategory',
    'verified'],
  fromUserInput: [
    'sendText',
    'sendMedia',
    'delay',
    'followers',
    'zapier',
    'existingStep',
    'addCategory',
    'removeCategory',
    'verified'],
  fromBroadcastFlow: [
    'sendText',
    'sendMedia'],
}