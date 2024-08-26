# Running Tests

To run the automated tests, ensure you have the application running locally, then use one of the following commands:

- Run all tests: `npm run test`
- Run only api tests: `test:api`
- Run only gui tests: `test:gui`
- Run tests in headed mode: `npm run test:headed`
- Run tests in debug mode: `npm run test:debug`

Make sure you have Playwright installed (`npm install @playwright/test`) and have run `npx playwright install` to download the necessary browser binaries.


#Known Issues (See "known-issues" folder for contributing files)

Gateway API ERROR ("wait" artificial delay causing to hit the app.use(timeout(3000)) limit - Disabled)
app timeout comment say 5s, code was 3000 - Changed to 5000
Artificial "hidden" state in HTML Class - Removed
Logout doesn't work from the app (API Endpoint works as expected)
"/messages" authentication does not work
Attempting to login in with invalid details does not produce the expected error message 'Invalid email or password'
UX does not scale when on mobile (Would need to understand AC further to know severity/priority of issue)


# Future Considerations

Integrate the test suite with the project's CI/CD pipeline
Assess Business Requirements to determine if Page Object Model approach would be beneficial to provide more readable test scripts for non technical stakeholders
Configure test runs for pull requests and regular scheduled runs
Expand test coverage to edge cases and error scenarios (inc. special characters in search)
Implement visual regression testing for UI components
Consider adding accessibility testing to ensure WCAG compliance
Explore performance testing for critical user journeys
Evaluate the need for load testing critical API endpoints
Considerations for rate limiting and performance impact


################################# Reasoning and Approach ########################################

# Approach

I have chosen to implement a hybrid testing approach, with a primary focus on GUI (Graphical User Interface) testing and supplementary API tests for critical endpoints. This decision was made after careful consideration of the application's structure, complexity, and attempting to get the most comprehensive coverage I can within a limited time frame of achieving this techincal task.


# Why GUI-focused testing?

User-centric validation: By testing through the GUI, I closely mimic real user interactions, ensuring that the application functions correctly from an end-user perspective.
Integration assurance: GUI tests naturally validate the integration between the frontend and backend components of the application.
Comprehensive coverage: Given the relatively simple nature of the application, GUI tests can provide adequate coverage without introducing excessive complexity.
Visual and functional verification: This approach allows us to catch both functional issues and visual/UI-related problems in a single test suite.


# Why include API tests?

While the primary focus is on GUI testing, I recognize the value of including some targeted API tests:

Critical endpoint validation: API tests will be used to ensure the robustness of crucial endpoints, such as authentication and search functionality.
Performance considerations: API tests can be useful for assessing the performance of key backend operations independently of the UI.
Faster issue isolation: In case of failures, having both GUI and API tests can help quickly identify whether an issue is frontend-specific or related to the backend.


# Tool Selection: Playwright
I have chosen to use Playwright as the primary testing tool for the following reasons:

Cross-browser support: Playwright supports Chromium, Firefox, and WebKit, allowing us to ensure cross-browser compatibility efficiently.
Modern and well-maintained: Backed by Microsoft, Playwright is actively developed and has a growing community, ensuring long-term viability.
Async/await support: Built-in support for async/await makes writing and maintaining asynchronous test code more straightforward.
API testing capabilities: Playwright's ability to handle both GUI and API testing allows us to implement the hybrid approach within a single framework, reducing complexity and maintenance overhead.
Comprehensive documentation: Playwright offers excellent documentation and a growing ecosystem of plugins and integrations, facilitating easier development and maintenance of the test suite.


# Initial Implementation Plan

## Setup and Configuration:

Install Playwright and configure it for the project


## Core GUI Test Scenarios:

User authentication (login/logout)
Dashboard functionality and data display
Message search and results display
Individual message viewing


## API Test Scenarios:

Authentication Validation
Critical data retrieval endpoints (Search, Messages)
Simple Non Functional Endpoint Performance validation


## Test Structure and Organization:

Implement a clear and maintainable folder structure for tests
Create reusable components
(Although Page Objects are common, I have chosen not to appraoch this way due to the simplicity of the app)


# Scope and Limitations

## Unit Testing Consideration

While this testing framework focuses on end-to-end and integration testing using Playwright, it's important to acknowledge that unit testing is not included in this scope. In a production environment, I would expect unit testing to be an integral part of the development process.

## Why unit tests are not included:

Focus on end-to-end behavior: The primary goal with this framework is to validate the overall functionality and user experience of the application.
Development process simulation: This setup simulates a scenario when implementing QA processes on an existing application, which may not have been developed with unit testing in place.
Resource prioritization: Given limited time and resources, I've chosen to prioritize end-to-end testing for maximum impact on ensuring overall application quality.
Separation of concerns: Unit testing is typically more closely tied to the development process and would ideally be implemented by the developers alongside the application code.

By acknowledging this limitation, I aim to provide context for the current testing approach while emphasizing the importance of unit testing in a complete quality assurance strategy.
