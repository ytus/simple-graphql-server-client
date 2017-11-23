# simple-graphql-server-client

Clone:

> git clone https://github.com/ytus/simple-graphql-server-client.git

> cd simple-graphql-server-client

> npm install

Start server:

> cd server

> npm install

> npm start

and open [GraphiQL](http://localhost:4000/graphql?query=%23%20Welcome%20to%20GraphiQL%0A%23%0A%23%20GraphiQL%20is%20an%20in-browser%20tool%20for%20writing%2C%20validating%2C%20and%0A%23%20testing%20GraphQL%20queries.%0A%23%0A%23%20Type%20queries%20into%20this%20side%20of%20the%20screen%2C%20and%20you%20will%20see%20intelligent%0A%23%20typeaheads%20aware%20of%20the%20current%20GraphQL%20type%20schema%20and%20live%20syntax%20and%0A%23%20validation%20errors%20highlighted%20within%20the%20text.%0A%23%0A%23%20GraphQL%20queries%20typically%20start%20with%20a%20%22%7B%22%20character.%20Lines%20that%20starts%0A%23%20with%20a%20%23%20are%20ignored.%0A%23%0A%23%20An%20example%20GraphQL%20query%20might%20look%20like%3A%0A%23%0A%23%20%20%20%20%20%7B%0A%23%20%20%20%20%20%20%20field(arg%3A%20%22value%22)%20%7B%0A%23%20%20%20%20%20%20%20%20%20subField%0A%23%20%20%20%20%20%20%20%7D%0A%23%20%20%20%20%20%7D%0A%23%0A%23%20Keyboard%20shortcuts%3A%0A%23%0A%23%20%20%20%20%20%20%20Run%20Query%3A%20%20Ctrl-Enter%20(or%20press%20the%20play%20button%20above)%0A%23%0A%23%20%20%20Auto%20Complete%3A%20%20Ctrl-Space%20(or%20just%20start%20typing)%0A%0A%0A%0A%23%20%7B%20posts%20%7B%20id%2C%20title%20%7D%7D%0A%0A%0A%0A%23%20%7B%20posts%20%7B%20id%2C%20title%2C%20author%20%7B%20firstName%2C%20lastName%20%7D%7D%20%7D%0A%0A%0A%0A%23%20%7B%20%0A%23%20%20%20author(id%3A%202)%20%7B%0A%23%20%20%20%20%20id%2C%0A%23%20%20%20%20%20firstName%2C%0A%23%20%20%20%20%20lastName%2C%0A%23%20%20%20%20%20posts(titleStarts%3A%20%22Welcome%22)%20%7B%0A%23%20%20%20%20%20%20%20id%2C%0A%23%20%20%20%20%20%20%20title%0A%23%20%20%20%20%20%7D%0A%23%20%20%20%7D%20%0A%23%20%7D%0A%0A%0Amutation%20%7B%0A%20%20upvotePost(postId%3A%207)%20%7B%0A%20%20%20%20post%20%7B%0A%20%20%20%20%20%20id%2C%0A%20%20%20%20%20%20title%2C%0A%20%20%20%20%20%20votes%0A%20%20%20%20%7D%2C%0A%20%20%20%20errors%0A%20%20%7D%0A%7D).



Server is here: https://github.com/ytus/simple-graphql-server-client/blob/master/server/server.js

Schema is here: https://github.com/ytus/simple-graphql-server-client/blob/master/server/schema.js

Client is not necessary, running server and GraphiQL is enough. But if you want to try simple react app that calls the server:

> cd client

> npm install

> npm start

and http://localhost:3000/ will open automatically. 

The source of the client app is here: https://github.com/ytus/simple-graphql-server-client/blob/master/client/src/App.js
