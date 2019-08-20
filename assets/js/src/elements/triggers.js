export default [
  {
    type: 'group',
    displaySettings: {
      type: 'trigger'
    },
    elements: [
      {
        type: 'checkpoint'
      }
    ]
  },
  {
    type: 'group',
    displaySettings: {
      type: 'trigger'
    },
    elements: [
      {
        type: 'checkpoint'
      },
      {
        title: 'Keywords',
        template: {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'text',
            operand: 'contains',
            value: [],
          },
          onFail: {
            action: 'fallthrough',
          },
        },
      }
    ]
  },
  {
    type: 'group',
    displaySettings: {
      type: 'trigger'
    },
    elements: [
      {
        type: 'checkpoint'
      },
      {
        title: 'Media Share',
        template: {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'mediaShare'
          },
          onFail: {
            action: 'fallthrough',
          },
        },
      }
    ]
  },
  {
    type: 'group',
    displaySettings: {
      type: 'trigger'
    },
    elements: [
      {
        type: 'checkpoint'
      },
      {
        title: 'Post Reply',
        template: {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'postReply'
          },
          onFail: {
            action: 'fallthrough',
          },
          onMatch: {
            action: 'chain',
            elements: [{
              condition: {
                entity: 'post',
                field: 'url',
                operand: 'eq',
                value: ''
              }
            }]
          }
        },
      },
    ]
  },
  {
    type: 'group',
    displaySettings: {
      type: 'trigger'
    },
    elements: [
      {
        type: 'checkpoint'
      },
      {
        title: 'Story Reply',
        template: {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'storyReply'
          },
          onFail: {
            action: 'fallthrough',
          },
        },
      }
    ]
  },
  {
    type: 'group',
    displaySettings: {
      type: 'trigger'
    },
    elements: [
      {
        type: 'checkpoint'
      },
      {
        title: 'Story Mention',
        template: {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'storyMention'
          },
          onFail: {
            action: 'fallthrough',
          },
        },
      }
    ]
  },
  {
    type: 'group',
    displaySettings: {
      type: 'trigger'
    },
    elements: [
      {
        type: 'checkpoint'
      },
      {
        title: 'Ad Reply',
        template: {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'adReply'
          },
          onFail: {
            action: 'fallthrough',
          },
        },
      }
    ]
  },
]