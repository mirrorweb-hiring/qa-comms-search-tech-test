# Technical Test - Zoe Milne

## Prerequisites 

To get the Playwright tests up and running, run the following command ```npm install```
To run application tests: ```npm run test:e2e:appspec```
To run API tests: ```npm run test:e2e:apispec```

## Manual Testing
The approach I took to testing this application was to firstly run the application locally and have a click around. This not only thought me how the application worked but it allowed me to identify some issues that I may have overlooked if I had went straight into the automation side of things.

Some issues that I did identify during this time were:
    - Login page has no validation (sign in button can be pressed and no validation is presented)
	- No error present on login when incorrect credentials are used
	- Google chrome password warning 
	- User gets gateway timeout error intermittently, pointing towards an API issue.
	- Logout button does not work as expected. I figured out the only way to logout was by passing the logout URL directly and hitting the API.


## Automation Testing
I like to stand by the motto that in order to write a robust suite of automated tests for an application you must conduct some manual testing first. 
Following the small stint of manual testing I decided to map out some automated tests that I wanted to cover. For these tests I decided to work with the Playwright automation framework and JavaScript. I wrote both frontend and API tests using this combination.

Some of the tests I wrote included: 
	1. Ensuring login page loads
	2. User can login to application with correct credentials 
	3. Dashboards are populated
	4. Most recent messages is populated
	5. User can search & view message entries
	6. User can navigate from Search to Dashboards

These tests are all located in test-automation -> tests -> app.spec.js file. I decided to implement the page object modelling approach with these tests. This allows us to model and define our elements in a separate page file and import it into our test specs. The modelled elements can be found in in test-automation -> pages -> test-page.js. This is important when you have multiple and large test specs as it allows you to reuse elements but only model them once, therefore reducing code duplication and redundancy.     

I have also defined the login steps in a separate file (test-automation -> pages -> app.spec.js) and imported it. This way in our test we only need one line of code to login as opposed to multiple. It also means that if anything to do with the login feature of the application changes we only have to updated one piece of code and not multiple.
These tests can be run using the following command from the root directory: ``` npm run test:e2e:appspec ```
This run command is defined in the package.json file of the project. The --headed flag can be added to the run script in the package.json file if you would like to visually see the test steps being stepped through. 
I have configured the playwright.config.json file to run the app locally in parallel with the tests scripts. Therefore you only need to run the tests command above and the app will run locally and conduct the tests. 


## API Testing
I have also showed how I would automate some of the API's behind this application using the /me, /login and /logout endpoints. If I had the correct resources I would have tested these API's using Postman first before adding them to the codebase. Unfortunately on my current PC I do not have access to Postman, but I have shown in test-automation -> tests -> api.spec.js how I would approach automating the Hono API. I also added in the run script for these in the package.json just as I did with the app spec tests. Therefore to run the automated API tests you just run the following command from the root directory: ``` npm run test:e2e:apispec ```


### What I would expand on?
If I had more time and resources for this technical test I would conduct security testing using ZAP. ZAP is an open source security testing application. Using ZAP you can conduct manual security testing via the Desktop UI which allows you to scan specified applications for security vulnerabilities. It also allows you to perform attacks against specified applications to see how the application would respond to a real life cyber attack. This would have picked up the unsecure password error that is thrown intermittently to the user upon login to the application. I have used these features in a previous position.  
ZAP also provides us with the ability to perform security testing via their automation framework. This is something I would have liked to implement into the codebase if I had the correct resources. 
To run this framework it requires multiple downloads which I was unable to complete on my laptop at the moment.  

I would also expanded the API testing if I had more time. I would have automated more of the API's in the codebase.