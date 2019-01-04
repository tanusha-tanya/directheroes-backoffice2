

export default {
  types: {
    weeks: 604800,
    days: 86400,
    hours: 3600,
    minutes: 60,
    seconds: 1
  },

  secondsToTimeType(seconds) {
    if ( seconds / 604800 | 0 ) {
      return 'weeks'
    } else if ( seconds % 604800 / 86400 | 0 ) {
      return 'days'
    } else if ( seconds % 86400 / 3600 | 0 ) {
      return 'hours'
    } else if ( seconds % 3600 / 60 | 0 ) {
      return 'minutes'
    } else  {
      return 'seconds'
    }
  },

  timeFromSeconds(seconds, timeType) {
    switch (timeType) {
      case 'weeks':
        return ( seconds / 604800 | 0 ) || 1
        break;
      case 'days':
        return ( seconds % 604800 / 86400 | 0 ) || 1
        break;
      case 'hours':
        return ( seconds % 86400 / 3600 | 0 ) || 1
        break;
      case 'minutes':
        return ( seconds % 3600 / 60 | 0 ) || 1
        break;
      default:
        return seconds
        break;
    }
  }
}