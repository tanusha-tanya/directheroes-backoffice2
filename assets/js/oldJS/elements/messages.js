import conditions from './conditions';
import { userInput } from './userInput'

let timeout = conditions.find(condition => condition.title === 'Timeout');

if (timeout) {
  timeout = JSON.parse(JSON.stringify(timeout));
  timeout.template.elements[2].onMatch = { action: 'fallthrough' };
  timeout.template.displaySettings.type ='delay';
  timeout.template.displaySettings.subType ='message';
}

console.log(timeout.template);


export default [
  {
    title: 'Text',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'message'
      },
      body: {
        action: 'sendText',
        text: ''
      }
    }
  },
  {
    title: 'Image',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'message'
      },
      body: {
        action: 'sendMedia',
      }
    }
  },
  {
    title: 'Delay',
    template: timeout.template
  },
  {
    title: 'Wait till',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'message',
        type: 'delayTill'
      },
      elements: [
        {
          type: 'action',
          body: {
            action: "registerTimeout",
            till: {
              entity: "campaign",
              field: "endOfTerm"
            },
          }
        },
        {
          type: 'checkpoint'
        },
        {
          type: 'rule',
          condition: {
            entity: "time",
            field: "delta",
            operand: "eq",
            value: {
              entity: "campaign",
              field: "endOfTerm"
            }
          },
          onMatch: { action: 'fallthrough' }
        },
      ]
    }
  },
  userInput
]