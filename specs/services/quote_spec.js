'use strict';

var utils = require('../../src/utils');
var moment = require('moment');

var services = require('../../src/services');
var repositories = require('../../src/repositories');
var Configuration = require('../../src/config').Configuration;
var FixedMomentClock = require('./fixed_moment_clock');
var QuoteService = services.QuoteService;
var Countries = repositories.Countries;
var Covers = repositories.Covers;

(function disableLogs() {
    console.info = console.error = function() {};
})();

describe('Quote Service', function() {
    var quoteService, configuration, countries, covers, today, clock;

    beforeEach(function(){
        configuration = new Configuration();
        countries = new Countries(configuration);
        covers = new Covers();
        today = moment('2024-04-05').toDate();
        clock = new FixedMomentClock(today);
        quoteService = new QuoteService(countries, covers, clock);
    });

    it('should send quote to seller', function() {
        spyOn(utils, 'post');
        var quote = {};
        var cashUpdater = function() {};
        var onError = function() {};

        quoteService.send({hostname: 'localhost', port: '3000', path: '/test'}, quote, cashUpdater, onError);

        expect(utils.post).toHaveBeenCalledWith('localhost', '3000', '/test/quote', quote, cashUpdater, onError);
    });

    it('should create quote with countries of Europe', function() {
        var quote = quoteService.create();

        expect(countries.fromEurope).toContain(quote.country);
    });

    it('should create quote with departure date later than at least 10 days after today', function() {
        var quote = quoteService.create();

        expect(moment(quote.departureDate).diff(moment(today), 'days')).toBeGreaterThan(9);
    });

    it('should create quote with departure date earlier than at least 100 days after today', function() {
        var quote = quoteService.create();

        expect(moment(quote.departureDate).diff(moment(today), 'days')).toBeLessThan(101);
    });

    it('should create quote with return date later than at least 7 days after departure date', function() {
        var quote = quoteService.create();

        expect(moment(quote.returnDate).diff(moment(quote.departureDate), 'days')).toBeGreaterThan(6)
    });

    it('should create quote with return date later than at most 30 days after departure date', function() {
        var quote = quoteService.create();

        expect(moment(quote.returnDate).diff(moment(quote.departureDate), 'days')).toBeLessThan(31)
    });

    it('should create quote with 1 to 6 travellers', function() {
        var quote = quoteService.create()

        expect(quote.travellers.length).toBeGreaterThan(0)
        expect(quote.travellers.length).toBeLessThan(7)
    });

    it('should create quote with cover', function () {
        var quote = quoteService.create()

        expect(covers.all).toContain(quote.cover)
    });

    it('should not validate bill when total field is missing', function() {
        expect(function(){quoteService.validateBill({})}).toThrow('The field \"total\" in the response is missing.')
    });

    it('should not validate bill when total is not a number', function() {
        expect(function(){quoteService.validateBill({total: 'NaN'})}).toThrow('\"Total\" is not a number.')
    });

    it('should calculate the sum of the quote', function() {
        spyOn(configuration, 'all').andReturn({});
        var quote = {
            country: 'IT', 
            departureDate: today,
            returnDate: clock.addDays(today, 1),
            travellers: [1, 1, 1],
            cover: 'premium'
        }

        var bill = quoteService.bill(quote);

        expect(bill).toEqual({total: countries.taxRule('IT').applyTax(1.8 * 3) * covers.getRateOf('premium')});
    });
});