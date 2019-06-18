return {
  id: "5d08d50bdc7dce00070f0801",
  name: "PouchDB Test",
  steps: [{
    id: "5d08d50bdc7dce00070f07fc",
    type: "campaignEntry",
    name: "Campaign Entry Step",
    elements: [{
      id: "5d08d50bdc7dce00070f07fd",
      type: "messageConditionMultiple",
      value: {
        conditionList: [{
          id: "5d08d50bdc7dce00070f0800",
          messageType: "any",
          keywords: [],
          onMatch: {
            id: "5d08d50bdc7dce00070f07ff",
            type: "goToStep",
            value: {
              stepId: "5d08d50bdc7dce00070f07fe"
            },
            displaySettings: {
              collapsed: false,
              visible: true
            }
          },
          namePrefix: "0_1"
        }]
      },
      displaySettings: {
        collapsed: false,
        visible: true
      }
    }],
    displaySettings: {
      collapsed: false
    }
  }, {
    id: "5d08d50bdc7dce00070f07fe",
    type: "regular",
    name: "Step #1",
    elements: [],
    displaySettings: {
      collapsed: false
    }
  }],
  igAccountId: 14,
  createdAt: 1560859915,
  isEnabled: false,
  isActive: false,
  isIncomplete: true,
  isArchived: false,
  settings: {
    allowReEnter: false
  }
}