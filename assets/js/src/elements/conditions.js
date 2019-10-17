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
  },
  {
    title: 'Is Verified',
    template: {
      type: "group",
      displaySettings: {
        subType: "condition",
        type: "verified"
      },
      elements: [
        {
          type: "rule",
          condition: {
            entity: "contact",
            field: "verified",
            operand: "eq",
            value: true
          },
        }
      ]
    }
  },
  {
    title: 'Is Majority Member',
    template: {
      type: "group",
      displaySettings: {
        subType: "condition",
        type: "topCategory"
      },
      elements: [
        {
          type: "rule",
          condition: {
            entity: "subscriber",
            field: "categories",
            operand: "contains",
            value: {
              entity: "runtime",
              field: "topCategory"
            }
          },
        }
      ]
    }
  },
  {
    title: 'Top N people',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'condition',
        type: 'topReply'
      },
      elements: [
        {
          type: 'rule',
          condition: {
            entity: 'subscriber',
            field: 'categories',
            operand: 'lt',
            value: 1
          }
        },
      ]
    }
  },
]