function _minOfDay(date: Date) {
  const d = new Date(date);
  const hour = d.getHours();
  const min = d.getMinutes();
  const minOfDay = hour * 60 + min;
  return minOfDay;
}

function _timeFromMinOfDay(minOfDay: number) {
  const hour = Math.floor((minOfDay - 0) / 60);
  const min = minOfDay % 60;
  return new Date(new Date().setHours(hour, min));
}

function blockTime(start: Date, end: Date) {
  const ctx = this || {};
  const startMap = _minOfDay(new Date(start));
  const endMap = _minOfDay(new Date(end));

  for (let i = startMap; i < endMap; i += 1) {
    if (ctx.__rmap[i] === 1) {
      return false;
    }
    ctx.__rmap[i] = 1;
  }
  return true;
}

function nextAvailableFrom(date: Date, minCount: number) {
  const ctx = this || {};
  const startMap = _minOfDay(date);
  let count = 0;
  let point = 0;
  for (let i = startMap; i < ctx.__rmap.length; i++) {
    if (ctx.__rmap[i] === 1) {
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

export function createAvailabilityMinuteRange() {
  return {
    __rmap: new Array(1440),
    blockTime,
    nextAvailableFrom,
  };
}
