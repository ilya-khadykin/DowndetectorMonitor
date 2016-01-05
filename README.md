# DowndetectorMonitor
The app constuntly requests RSS feed of alerts from https://pro.downdetector.com/ and sends notifications to Slack chatroom if a new alert was detected

## How it works
The app is written in javascript on top of node.js platform. It requires the following modules to work:
- feedparser,
- request

It's possible to monitor several services in one application, you just have to edit `config.js` file (see `config.js.example` to learn used format) and provide urls to downdetector RSS (which is used for detecting alerts) and time interval in minutes between checks (it determines how often the app will request and check RSS feed for updates, 5 is recommended value) for your services. Example of a valid list of metrics (change xxxxxx according to your downdetector RSS urls):
```javascript
var checkList = [
    {
        url: 'https://dashboard.downdetector.com/events/xxxxxx/101:161-3683.xml',
        interval: 5
    },
    {
        url: 'https://dashboard.downdetector.com/events/xxxxxx/101:161-3682.xml',
        interval: 5
    },
    {
        url: 'https://dashboard.downdetector.com/events/xxxxxx/101:161-3684.xml',
        interval: 5
    },
    {
        url: 'https://dashboard.downdetector.com/events/xxxxxx/101:161-3677.xml',
        interval: 5
    }
]
```

## Installation
Use **npm**, issue the following command in the app`s directory:
```shell
npm install
```
It will automatically install any dependent packages for you.

You can now run the app using the following command iside app's directory:
```shell
node app.js
```

## To Do
- add more sophisticated error handling code for data requesting functions as well as user's input;
- ensure that the app will run on unix-like operation systems without issues;

## Implemented
- core functionality (RSS feed retrival, parsing, analysis and notification about new events in it);
- multiple metrcis support, you can monitor any reasonable number of downdetector services in one application;
- separated the configuration data from application code, separate `config.js` file was created for that purpose;