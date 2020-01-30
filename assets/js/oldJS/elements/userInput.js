export let userInput = {
  title: 'User Input',
  template: {
    type: 'group',
    displaySettings: {
      subType: 'user-input',
      type: 'user-input'
    },
    elements: [
      // {
      //   type: 'checkpoint'
      // },
      {
        type: 'rule',
        condition: {
          entity: 'message',
          field: 'text',
          operand: 'contains',
          value: '{{email}}'
        },
        onMatch: {
          action: 'fallthrough',
        }
      },
      {
        type: 'action',
        body: {
          action: 'collect',
          source: {
            entity: "message",
            field: "text"
          },
          destination: {
            entity: "subscriber",
            field: "email"
          }
        }
      }
    ]
  }
}

// export let userInputSubscriber = {
//   displaySettings: {
//     subType: 'sub-input',
//     type: 'subscriber'
//   },
//   type: 'action',
//   body: {
//     action: 'collect',
//     source: {
//       entity: "message",
//       field: "text"
//     },
//     destination: {
//       entity: "subscriber",
//       field: "email"
//     }
//   }
// }

export let userInputZapier = {
  displaySettings: {
    subType: 'sub-input',
    type: 'zapier'
  },
  type: 'group',
  elements: [
    {
      type: 'action',
      body: {
        action: 'webhook',
        url: '',
        data: {
          // entity: 'subscriber',
          // field: 'email',
          status: null
        }
      }
    }
  ]

}