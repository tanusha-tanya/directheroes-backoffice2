/**
 * ToDo:
 * Next version: Remove all permission except for Condition
 */
export default {
  fromFlow: [],
  fromTrigger: [
    'sendText',
    'delay',
    'addCategory',
    'removeCategory',
    'existingStep',
    'followers',
    'zapier',
    'verified'],
  fromTriggerStep: [
  ],
  fromMessageStep: [
    'sendText',
    'delay',
    'addCategory',
    'followers',
    'existingStep',
    'removeCategory',
    'zapier',
    'verified'],
  fromLinkedMessageStep: [
    'sendText',
    'delay',
  ],
  fromActionStep: [
    'sendText',
    'delay',
    'followers',
    'addCategory',
    'existingStep',
    'removeCategory',
    'verified',
    'zapier'],
  fromCondition: [
    'sendText',
    'delay',
    'followers',
    'addCategory',
    'existingStep',
    'removeCategory',
    'zapier',
    'verified'],
  fromUserInputFails: [
    'sendText',
    'delay',
    'followers',
    'existingStep',
    'removeCategory',
    'addCategory',
    'verified'],
  fromUserInput: [
    'sendText',
    'delay',
    'followers',
    'zapier',
    'existingStep',
    'addCategory',
    'removeCategory',
    'verified'],
  fromBroadcastFlow: [
    'sendText'],
}