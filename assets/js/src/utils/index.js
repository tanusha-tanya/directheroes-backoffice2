const getOnMatchElement = (element) => {
  const { type, displaySettings } = element;
  let matchElement = element;

  if (!['group', 'linker', 'rule'].includes(type)) return;

  if (type === 'group' && !(displaySettings && displaySettings.subType === 'settings'))

  if (type === 'group') {
    matchElement = element.elements.find(element => element.type === 'rule');
  }

  // console.log(matchElement);

  if (matchElement.condition && ['postShare', 'storyMention', 'storyShare'].includes(matchElement.condition.value) &&  matchElement.onMatch && matchElement.onMatch.elements) {
    return matchElement.onMatch.elements[0];
  } else if (['linker', 'rule'].includes(type)) {
    return matchElement;
  }

  return matchElement;
}
const campaignElementValidate = (element, isEntry) => {
  let warning = null;

  switch(element.type) {
    case 'action':
      const { action, text, mediaId } = element.body;

      switch (action) {
        case 'sendMedia':
          if (!mediaId) {
            warning = 'Image not uploaded'
          }
          break;
        case 'sendText':
          if (!text) {
            warning = 'Enter text'
          }
          break;
      }
      break;
    case 'rule':
      const matchElement = getOnMatchElement(element);

      if (!matchElement || !matchElement.onMatch) {
        warning = 'Element has no target step'
      }

      if (element.condition.value === 'storyMention' && isEntry && (element.onMatch.elements && !element.onMatch.elements[0].condition.value.length)) {
        warning = 'Please specify at least one hashtag'
      }
      break;
    case 'group':
      element.elements.some(elementItem => {
        return warning = campaignElementValidate(elementItem);
      })
    // case 'sendImageAction':
    //   if (!element.value) {
    //     warning = 'Image not uploaded'
    //   }
    // break;
    // case 'sendTextAction':
    //   if (!element.value.text) {
    //     warning = 'Enter text'
    //   }
    // break;
    // case 'regular':
    //   if (!element.elements.length) {
    //     warning = 'Please add at least one element'
    //   }
    // break;
    // case 'callWebhookAction':
    //   if (!element.value.url) {
    //     warning = 'Please enter hook url'
    //   } else if (!element.value.status) {
    //     warning = 'Please verify hook url'
    //   } else if (element.value.status == 'fail') {
    //     warning = 'Please enter correct hook url'
    //   }
    // break;
    // case "any":
    //   if (emptyMoreOne) {
    //     warning = 'There can only be one empty element in a list'
    //   } else if (!onMatch) {
    //     warning = 'List element has no target step'
    //   }
    // break;
    // case 'adReply':
    // case 'storyShare':
    // case 'storyMention':
    // case 'postShare':
    // case 'mediaShare':
    //   if (!onMatch) {
    //     warning = 'Element has no target step'
    //   }
    // break;
  }

  return warning
}

export default {
  types: {
    // weeks: 604800,
    // days: 86400,
    hours: 3600,
    minutes: 60,
    seconds: 1
  },

  secondsToTimeType(seconds) {
    if ( seconds / 3600 | 0 ) {
      return 'hours'
    } else if ( seconds % 3600 / 60 | 0 ) {
      return 'minutes'
    } else  {
      return 'seconds'
    }
  },

  timeFromSeconds(seconds, timeType) {
    switch (timeType) {
      // case 'weeks':
      //   return ( seconds / 604800 | 0 ) || 1
      //   break;
      // case 'days':
      //   return ( seconds % 604800 / 86400 | 0 ) || 1
      //   break;
      case 'hours':
        return ( seconds / 3600 | 0 ) || 1
        break;
      case 'minutes':
        return ( seconds % 3600 / 60 | 0 ) || 1
        break;
      default:
        return seconds
        break;
    }
  },

  hasCampaignWarning(campaign) {
    const { campaignElementValidate } = this;

    return campaign.steps.find((step, stepIndex) => {
      return step.elements.some(element => {
        // console.log(element, campaignElementValidate(element, Boolean(stepIndex)));

        return campaignElementValidate(element, Boolean(stepIndex));
      });
    });
  },

  campaignElementValidate,

  getOnMatchElement
}
