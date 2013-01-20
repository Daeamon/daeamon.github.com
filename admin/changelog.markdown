ChangeLog

22/06/2011 - rowoot
- Modified to support singular and plural forms for controller names routes

18/06/2011 - rowoot
- Fixed #12, #7 from issue task
- Removed unwanted node_modules (connect, node-fs)
- Added middleware redirectFailedAuth to all controllers, which redirects to login page, if session not found
- Added Failed Login. If login creds are invalid, redirect back to login page
- Moved common template variables to application controller in checkAuth middleware
- Added controller, action template variables to Lokki
- Moved Mustache.js to Js/Lib folder