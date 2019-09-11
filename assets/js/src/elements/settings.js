export let allowReEnterElement = {
  type: "rule",
  condition: {
    entity: "campaign",
    field: "entered",
    operand: "eq",
    value: false
  },
  onMatch: {
    action: "fallthrough"
  }
}

export let messageRequestOnlyElement = {
  type: "rule",
  condition: {
    entity: "message",
    field: "isRequest",
    operand: "eq",
    value: true
  },
  onMatch: {
    action: "fallthrough"
  }
}

export let nonSubscribersOnlyElement = {
  type: "rule",
  condition: {
    entity: "contact",
    field: "subscribed",
    operand: "eq",
    value: true
  },
  onMatch: {
    action: "fallthrough"
  }
}