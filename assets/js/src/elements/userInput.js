export const userInout = {
  title: 'User Input',
  template: {
    type: 'group',
    displaySettings: {
      subType: 'userInput'
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