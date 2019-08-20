export default [
  {
    title: 'Timeout',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'condition',
        type: 'timeout'
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