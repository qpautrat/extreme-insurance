var moment = require('moment')
var _ = require('lodash')

function MomentClock() {
  this.date = moment().toDate();
}

module.exports = MomentClock

var clock = MomentClock.prototype

clock.randomDepartureDate = function () {
  return moment(this.date).add(_.random(10, 100), 'days').toDate()
}

clock.addDays = function (date, days) {
  return moment(date).add(days, 'days').toDate()
}

clock.days = function (date1, date2) {
  return moment(date1).diff(moment(date2), 'days')
}