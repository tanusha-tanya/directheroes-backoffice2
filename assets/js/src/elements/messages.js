import conditions from './conditions';

let timeout = conditions.find(condition => condition.title === 'Timeout');

if (timeout) {
  timeout = JSON.parse(JSON.stringify(timeout));
  timeout.template.elements[2].onMatch = { action: 'fallthrough' };
  timeout.template.displaySettings.type ='delay';
  timeout.template.displaySettings.subType ='message';
}

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
    }
  ]