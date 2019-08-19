export default [
  {
    title: 'Add tag',
    template: {
      type: 'action',
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
      body: {
        action: 'removeCategory',
        name: []
      }
    }
  }
]