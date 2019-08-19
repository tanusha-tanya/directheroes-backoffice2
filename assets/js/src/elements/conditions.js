export default [
  {
    title: 'Timeout',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'condition'
      },
      elements: [
        {
          type: 'action',
          body: {
            action: 'registerTimeout',
            delta: 1
          }
        },
        {
          type: 'checkpoint'
        },
        {
          type: 'rule',
          condition: {
            entity: 'time',
            field: 'delta',
            operand: 'eq',
            value: 1
          }
        },
      ]
    }
  }
]