import moment from 'moment'
import store from '../../src/store'

const getOnMatchElement = (element) => {
  const { type, displaySettings } = element;
  let matchElement = element;

  if (!['group', 'linker', 'rule'].includes(type)) return;

  if (type === 'group' && !(displaySettings && (displaySettings.subType === 'settings' || displaySettings.type === 'zapier')))

  if (type === 'group') {
    matchElement = element.elements.find(element => element.type === 'rule');
  }

  if (matchElement.condition && ['postShare', 'storyMention', 'storyShare'].includes(matchElement.condition.value) &&  matchElement.onMatch && matchElement.onMatch.elements) {
    return matchElement.onMatch.elements[0];
  } else if (['linker', 'rule'].includes(type)) {
    return matchElement;
  }

  return matchElement;
}
const campaignElementValidate = (element, isEntry, parentDisplaySettings) => {
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
          if (!text || !text.trim()) {
            warning = 'Enter text'
          } else if (new Blob([text]).size > 1000) {
            warning = 'Message text is too long'
          }
          break;
      }
      break;
    case 'rule':
      const matchElement = getOnMatchElement(element);

      if (!parentDisplaySettings || parentDisplaySettings.subType === 'trigger') {
        const { growthTools, triggers } = store.state.dhAccount.flowBuilderSettings;
        const hasEmptyKeywords = (isEntry ? growthTools : triggers).messageTypes.includes('anyMessage');

        if (!matchElement || !matchElement.onMatch) {
          warning = 'Element has no target step'
        }

        if (element.condition.value === 'storyMention' && isEntry && (element.onMatch.elements && !element.onMatch.elements[0].condition.value.length)) {
          warning = 'Please specify at least one hashtag'
        }

        if (parentDisplaySettings && parentDisplaySettings.type === 'keywords' && !hasEmptyKeywords && !element.condition.value.length) {
          warning = 'Enter keywords'
        }
      }

      break;
    case 'group':
      if (['trigger'].includes(element.displaySettings.subType)) {
        element.elements.some(elementItem => {
          warning = campaignElementValidate(elementItem, isEntry, element.displaySettings);

          return warning;
        })
      }
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

  permission: {
    DASHBOARD: 100,
    CAMPAIGN: 200,
    BROADCAST: 300,
    LIVE_CHAT: 400,
    AUDIENCE: 500
  },

  isEmail(str) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return new RegExp(regex).test(str);
  },

  copyToClipboard(value) {
    const input = document.createElement("input");

    input.setAttribute("value", value);
    input.style.position = "absolute";
    input.style.opacity = 0;
    input.style.pointerEvents = "none";
    document.body.appendChild(input);
    input.focus();
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
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

  fillDates(begin, end, granularity) {
    const options = {
      month: 2592000,
      day: 86400,
      hour: 3600
    };

    const getDatesInRange = function() {
      const dates = [];

      let currDate = moment(begin).startOf('day');
      let lastDate = moment(end).startOf('day');
      dates.push(currDate.clone().toDate());

      while(currDate.add(1, 'days').diff(lastDate) < 0) {
          dates.push(currDate.clone().toDate());
      }
      dates.push(lastDate.clone().toDate());

      return dates;
    };

    const getDatesInRangeMonth = function() {
      let startDate = moment(begin);
      let endDate = moment(end);
      let out = [];

      while (startDate.isBefore(endDate)) {
        startDate = startDate.add(1, 'month');
        out.push(startDate.startOf("day").toDate());
      }

      return out;
    };

    const getDatesInRangeByGranularity = function() {
      let dates = [];
      if (granularity === options.month) {
        dates = getDatesInRangeMonth(begin, end);
      } else {
        dates = getDatesInRange(moment(begin).subtract(1, 'day'), end);
      }

      return dates;
    };

    return {
      Fill: function(source) {
        const granularityValue = granularity === options.month ? "month" : "day";
        const dates = getDatesInRangeByGranularity();
        return dates.reduce((acc, dateTime) => {
            const value = source.find(s => moment(dateTime).startOf('day').isSame(s.dateTime, granularityValue));
            if (value) {
              acc.push(value);
            } else {
              acc.push({
                value: "0",
                dateTime: moment(dateTime).startOf('day').toISOString(),
              })
            }
            return acc;
          }, []);
      },

      Dates: getDatesInRangeByGranularity
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
      return (step.displaySettings && step.displaySettings.hasOwnProperty('columnIndex')) || step.elements.some(element => campaignElementValidate(element, !Boolean(stepIndex)))
    });
  },

  campaignElementValidate,

  getOnMatchElement
}
