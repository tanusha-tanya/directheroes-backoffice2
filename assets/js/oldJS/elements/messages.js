
export default [
  {
    title: 'Text',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'message',
        type: 'sendText'
      },
      body: {
        action: 'sendText',
        text: ''
      }
    }
  },
  {
    title: 'Image',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'message',
        type: 'sendMedia'
      },
      body: {
        action: 'sendMedia',
      }
    }
  },
  {
    title: 'Delay',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'message',
        type: 'delay'
      },
      elements: [
        {
          type: 'action',
          body: {
            action: 'registerTimeout',
            delta: 60
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
            value: 60
          },
          onMatch: { action: 'fallthrough' }
        },
      ]
    }
  },
  {
    title: 'Wait till',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'message',
        type: 'delayTill'
      },
      elements: [
        {
          type: 'action',
          body: {
            action: "registerTimeout",
            till: {
              entity: "campaign",
              field: "endOfTerm"
            },
          }
        },
        {
          type: 'checkpoint'
        },
        {
          type: 'rule',
          condition: {
            entity: "time",
            field: "delta",
            operand: "eq",
            value: {
              entity: "campaign",
              field: "endOfTerm"
            }
          },
          onMatch: { action: 'fallthrough' }
        },
      ]
    }
  }
]