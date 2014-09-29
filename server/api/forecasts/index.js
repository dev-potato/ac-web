var _ = require('lodash');
var express = require('express');
var router = express.Router();
var request = require('request');
var caamlEndpoints = require('./forecast-caaml-endpoints.json');

var ratings = {
 "Low"         : "1",
 "Moderate"    : "2",
 "Considerable": "3",
 "High"        : "4",
 "Extreme"     : "5"
};

var colors = {
        '1:Low': '#52ba4a',
        '2:Moderate': '#fff300',
        '3:Considerable': '#f79218',
        '4:High': '#ef1c29',
        '5:Extreme': 'black',
        'N/A:No Rating' : 'blue'
};

//! Helper function to copy an array of { "-xlink:href": "ElevationLabel_Alp" } into a flat array
//! Adds the value after the _ to the array
var arrayCopy = function (array){
    var ret = [],
            i = 0,
            length = array.length,
            val = '';

    for (; i < length ; ++i){
        val    = array[i]['$']['xlink:href'];
        ret[i] = val.split("_")[1]; //! Split the string on the _ and return the value
    }

    return ret;
};

//! Populate a parks forecast object given caaml data that follows the parks canada format
var parksForecast = function (caaml, region){
        var caamlBulletin = caaml['CaamlData']['observations'][0]['Bulletin'][0];
        var caamlDangerRatings = caamlBulletin['bulletinResultsOf'][0]['BulletinMeasurements'][0]['dangerRatings'][0];
        var caamlProblems = caamlBulletin['bulletinResultsOf'][0]['BulletinMeasurements'][0]['avProblems'][0];

        var generateProblemArray = function( caamlProblems) {
            var ret = [];

            for (var i = 0; i < caamlProblems['AvProblem'].length; ++i) {
                ret[i] = { "type": caamlProblems['AvProblem'][i]['type'][0],
                                     "elevation": arrayCopy(caamlProblems['AvProblem'][i]['validElevation']),
                                     "aspect": arrayCopy(caamlProblems['AvProblem'][i]['validAspect']),
                                     "liklihood": caamlProblems['AvProblem'][i]['likelihoodOfTriggering'][0]['Values'][0]['typical'][0],
                                     "size": caamlProblems['AvProblem'][i]['expectedAvSize'][0]['Values'][0]['typical'][0],
                                     "comment": caamlProblems['AvProblem'][i]['comment'][0],
                                     "travelAndTerrainAdvice": caamlProblems['AvProblem'][i]['travelAdvisoryComment'][0] }
            }
            return ret;
        };

        var generateDangerRatingArray = function (caamlDangerRatings){
            var i = 0,
                    length =  3,
                    ret = [];

            for (; i < length; ++i){
                ret[i] =  {
                    "date": caamlDangerRatings['DangerRating'][i]['validTime'][0]['TimeInstant'][0]['timePosition'][0],
                    "dangerRating": {
                        "alp": caamlDangerRatings['DangerRating'][i]['mainValue'][0] + ":" + caamlDangerRatings['DangerRating'][i]['customData'][0]['DangerRatingDisplay'][0]['mainLabel'][0],
                        "tln": caamlDangerRatings['DangerRating'][i+3]['mainValue'][0] + ":" + caamlDangerRatings['DangerRating'][i+3]['customData'][0]['DangerRatingDisplay'][0]['mainLabel'][0],
                        "btl": caamlDangerRatings['DangerRating'][i+6]['mainValue'][0] + ":" + caamlDangerRatings['DangerRating'][i+6]['customData'][0]['DangerRatingDisplay'][0]['mainLabel'][0]
                    }
                };
            }
            return ret;
        };

        return {
            id: caamlBulletin['$']['gml:id'],
            region: region,
            dateIssued: caamlBulletin['validTime'][0]['TimePeriod'][0]['beginPosition'][0],
            validUntil: caamlBulletin['validTime'][0]['TimePeriod'][0]['endPosition'][0],
            bulletinTitle: caamlBulletin['bulletinResultsOf'][0]['BulletinMeasurements'][0]['bulletinTitle'][0],
            highlights: caamlBulletin['bulletinResultsOf'][0]['BulletinMeasurements'][0]['highlights'][0],
            confidence: (function (confidence) { 
                return confidence['confidenceLevel'][0] + ' - ' + confidence['comment'][0];
            })(caamlBulletin['bulletinResultsOf'][0]['BulletinMeasurements'][0]['bulletinConfidence'][0]['Components'][0]),
            dangerRatings: generateDangerRatingArray(caamlDangerRatings),
            problems: generateProblemArray(caamlProblems),
            avalancheSummary: caamlBulletin['bulletinResultsOf'][0]['BulletinMeasurements'][0]['avActivityComment'][0],
            snowpackSummary: caamlBulletin['bulletinResultsOf'][0]['BulletinMeasurements'][0]['snowpackStructureComment'][0],
            weatherForecast: caamlBulletin['bulletinResultsOf'][0]['BulletinMeasurements'][0]['wxSynopsisComment'][0]
        };
}; //! end parks forecast

