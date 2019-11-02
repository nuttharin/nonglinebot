const express = require('express');
const line = require('@line/bot-sdk');
const mysql = require('mysql')

require('dotenv').config();

const app = express();

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
})

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
})

const config = {
    channelAccessToken: 'dpCgQdEGIbWJLxet0efql4UWyC2pXjupzEMpcqvk6uWlzKu7kreeSaay0Ghz5cwCWUp32LDHmzsUQGzOuyMY0tlS0c/NG51wHmBcficS99bYwmdtRjZbMWISp3WGdSEXLt+34p+hsHFEmVu4ag9W2AdB04t89/1O/w1cDnyilFU=',
    channelSecret: '69e8910e0356694205464aa88367c0e6'
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

function handleEvent(event) {

    console.log(event);
    if (event.type === 'message' && event.message.type === 'text') {
        handleMessageEvent(event);
    } else {
        return Promise.resolve(null);
    }
}

function handleMessageEvent(event) {
    var msg = {
        type: 'text',
        text: 'สวัสดี'
    };

    var eventText = event.message.text.toLowerCase();

    if (eventText === 'image') {
        msg = {
            'type': 'image',
            'originalContentUrl': 'https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100',
            'previewImageUrl': 'https://images.performgroup.com/di/library/GOAL/a6/bb/fifa-18-ronaldo_lx3r88bpjpk91re36ukdgomrj.jpg?t=2027563652&w=620&h=430'
        }
    } 
    else if(eventText === 'test')
    {
        msg = {
            type: 'text',
            text: 'Test line api'
        }
    }
    else if (eventText === 'template button') {
        msg = {
            "type": "template",
            "altText": "this is a buttons template",
            "template": {
                "type": "buttons",
                "thumbnailImageUrl": "https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100",
                "title": "Menu",
                "text": "Please select",
                "actions": [{
                    "type": "postback",
                    "label": "Buy",
                    "data": "action=buy&itemid=123"
                }, {
                    "type": "postback",
                    "label": "Add to cart",
                    "data": "action=add&itemid=123"
                }, {
                    "type": "uri",
                    "label": "View detail",
                    "uri": "http://example.com/page/123"
                }]
            }
        }
    } 
  

    return client.replyMessage(event.replyToken, msg);
}

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'));
});