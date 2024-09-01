## Issues in the Application:

1. Lack of Validation: The login screen does not display validation messages for invalid credentials or when fields are left empty.

2. Favicon and Logo Mismatch: The favicon and logo on the webpage do not match.

3. Description Hover Effect:Hovering over Description of recent message in Dashboard view underlines the description ( looking at the DOM structure, you see an “underline” attribute used )


4. Application Crash: The application crashes with a 504 Gateway Error when repeatedly switching between the Search tab and the Dashboard view.

5. Navigation Delay: Occasionally, returning to the Dashboard from the Search page requires multiple clicks or experiences slow server response times (a few seconds delay).

6. Excessive Network Requests: The application fires "Network" API requests too frequently suspect (e.g., every 20ms or 30ms), causing it to slow down or crash.

7. Missing Client-Side Validation: No validation message appears when the user attempts to search with an empty search field.

8. Search by Email ID Not Functioning: The search functionality for email IDs is not working.

9. Logo Disappearance: The logo disappears every time the "View" button is clicked in the search results.

10. View Button Issue: Clicking "View" on a single search result causes all email addresses on the page to zoom in and then shrink back.

11. Mobile Optimization Issues: The application is not properly optimized for certain mobile screen sizes.

12. Search Without Input: Clicking the search button without entering any text should not trigger search results.

13. Missing Forgot/Reset Password Option: There is no "Forgot/Reset Password" option on the login screen.








