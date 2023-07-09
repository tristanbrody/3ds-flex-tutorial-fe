# 3DS Flex Tutorial

### What it does

- Demonstrates an integration to Worldpay's [3DS Flex with Cardinal API](https://developerengine.fisglobal.com/apis/wpg/directintegration/cardinalsecuretest/) in the test environment

### Intended audience

- Developers, technical folks and project managers seeking to understand Worldpay's 3DS Flex with Cardinal integration

### APIs involved

1. BE for this project (events.3ds-flex.io)

2. [Worldpay WPG](https://developerengine.fisglobal.com/apis/wpg) (a payment gateway)

3. [Cardinal Commerce](https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/805699644/Cardinal+Cruise+API)

### How it works

1. Select a scenario and click Start
   ![Selecting a 'scenario' in the application](https://github.com/tristanbrody/3ds-flex-tutorial-fe/blob/master/src/assets/selecting_scenario.jpg)

> The scenarios are from Cardinal and Worldpay's documentation. See [here](https://cardinaldocs.atlassian.net/wiki/spaces/CCen/pages/903577725/EMV+3DS+2.0+Test+Cases)

> Monitor the 'Logger' side of the application to see all current values relevant to the process. To see the claims in any JWT, go to jwt.io.
> ![Event logger in application](https://github.com/tristanbrody/3ds-flex-tutorial-fe/blob/master/src/assets/logger_example.jpg)

2. Device data collection is submitted to Cardinal Commerce. Specifically, a post request is made from an invisible iFrame to https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect. There are various ways to generate the requisite iFrame. In this case, React is generating the HTML for the iFrame via a functional component (which returns JSX), then is submitting the form in the iFrame via a useEffect that runs upon the component mounting.

> You could also generate the iFrame with vanilla HTML - see the Challenge section below for an example of this.

- Cardinal responds to the device data collection form post via a JavaScript 'message' event.

- Here's an example of how the console looks in browser when the device data collection works as expected and Cardinal responds with a 200, including a console.log of the event:
  ![Cardinal Commerce API response 1](https://github.com/tristanbrody/3ds-flex-tutorial-fe/blob/master/assets/src/cardinal_commerce_ddc_response_in_console.jpg)
  ![Cardinal Commerce API response 2](https://github.com/tristanbrody/3ds-flex-tutorial-fe/blob/master/assets/src/cardinal_commerce_ddc_event_response_in_console.jpg)
- Here's an example of code you can use to listen for Cardinal's response:

```

window.addEventListener(

"message",

async function (event) {

This is a Cardinal Commerce URL in live.

if (event.origin === "https://centinelapistag.cardinalcommerce.com") {

const data = JSON.parse(event.data);

if (data !== undefined && data.Status) {

setDDCData(data);

toggleDDCOutcomeLogged(true);

}

}

},

false

);

```

- The JavaScript message from Cardinal includes the 'sessionId' (also called the dfReferenceId, which indicates completion of the Device Data Collection. This is submitted in the authorisation call to Worldpay in the next step.

3. Click 'Forward' to trigger the authorisation API call to Worldpay. You can see the full authorisation message sent to Worldpay, and the response. The response will vary depending on the scenario you selected in step 1. If a challenge is required, you'll have the option to click 'Forward' again.

4. If applicable, once you click 'Forward', the application will generate a (visible) challenge iFrame. This iFrame should be visible; it posts a JSON Web token to Cardinal including the 'ACSUrl', which is the challenge page hosted by the cardholder's issuing bank, returned in the authorisation message.

- Cardinal's JavaScript then takes over to populate the iFrame with the challenge window that the shopper completes. In the test environment, this is a page hosted by Cardinal rather than the issuing bank:

- Once the challenge is completed, Cardinal sends a post request to the ReturnUrl you include in the challenge JWT. In my implementation, this is a server-side endpoint, which returns HTML with a script to call out to iFrame's parent messsage API. Here is an example of an Express endpoint that listens for Cardinal's post request:

```

router.post("/after-challenge", async (req, res) => {

// endpoint called by Cardinal after shopper completes challenge

// endpoint returns HTML with a script to call out to iFrame's parent using messsage API

console.dir(req.body);

res.set("Content-Type", "text/html");

res.send(

Buffer.from(

"<h2>Received response from Cardinal indicating completion of challenge</h2><script>window.parent.postMessage('Challenge completed', '*');</script>"

)

);

});

```

5. Once the application receives confirmation from Cardinal and the server-side endpoint that the shopper completed the challenge, it allows you to click 'Forward' to continue the flow. This will trigger the second authorisation message to Worldpay's WPG API, which references the original order code and indicates completion of the challenge. The application shows the XML sent to Worldpay and the XML received back from Worldpay.

### Architecture

#### FE: React

#### BE: Express

#### BE deployed using Elastic Beanstalk

#### FE deployed using Cloudfront & S3
