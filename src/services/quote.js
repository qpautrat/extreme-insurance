var colors = require('colors')
var _ = require('lodash')
var utils = require('../utils')

function QuoteService (countries, covers, clock) {
  this.countries = countries
  this.covers = covers
  this.clock = clock
}

QuoteService.prototype = (function () {
  return {
    send: function (seller, quote, cashUpdater, logError) {
      console.info(colors.grey('Sending quote ' + utils.stringify(quote) + ' to seller ' + utils.stringify(seller)))
      utils.post(seller.hostname, seller.port, seller.path + '/quote', quote, cashUpdater, logError)
    },
    create:function () {
      var country = this.countries.randomOne()
      var departureDate = this.clock.randomDepartureDate()
      var nbTravellers = _.random(1, 6)
      var travellers = []
      for (var traveller = 0; traveller < nbTravellers; traveller++) {
        travellers[traveller] = 1
      }

      return {
        country: country,
        departureDate: departureDate,
        returnDate: this.clock.addDays(departureDate, _.random(7, 30)),
        travellers: travellers,
        cover: this.covers.randomOne()
      }
    },
    bill: function (quote) {
      var sum = 1.8 * this.clock.days(quote.returnDate, quote.departureDate) * quote.travellers.length
      sum *= this.covers.getRateOf(quote.cover)
      var taxRule = this.countries.taxRule(quote.country)
      sum = taxRule.applyTax(sum)

      return { total: sum }
    },
    validateBill: function (bill) {
      if (!_.has(bill, 'total')) {
        throw new Error('The field "total" in the response is missing.')
      }

      if (!_.isNumber(bill.total)) {
        throw new Error('"Total" is not a number.')
      }
    }
  }
})()

module.exports = QuoteService