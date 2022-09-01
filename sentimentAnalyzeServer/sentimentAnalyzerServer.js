// Default App Packages
const express = require('express');
const app = new express();
const dotenv = require('dotenv');
const cors_app = require('cors'); // This tells the server to allow cross origin references
// IBM Cloud NLU Packages
const NLU = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

/*This tells the server to use the client 
folder for all static resources*/
app.use( express.static('client') );
app.use( cors_app() );

// .env NLU-API config
dotenv.config();
const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

function getNLUInstance() {
    /*Type the code to create the NLU instance and return it.
    You can refer to the image in the instructions document
    to do the same.*/
    const nlu = new NLU({
        version: '2022-04-07',
        authenticator: new IamAuthenticator( {apikey: api_key} ),
        serviceUrl: api_url
    });

    return nlu;
}

// Create new NLU instance to be used for all endpoints.
const nlu = getNLUInstance();

//The default endpoint for the webserver
app.get( '/', (req, res) => { res.render('index.html'); } );

/* EMOTION */
//The endpoint for the webserver ending with /url/emotion
app.get('/url/emotion', (req, res) => {
    //Extract the url passed from the client through the request object
    let urlToAnalyze = '.' + req.url;
    console.log('URL being analyzed:', urlToAnalyze);

    const analyzeParams = {
        'url': urlToAnalyze,
        'features': {
            'keywords': {
                'emotion': true,
                'limit': 1
            }
        },
        'returnAnalyzedText': true
    }
     
    nlu.analyze(analyzeParams)
    .then(analysisResults => { //Please refer to the image to see the order of retrieval
        console.log(analysisResults.result); // For debugging
        return res.send(analysisResults.result.keywords[0].emotion, null, 2);
    })
    .catch(err => {
        return console.log('Could not do desired operation | ' + err);
    });
});

//The endpoint for the webserver ending with /text/emotion
app.get('/text/emotion', (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
                'emotion': true,
                'limit': 1
            }
        },
        'returnAnalyzedText': true
    }
     
    nlu.analyze(analyzeParams)
    .then(analysisResults => { //Please refer to the image to see the order of retrieval
        console.log(analysisResults.result); // For debugging
        return res.send(analysisResults.result.keywords[0].emotion, null, 2);
    })
    .catch(err => {
        return console.log('Could not do desired operation | ' + err);
    });
});

/* SENTIMENT */
//The endpoint for the webserver ending with /url/sentiment
app.get('/url/sentiment', (req, res) => {
    let urlToAnalyze = '.' + req.url;
    console.log('URL being analyzed:', urlToAnalyze);

    const analyzeParams = {
        'url': urlToAnalyze,
        'features': {
            'keywords': {
                'sentiment': true,
                'limit': 1
            }
        },
        'returnAnalyzedText': true
    }
     
    nlu.analyze(analyzeParams)
    .then(analysisResults => { //Please refer to the image to see the order of retrieval
        return res.send(analysisResults.result.keywords[0].sentiment, null, 2);
    })
    .catch(err => {
        return console.log('Could not do desired operation | ' + err);
    });
});

app.get('/text/sentiment', (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
                'sentiment': true,
                'limit': 1
            }
        },
        'returnAnalyzedText': true
    }
     
    nlu.analyze(analyzeParams)
    .then(analysisResults => { //Please refer to the image to see the order of retrieval
        return res.send(analysisResults.result.keywords[0].sentiment, null, 2);
    })
    .catch(err => {
        return console.log('Could not do desired operation | ' + err);
    });
});


let server = app.listen(8080, () => {
    console.log('Listening', server.address().address, server.address().port)
})