var avalancheCaForecast = function (caaml, region){
        var caamlBulletin      = caaml['caaml:ObsCollection']['caaml:observations'][0]['caaml:Bulletin'][0];
        var caamlDangerRatings = caamlBulletin['caaml:bulletinResultsOf'][0]['caaml:BulletinMeasurements'][0]['caaml:dangerRatings'][0];
        var caamlProblems      = caamlBulletin['caaml:bulletinResultsOf'][0]['caaml:BulletinMeasurements'][0]['caaml:avProblems'][0];

        var generateProblemArray = function(caamlProblems) {
            var ret = [];

            for (var i = 0; i < caamlProblems['caaml:avProblem'].length; ++i) {
                ret[i] = { "type": caamlProblems['caaml:avProblem'][i]['caaml:type'][0],
                                     "elevation": arrayCopy(caamlProblems['caaml:avProblem'][i]['caaml:validElevation']),
                                     "aspect": arrayCopy(caamlProblems['caaml:avProblem'][i]['caaml:validAspect']),
                                     "liklihood": caamlProblems['caaml:avProblem'][i]['caaml:likelihoodOfTriggering'][0]['caaml:Values'][0]['caaml:typical'][0],
                                     "size": caamlProblems['caaml:avProblem'][i]['caaml:expectedAvSize'][0]['caaml:Values'][0]['caaml:typical'][0],
                                     "comment": caamlProblems['caaml:avProblem'][i]['caaml:comment'][0],
                                     "travelAndTerrainAdvice": caamlProblems['caaml:avProblem'][i]['caaml:travelAdvisoryComment'][0] }
            }

            return ret;
        };

        var generateDangerRatingArray = function (caamlDangerRatings){
            var i = 0,
                    length =  caamlDangerRatings ['caaml:DangerRating'].length,
                    ret = [];

            for (; i < length; ++i){
                ret[i] =  {
                    "date": caamlDangerRatings['caaml:DangerRating'][i]['gml:validTime'][0]['gml:TimeInstant'][0]['gml:timePosition'][0],
                    "dangerRating": {
                        "alp": ratings[caamlDangerRatings['caaml:DangerRating'][i]['caaml:dangerRatingAlpValue'][0]] + ":" +
                                     caamlDangerRatings['caaml:DangerRating'][i]['caaml:dangerRatingAlpValue'][0],

                        "tln": ratings[caamlDangerRatings['caaml:DangerRating'][i]['caaml:dangerRatingTlnValue'][0]] + ":" +
                                     caamlDangerRatings['caaml:DangerRating'][i]['caaml:dangerRatingTlnValue'][0],

                        "btl": ratings[caamlDangerRatings['caaml:DangerRating'][i]['caaml:dangerRatingBtlValue'][0]] + ":" +
                                     caamlDangerRatings['caaml:DangerRating'][i]['caaml:dangerRatingBtlValue'][0]
                    }
                };
            }

            return ret;
        };

        return {  
            id: caamlBulletin['$']['gml:id'],
            region: region,
            dateIssued: caamlBulletin['gml:validTime'][0]['gml:TimePeriod'][0]['gml:beginPosition'][0],
            validUntil: caamlBulletin['gml:validTime'][0]['gml:TimePeriod'][0]['gml:endPosition'][0],
            bulletinTitle: caamlBulletin['caaml:bulletinResultsOf'][0]['caaml:BulletinMeasurements'][0]['caaml:bulletinTitle'][0],
            highlights: caamlBulletin['caaml:bulletinResultsOf'][0]['caaml:BulletinMeasurements'][0]['caaml:highlights'][0],
            confidence: (function (confidence) { 
                return confidence['caaml:confidenceLevel'][0];
            })(caamlBulletin['caaml:bulletinResultsOf'][0]['caaml:BulletinMeasurements'][0]['caaml:bulletinConfidence'][0]['caaml:Components'][0]),
            dangerRatings: generateDangerRatingArray(caamlDangerRatings),
            problems: generateProblemArray(caamlProblems),
            avalancheSummary: caamlBulletin['caaml:bulletinResultsOf'][0]['caaml:BulletinMeasurements'][0]['caaml:avActivityComment'][0],
            snowpackSummary: caamlBulletin['caaml:bulletinResultsOf'][0]['caaml:BulletinMeasurements'][0]['caaml:snowpackStructureComment'][0],
            weatherForecast: caamlBulletin['caaml:bulletinResultsOf'][0]['caaml:BulletinMeasurements'][0]['caaml:wxSynopsisComment'][0],
         };
}; //! end av ca forecast

