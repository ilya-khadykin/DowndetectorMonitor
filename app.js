var DowndetectorMonitor = require('./lib/downdetector-monitor');
var config = require('./config.js')

var monitors = [];
for (i in config.checkList) {
    var monitor = new DowndetectorMonitor(config.checkList[i].url, config.checkList[i].interval);
    monitor.startMonitoring();
    monitors.push(monitor)
};