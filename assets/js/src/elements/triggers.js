export default [
  {
    title: 'Keywords',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger',
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
            value: [],
          },
          onFail: {
            action: 'fallthrough',
          },
        }
      ]
    },
  },
  {
    title: 'Media Share',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger'
      },
      elements: [
        {
          type: 'checkpoint'
        },
        {
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
        }
      ]
    },
  },
  {
    title: 'Post Reply',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger'
      },
      elements: [
        {
          type: 'checkpoint'
        },
        {
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
      ]
    },
  },
  {
    title: 'Story Reply',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger'
      },
      elements: [
        {
          type: 'checkpoint'
        },
        {
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
        }
      ]
    },
  },
  {
    title: 'Story Mention',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger'
      },
      elements: [
        {
          type: 'checkpoint'
        },
        {
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
        }
      ]
    },
  },
  {
    title: 'Ad Reply',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger'
      },
      elements: [
        {
          type: 'checkpoint'
        },
        {
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
        }
      ]
    },
  },
]