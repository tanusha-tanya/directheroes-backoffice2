export default [
  {
    title: 'Add tag',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'action',
      },
      body: {
        action: 'addCategory',
        name: []
      }
    }
  },
  {
    title: 'Remove tag',
    template: {
      type: 'action',
      displaySettings: {
        subType: 'action',
      },
      body: {
        action: 'removeCategory',
        name: []
      }
    }
  }
]