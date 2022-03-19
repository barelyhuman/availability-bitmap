/**
 * @typedef {object} NextAvailableFrom
 * @property {Date|null} from
 * @property {Number|null} availableFor
 */

export class AvailabilityMinuteRange {
  rangeMap = [];

  constructor() {
    for (let i = 0; i < 1440; i++) {
      this.rangeMap[i] = 0;
    }
  }

  /**
   * @private
   * @param {Date} date
   * @returns
   */
  _minOfDay(date) {
    const hour = new Date(date).getHours();
    const min = new Date(date).getMinutes();
    const _minOfDay = hour * 60 + min;
    return _minOfDay;
  }

  /**
   * @private
   * @param {Number} minOfDay
   * @returns
   */
  _timeFromMinOfDay(minOfDay) {
    const hour = Math.floor((minOfDay - 0) / 60);
    const min = minOfDay % 60;
    return new Date(new Date().setHours(hour, min));
  }

  /**
   *
   * @param {Date} start
   * @param {Date} end
   * @returns {Boolean} `true` is returned if it can successfully
   * block the given date range
   */
  blockTime(start, end) {
    const startMap = this._minOfDay(new Date(start));
    const endMap = this._minOfDay(new Date(end));

    for (let i = startMap; i < endMap; i += 1) {
      if (this.rangeMap[i] === 1) {
        return false;
      }
      this.rangeMap[i] = 1;
    }
    return true;
  }

  /**
   *
   * @param {Date} date - the date point to check from
   * @param {Number} minCount - minimum count for the
   * availability from the given date
   * @returns {NextAvailableFrom}
   */
  nextAvailableFrom(date, minCount) {
    const startMap = this._minOfDay(date);
    let count = 0;
    let point = 0;
    for (let i = startMap; i < this.rangeMap.length; i++) {
      if (this.rangeMap[i] === 1) {
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
      from: this._timeFromMinOfDay(point),
      availableFor: count,
    };
  }
}
