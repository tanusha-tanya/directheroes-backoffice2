export default [
  {
    title: 'Add tags',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'action',
        type: 'addCategory'
      },
      body: {
        action: 'addCategory',
        name: []
      }
    }
  },
  {
    title: 'Remove tags',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'action',
        type: 'removeCategory'
      },
      body: {
        action: 'removeCategory',
        name: []
      }
    }
  },
  {
    title: 'Save custom field',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'action',
        type: 'saveCustomField'
      },
      body: {
        action: 'collect',
        source: {
          entity: 'message',
          field: 'text'
        },
        destination: {
          entity: 'subscriber',
          field: ''
        }
      },
    }
  },
  // {
  //   title: 'Subscription',
  //   template: {
  //     type: 'action',
  //     displaySettings: {
  //       subType: 'action',
  //       type: 'subscription'
  //     },
  //     body: {
  //       action: 'subscribe',
  //     }
  //   }
  // },
  {
    title: 'Zapier',
    template: {
      displaySettings: {
        subType: 'action',
        type: 'zapier'
      },
      type: 'group',
      elements: [
        {
          type: 'action',
          body: {
            action: 'webhook',
            url: '',
            data: {
              status: null
            }
          }
        }
      ]
    }
  }
]