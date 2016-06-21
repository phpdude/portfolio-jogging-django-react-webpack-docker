## What is this?

This is my skills test. This application I built from scratch in 20 hours.

### Project Public URL

http://jogging.itdude.me/

Django admin panel url (you can login with "admin" user)

http://jogging.itdude.me/admin/

Feel free to create/remove/update users, times entries because database is reverted to initial state every 2 hours.

### Project credentials

Format is "user:password".

> admin:qwerty123

> manager:qwerty123

> user:qwerty123

### Remarks

I tested all features myself, so maybe I miss any possible errors, but I was accurate :)

Some of the javascript source code is dirty because was not so much of time (20 hrs only), and I didn't test it 
on mobile devices at all. So in mobile, there can be any problems with masked input filters. But it a test application, 
so I don't think it is very important, in a real application, of course, it must be fixed if there are any problems. Tested
in Firefox, Safari. All javascript source code wrote with ES6 features and compiles without any errors, so all must be 
ok.

It uses cache for better speed, so if you run in a parallel application, you will need to refresh data by pressing f5. In a
real application, of course, need to be added background workers for fetching new data, but for a test, this behaviour 
is enough. Don't forget, it is only portfolio test project to show my basic skills and code quality :-)


#### Used stack:

- Django
- Django-rest-framework
- PostgreSql database
- Docker containers for local dev & production deploy.
- JavaScript + BabelJS + WebPack
- SASS
- JS ES6 features
- React.JS
- React Redux
- React Router
- JWT (JSON Web Tokens) for authorization (jwt key saved to user cookie)
- Maybe something else :)

### Tests

I added tests for JWT authentication & users CRUD operations.

To run django tests you can execute:

> docker-compose run --rm test