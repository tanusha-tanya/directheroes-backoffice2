
export default [
  {
    title: 'Keywords',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger',
        type: 'keywords'
      },
      elements: [
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
        subType: 'trigger',
        type: 'mediaShare'
      },
      elements: [
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
        subType: 'trigger',
        type: 'postShare'
      },
      elements: [
        {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'postShare'
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
        subType: 'trigger',
        type: 'storyShare'
      },
      elements: [
        {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'storyShare'
          },
          onMatch: {
            action: 'chain',
            elements: [{
              condition: {
                entity: 'message',
                field: 'text',
                operand: 'contains',
                value: []
              }
            }]
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
        subType: 'trigger',
        type: 'storyMention'
      },
      elements: [
        {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'storyMention'
          },
          onMatch: {
            action: 'chain',
            elements: [{
              condition: {
                entity: 'post',
                field: 'hashtag',
                operand: 'contains',
                value: []
              }
            }]
          },
          onFail: {
            action: 'fallthrough',
          },
        }
      ]
    },
  },
  {
    title: 'Number',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger',
        type: 'number'
      },
      elements: [
        {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'text',
            operand: 'contains',
            value: '{{number}}'
          },
          onFail: {
            action: 'fallthrough',
          },
        }
      ]
    },
  },
  {
    title: 'No reply',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger',
        type: 'noreply'
      },
      elements: [
        {
          type: 'rule',
          condition: {
            entity: 'time',
            field: 'delta',
            operand: 'eq',
            value: 14400
          },
          onFail: {
            action: 'fallthrough',
          },
        },
      ]
    }
  },
  {
    title: 'User Input',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger',
        type: 'user-input'
      },
      elements: [
        {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'text',
            operand: 'contains',
            value: '{{email}}'
          },
          onFail: {
            action: 'fallthrough',
          },
        }
      ]
    }
  }
]