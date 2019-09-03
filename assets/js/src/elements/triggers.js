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
        subType: 'trigger',
        type: 'mediaShare'
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
        subType: 'trigger',
        type: 'postShare'
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
          type: 'checkpoint'
        },
        {
          type: 'rule',
          condition: {
            entity: 'message',
            field: 'type',
            operand: 'eq',
            value: 'storyShare'
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
          onMatch: {
            action: 'chain',
            elements: [{
              condition: {
                entity: 'post',
                field: 'hashtag',
                operand: 'eq',
                value: ''
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
    title: 'Ad Reply',
    template: {
      type: 'group',
      displaySettings: {
        subType: 'trigger',
        type: 'adReply'
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