var getEndpointUrl = function (region, date){
    var url = caamlEndpoints[region].url;

    if(!date){
        today = new Date;
        //date = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
        date = "2013-03-01"; //! for testing purposes use a day with actual data
    }

    if (caamlEndpoints[region].type === "parks") {
        url = [url, date].join('&d=');
    }
    else { //assume avalanche ca
        url = [url, date].join('/');
    }

    //debug(url);
    return url;
}

//! asynchronous function
var getForecast = function (region, url, successCallback, errorCallback){

    var parseString = require('xml2js').parseString;
    this.json = [];

    //debug("getting forecast from", url);
    request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                    parseString(body, function (err, caaml) {

                        if (caaml) {

                            if (caamlEndpoints[region].type === "parks") { //! Parks region
                                this.json = parksForecast(caaml, region);
                                successCallback(this.json);
                            }
                            else if (caamlEndpoints[region].type === "ac") { //! Avalanche ca region
                                this.json = avalancheCaForecast(caaml, region);
                                successCallback(this.json);
                            }
                            else { //! no feed available
                                errorCallback("Invalid region: " + region);
                            }

                        }
                        else {
                            errorCallback("parsed data invalid");
                        }

                    });
            } else {
                    //debug("error parsing xml");
            }
    });

};

router.get('/:region/title.json', function(req, res) {
        var region = req.params.region,
                date   = req.query.date;

        if (caamlEndpoints[region]){

            //var bulletin = _(bulletins).find(function (b) { return b.region == req.params.region; });
            var endpointUrl = getEndpointUrl(region, date);
            var successCallback = function(forecast) {

                if(forecast){
                    //debug("got json forecast");
                    res.json(forecast.bulletinTitle);
                }
                else{
                    //debug("null forecast returned");
                    res.send(500);
                }

            };

            var errorCallback = function (msg){
                //debug(msg);
                res.send(500);
            }

            getForecast(region, endpointUrl, successCallback, errorCallback);

        }
        else{
            //debug("invalid region: " + region);
            res.send(404);
        }
});

router.get('/:region/danger-rating-icon.svg', function(req, res) {
        var region = req.params.region,
                date   = req.query.date;

        if (caamlEndpoints[region]){

            //var bulletin = _(bulletins).find(function (b) { return b.region == req.params.region; });
            var endpointUrl = getEndpointUrl(region, date);
            var successCallback = function(forecast) {

                if(forecast){
                    //debug("got json forecast");
                    var todaysRating = forecast.dangerRatings[0].dangerRating;
                    //debug("got ratings " , todaysRating);
                    var ratings = {
                            alp: colors[todaysRating.alp],
                            tln: colors[todaysRating.tln],
                            btl: colors[todaysRating.btl]
                    };
                    if (req.query.label) ratings.region = forecast.region;
                    //debug("generated danger rating icon " , ratings);
                    res.header('Cache-Control', 'no-cache');
                    res.header('Content-Type', 'image/svg+xml');

                    res.render('danger-icon', ratings);
                }
                else{
                    //debug("null forecast returned");
                    res.send(500);
                }
            };

            var errorCallback = function (msg){
                //debug(msg);
                res.send(500);
            }

            getForecast(region, endpointUrl, successCallback, errorCallback);

        }
        else{
            //debug("invalid region: " + region);
            res.send(404);
        }
});

