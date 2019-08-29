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
  },
  {
    title: 'Followers',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'condition',
        type: 'followers'
      },
      elements: [
        {
          type: 'rule',
          condition: {
            entity: 'contact',
            field: 'followers',
            operand: 'lt',
            value: 5000
          }
        },
      ]
    }
  }
]