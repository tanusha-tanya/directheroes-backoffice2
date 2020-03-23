import { userInputZapier } from './userInput';

const zapierAction = JSON.parse(JSON.stringify(userInputZapier));

zapierAction.displaySettings.subType = 'action';

export default [
  {
    title: 'Add tags',
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
    title: 'Remove tags',
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
    title: 'Remove tags',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'action',
        type: 'saveCustomInput'
      },
      body: {
        action: 'collect',
        source: {
          entity: 'message',
          field: 'text'
        },
        destination: {
          entity: 'subscriber',
          field: ''
        }
      },
    }
  },
  // {
  //   title: 'Subscription',
  //   template: {
  //     type: 'action',
  //     displaySettings: {
  //       subType: 'action',
  //       type: 'subscription'
  //     },
  //     body: {
  //       action: 'subscribe',
  //     }
  //   }
  // },
  {
    title: 'Zapier',
    template: {
      ...zapierAction
    }
  }
]