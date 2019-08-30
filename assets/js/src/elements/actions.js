import { userInputZapier } from './userInput';

const zapierAction = JSON.parse(JSON.stringify(userInputZapier));

zapierAction.displaySettings.subType = 'action';

console.log(zapierAction);

export default [
  {
    title: 'Add tag',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'action',
      },
      body: {
        action: 'addCategory',
        name: []
      }
    }
  },
  {
    title: 'Remove tag',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'action',
      },
      body: {
        action: 'removeCategory',
        name: []
      }
    }
  },
  {
    title: 'Zapier',
    template: {
      ...zapierAction
    }
  }
]