function _minOfDay(date) {
  const d = new Date(date);
  const hour = d.getHours();
  const min = d.getMinutes();
  const minOfDay = hour * 60 + min;
  return minOfDay;
}

function _timeFromMinOfDay(minOfDay) {
  const hour = Math.floor((minOfDay - 0) / 60);
  const min = minOfDay % 60;
  return new Date(new Date().setHours(hour, min));
}

/**
 *
 * @param {Date} start
 * @param {Date} end
 * @returns {Boolean}
 */
function blockTime(start, end) {
  const ctx = this || {};
  const startMap = _minOfDay(new Date(start));
  const endMap = _minOfDay(new Date(end));

  for (let i = startMap; i < endMap; i += 1) {
    if (ctx.rmap[i] === 1) {
      return false;
    }
    ctx.rmap[i] = 1;
  }
  return true;
}

/**
 *
 * @param {Date} date
 * @param {number} minCount
 * @returns
 */
function nextAvailableFrom(date, minCount) {
  const ctx = this || {};
  const startMap = _minOfDay(date);
  let count = 0;
  let point = 0;
  for (let i = startMap; i < ctx.rmap.length; i++) {
    if (ctx.rmap[i] === 1) {
      count = 0;
      continue;
    }
    if (!point) {
      point = i;
    }
    count += 1;
  }

  if (count < minCount) {
    return {
      from: null,
      availableFor: null,
    };
  }

  return {
    from: _timeFromMinOfDay(point),
    availableFor: count,
  };
}

export class AvailabilityMinuteRange {
  rmap = [];
  /**
   * @type {blockTime}
   */
  blockTime;
  /**
   * @type {nextAvailableFrom}
   */
  nextAvailableFrom;

  constructor() {
    this.blockTime = blockTime.bind(this);
    this.nextAvailableFrom = nextAvailableFrom.bind(this);
  }
}
