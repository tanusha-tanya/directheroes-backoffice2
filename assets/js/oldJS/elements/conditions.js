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
            entity: "conversation",
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
    title: 'Scarcity',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'condition',
        type: 'scarcity'
      },
      elements: [
        {
          type: "action",
          body: {
            action: "incrementRuntimeField"
          }
        },
        {
          type: 'rule',
          condition: {
            entity: 'runtimeField',
            // field: 'categories',
            operand: 'lte',
            value: 1
          }
        },
      ]
    }
  },
  {
    title: 'Has tag',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'condition',
        type: 'hasTag'
      },
      elements: [
        {
          type: "rule",
          condition: {
            entity: "subscriber",
            field: "categories",
            operand: "contains",
            value: []
          },
        }
      ]
    }
  },
  {
    title: 'Wait till',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'condition',
        type: 'waitTillCondition'
      },
      elements: [
        {
          type: "rule",
          condition: {
            entity: "runtime",
            field: "sinceStart",
            operand: "lt",
            value: 1
          },
          onMatch: {
            action: 'fallthrough'
          }
        },
        {
          type: "action",
          body: {
            action: "registerTimeout",
            till: {
              entity: "campaign",
              field: "periodSinceStart"
            },
            delta: 1,
          }
        },
        {
          type: "checkpoint",
        },
        {
          type: "rule",
          condition: {
              entity: "time",
              field: "delta",
              operand: "eq",
              value: {
                entity: "campaign",
                field: "endOfTerm"
              }
          },
        }
      ]
    }
  }
]