The file captures how to run the Kotif backend api.

1. Pre-requiste: Node v20.15.0
2. $cd ./kf-be-api
3. $ npm install
4. $node index.js
5. Features - 
      - cd, ls, mkdir, login 
      - example of $login <username> <password>
      - in the interest of time no provision was provided to add user. 
      - 
      - user authentication. Currently only two user are present and are 
        hard coded for simplicity. But the authentication is enabled.
      - 'user1' has  'password1'
        'user2' has  'password2'
      - command history is preserved in memory. Need to have a end point to
        get the information over time. Ideally we want to store it in a db or 
        file.
      - Unit test for the commandProcessor
      

