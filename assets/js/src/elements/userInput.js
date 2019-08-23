export let userInput = {
  title: 'User Input',
  template: {
    type: 'group',
    displaySettings: {
      subType: 'user-input'
    },
    elements: [
      {
        type: 'checkpoint'
      },
      {
        type: 'rule',
        condition: {
          entity: 'message',
          field: 'text',
          operand: 'contains',
          value: '{{email}}'
        }
      }
    ]
  }
}

export let userInputSubscriber = {
  displaySettings: {
    subType: 'sub-input'
  },
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

export let userInputZapier = {
  displaySettings: {
    subType: 'sub-input'
  },
  type: 'action',
  body: {
    action: 'webhook',
    url: '',
    data: {
      entity: 'subscriber',
      field: 'email'
    }
  }
}