router.get('/:region.:format', function(req, res) {

        var region = req.params.region,
                date   = req.query.date,
                forecast;

        if (caamlEndpoints[region]){ // check valid region
            var endpointUrl = getEndpointUrl(region,date);

            switch(req.params.format){

                    case 'xml':
                            req.pipe(request(endpointUrl)).pipe(res);
                            break;

                    case 'json':

                            var successCallback = function(forecast) {

                                if(forecast){
                                    //debug("got json forecast");
                                    res.json(forecast);
                                }
                                else{
                                    //debug("null forecast returned");
                                    res.send(500);
                                }
                            };

                            var errorCallback = function (msg){
                                //debug(msg);
                                res.send(500);
                            }

                            getForecast(region, endpointUrl, successCallback, errorCallback);
                            break;

                    default:
                            //debug("invalid forecast format");
                            res.send(404);
                            break;
            }
        }
        else {
            //debug("invalid region: " + region);
            res.send(404);
        }


});

var nowcastColors = {
        iconFill: {
            '1:Low': '#52ba4a',
            '2:Moderate': '#fff300',
            '3:Considerable': '#f79218',
            '4:High': '#ef1c29',
            '5:Extreme': '#ef1c29',
            'N/A:No Rating' : 'white'
        },
        bannerFill: {
            '1:Low': '#52ba4a',
            '2:Moderate': '#fff300',
            '3:Considerable': '#f79218',
            '4:High': '#ef1c29',
            '5:Extreme': 'black',
            'N/A:No Rating' : 'white'
        },
        bannerStroke: {
            '1:Low': 'black',
            '2:Moderate': 'black',
            '3:Considerable': 'black',
            '4:High': 'black',
            '5:Extreme': 'red',
            'N/A:No Rating' : 'black'
        },
        textFill: {
            '1:Low': 'black',
            '2:Moderate': 'black',
            '3:Considerable': 'black',
            '4:High': 'black',
            '5:Extreme': 'white',
            'N/A:No Rating' : 'black'
        }
};

router.get('/:region/nowcast.svg', function(req, res) {
        var region = req.params.region,
                date   = req.query.date;

        if (caamlEndpoints[region]){

            //var bulletin = _(bulletins).find(function (b) { return b.region == req.params.region; });
            var endpointUrl = getEndpointUrl(region, date);
            var successCallback = function(forecast) {

                if(forecast){
                    //debug("got json forecast");
                    var todaysRating = forecast.dangerRatings[0].dangerRating;
                    //debug("got ratings " , todaysRating);
                    var ratings = {
                            alp: {
                                rating: todaysRating.alp.replace(':', ' - '),
                                iconFill: nowcastColors.iconFill[todaysRating.alp],
                                bannerFill: nowcastColors.bannerFill[todaysRating.alp],
                                bannerStroke: nowcastColors.bannerStroke[todaysRating.alp],
                                textFill: nowcastColors.textFill[todaysRating.alp]
                            },
                            tln: {
                                rating: todaysRating.tln.replace(':', ' - '),
                                iconFill: nowcastColors.iconFill[todaysRating.tln],
                                bannerFill: nowcastColors.bannerFill[todaysRating.tln],
                                bannerStroke: nowcastColors.bannerStroke[todaysRating.tln],
                                textFill: nowcastColors.textFill[todaysRating.tln]
                            },
                            btl: {
                                rating: todaysRating.btl.replace(':', ' - '),
                                iconFill: nowcastColors.iconFill[todaysRating.btl],
                                bannerFill: nowcastColors.bannerFill[todaysRating.btl],
                                bannerStroke: nowcastColors.bannerStroke[todaysRating.btl],
                                textFill: nowcastColors.textFill[todaysRating.btl]
                            },
                    };
                    console.log(todaysRating);
                    if (req.query.label) ratings.region = forecast.region;
                    //debug("generated danger rating icon " , ratings);
                    res.header('Cache-Control', 'no-cache');
                    res.header('Content-Type', 'image/svg+xml');

                    res.render('forecasts/nowcast', ratings);
                }
                else{
                    //debug("null forecast returned");
                    res.send(500);
                }
            };

            var errorCallback = function (msg){
                //debug(msg);
                res.send(500);
            }

            getForecast(region, endpointUrl, successCallback, errorCallback);

        }
        else{
            //debug("invalid region: " + region);
            res.send(404);
        }
});

module.exports = router;
