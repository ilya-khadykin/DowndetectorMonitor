var FeedParser = require('feedparser')
  , request = require('request');
var config = require('../config.js');

var DowndetectorMonitor = function (urlToDowndetectorRss, refreshIntervalInMinutes) {
    this.urlToDowndetectorRss = urlToDowndetectorRss;
    this.refreshIntervalInMinutes = refreshIntervalInMinutes;
    var self = this;

    this.startMonitoring = function () {
        self.getRss(self.urlToDowndetectorRss); // Perform the initial check right away
        setInterval(function () {
            self.getRss(self.urlToDowndetectorRss);
        }, self.refreshIntervalInMinutes * 60 * 1000); //
    } // this.startMonitoring()

    this.getRss = function (urlToRss) {
        var req = request({
            url: urlToRss
        })
        , feedparser = new FeedParser();

        req.on('error', function (error) {
            // handle any request errors
            console.log('Cannot retrieve requested RSS: ' + error);
        });
        req.on('response', function (res) {
            var stream = this;

            if (res.statusCode != 200) {
                return console.log('Bad status code from Downdetector while requesting RSS feed');
            };

            stream.pipe(feedparser);
        });

        feedparser.on('error', function(error) {
            // always handle errors
            console.log('An error occured wile parsing RSS feed: ' + error);
        });
        feedparser.on('readable', function() {
            var stream = this
            , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
            , item;

            while (item = stream.read()) {
                var timeDiff = Math.abs(new Date(Date.now()).getTime() - item.date.getTime());
                var msg = item.title + '\n' + item.summary + '\n' + item.date;
                if (timeDiff <= self.refreshIntervalInMinutes * 60 * 1000) {
                    // your code for sending alert notification
                    console.log(msg);
                    console.log('\nALERT CONDITIONS WERE MET, SENDING NOTIFICATION TO SLACK\n');
                    self.postToSlack(msg);
                } // if timeDiff
            } // while (item = stream.read())
        });
    } // getRss()


    this.postToSlack = function (msg) {
        var payload = 'payload={"text": "' + msg + '", "channel": "#noc-alerts", "username": "Downdetector Notifications", "icon_emoji": ":expressionless:"}';

        request.post({
            url: config.slack_url,
            form: payload },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    console.log('Successfully send POST request to Slack\n');
                } else {
                    console.log('Server status code: ', response.statusCode);
                    console.log(body);
                    console.log('An error occurred while sending HTTP POST request to Slack ' + error);
                }
            }
            );
    } // postToSlack()
} // DowndetectorMonitor()

module.exports = DowndetectorMonitor;