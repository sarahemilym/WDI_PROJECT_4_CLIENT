---
title: Authentication with Angular
type: lesson
duration: "2:00"
creator:
    name: Alex Chin, Ollie Holden & Rane Gowan
    city: LDN
competencies: Front-end frameworks
---

# Authentication with Angular

### Objectives
*After this lesson, students will be able to:*

- Authenticate a front-end app with Angular
- Send JWT tokens to an API
- Store JWT tokens on the client-side
- Use Ui-Router to change between pages

### Preparation
*Before this lesson, students should already be able to:*

- Describe the concepts behind token-based authentication
- Used `jsonwebtoken` in a Node application
- Must have built an Angular form

## Peruse the starter-code (10 mins)

Let's take a look at our `starter-code`. We have a JWT protected Express application with just one resource of `User`.

Our `bower.json` file includes these dependencies:

```json
"dependencies": {
  "angular": "^1.5.8",
  "angular-jwt": "^0.1.8",
  "angular-ui-router": "^0.3.2",
  "bootstrap": "^3.3.7",
  "angular-resource": "^1.5.9"
},
```

The only new dependency that we haven't yet seen is [`angular-jwt`](https://github.com/auth0/angular-jwt), which I'm sure you can guess is a library to handle JWT tokens in Angular.

#### Protecting all endpoints, save two

In this app, all of the endpoints have been protected (require a JWT token to access) except: 

- `POST /login`
- `POST /register`

We obviously need to allow these endpoints to be unprotected so that you can register and login!

This is the code in `index.js` that protects our endpoints and checks that a valid `JWT` token has been provided:

```js
app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/register', methods: ['POST'] }
    ]
  }));
```

#### Install the dependencies

Let's install all of the project dependencies using:

```bash
$ npm i
```

Now, let's run the app with:

```bash
$ gulp
```

The app should now show up in your browser!

## Getting An Auth Token

We're using JWT tokens to authenticate our users. 

In order to return a valid JWT token, users need to send a `POST` request to either the `/login` or `/register` endpoints.

Here's a quick diagram to help refresh your memory on how JWTs work:

![image](https://s3.amazonaws.com/f.cl.ly/items/0P1m1X0L1a01333F2z21/Image%202015-10-25%20at%208.58.28%20PM.png)

In this API, a user can verify their identity by providing their **email** and **password**.

## Test the API - Codealong (5 mins)

We can check that the API is working by registering a new user using `cURL` or an API client. As we are familiar with Insomnia, let's use that to make a new POST request to `http://localhost:3000/api/register` with the following data:

```json
{
  "username": "bob",
  "fullname": "Bob",
  "image": "http://fillmurray.com/300/300",
  "email": "bob@bob.com",
  "password": "password",
  "passwordConfirmation": "password"
}
```

The object returned from Insomnia is a new user object with a JWT included, which can be used on the front-end to authenticate the user.

```json
{
	"message": "Welcome bob!",
	"user": {
		"username": "bob",
		"image": "http://fillmurray.com/10/10",
		"email": "bob@bob.com",
		"_id": "583b6fe39d30d80d5a5b8acc"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4M2I2ZmUzOWQzMGQ4MGQ1YTViOGFjYyIsInVzZXJuYW1lIjoiYm9iIiwiaWF0IjoxNDgwMjkwMjc1LCJleHAiOjE0ODAzNzY2NzV9.Ty6syG123NBMyrnaWkThg-NeeGT0KKebB3Y3rKcAh_U"
}
```

With a complicated task like this, it's always good to write a brief plan:

> **Note:** Write on the board.

- Add new custom routes for `register` and `login` in the `User` factory
- Connect our forms to use these new routes
- Send the form data to the API
- Store the `token` that is returned from the API in `localStorage`
- Pass the stored `token` with the HTTP request to access the protected resource
- Create a logout function to delete the token from `localStorage`

## Parent & Child Controllers

In this app, we are going to use 4 controllers:

- `MainCtrl` (parent)
- `RegisterCtrl` (child)
- `LoginCtrl` (child)
- `UsersIndexCtrl` (child)

The `MainCtrl` will be defined on the body and will be loaded as **soon as the index page loads**. Whereas the other controllers will be state-specific and will be created and destroyed every time you change state with the UI-Router.

Due to the navigation being consistent on every page, this will sit outside of our `ui-view` and could cause a problem for us if we want to change it depending on what happens in a child controllers, e.g. `RegisterCtrl` or `LoginCtrl`.

We can refer to the `MainCtrl` as parent controller and the other controllers as _nested_ or _child_ controllers.

## Register

Let's go to our factory for the `User` resource. 

We're going to add a new `register` route, this url needs to be the same one that is has been setup in the back-end API.

```js
userFactory.$inject = ['API', '$resource'];
function userFactory(API, $resource){
  return $resource(`${API}/users/:id`, { id: '@_id'}, {
    'register': { method: 'POST', url: `${API}/register` }
  });
}
```

Great, now let's go to our `RegisterCtrl` to implement this new method.

```js
RegisterCtrl.$inject = ['User'];
function RegisterCtrl(User) {
  const vm    = this;

  vm.register =  () => {
    User.register();
  };
}
```

> **Note:** We need to wrap `User.register()` in a function because we don't want it running when we load the page. We only want this function to run when the register form has been submitted.

Let's check what our backend is expecting in terms of data when we register. In `controllers/authentications.js` we can see:

```js
User.create(req.body, (err, user) => {
  //
});
```

So, we just need to pass through an object to this `register` function. Back in `src/js/controllers/register.controller.js` let's pass through our `vm.user`:

```js
vm.register =  () => {
  User.register(vm.user);
};
```

We'll be populating `vm.user` from the registration form. In fact, for this example the `ng-model` directive has already been added to the inputs of the registration form!

Now, we can add a `$promise` to this function, so that we can do something after the asynchronous XMLHttpRequest has been completed:

```js
vm.register =  () => {
  User
    .register(vm.user)
    .$promise
    .then(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });
};
```

We should now probably test that this works by submitting the register form with some values. Remember, we're looking for some data logging in the browser console.

You should now see that a user is being registered!

## Login

In order to get the login form to work, we basically need to follow the same process. Just like before we need to create a new custom method in our `User` factory, then we need to use this method in our `LoginCtrl`.

So inside `src/js/factories/user.factory.js` let's add:

```js
userFactory.$inject = ['API', '$resource'];
function userFactory(API, $resource){
  return $resource(`${API}/users/:id`, { id: '@_id'}, {
    'register': { method: 'POST', url: `${API}/register` },
    'login': { method: 'POST', url: `${API}/login` }
  });
}
```

Before we can implement this method in the `LoginCtrl`, let's first check a couple of things:

- Has `ng-model` been implemented on the login form? (Yes)
- What is the API expecting to receive for the login endpoint.

We essentially just need to send an object that looks like this:

```json
{
  "email": "alex@alex.com",
  "password": "password"
}
```

Great! Let's implement this in the `LoginCtrl` (almost the same code as the `RegisterCtrl`):

```js
LoginCtrl.$inject = ['User'];
function LoginCtrl(User) {
  const vm = this;

  vm.login = () => {
    User.login(vm.user)
    .$promise
    .then(data => {
      console.log(data);
    }, err => {
    	console.log(err);
    });
  };
}
```

Now, let's try to login with the data that we used to register then we should get a similar response in the browser console to what we got when we first registered.

```
Resource {message: "Welcome back.", user: Object, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4M…wNDF9.qRSN_34Qg8EAGQpgOMMelnnRoyQRqn6l7z7uIIVEZbM", $promise: Promise, $resolved: true}
```

Cool! Now our routes for login and register are working!

## Token storage

Next, we need to handle the storage of the token that we receive back from both the login and register endpoints.

In order to keep our code DRY we are going to not be writing this logic in both our `RegisterCtrl` and `LoginCtrl` but we're going to move it to another file.

We are going to create a service called `TokenService` that will handle all the logic of saving tokens to the browser's `localStorage`. 

Let's create a new directory called `services` and a file called `token.service.js`:

```bash
$ mkdir src/js/services
$ touch src/js/services/token.service.js
```

Now add some boilerplate code to this service:

```js
angular
  .module('angularAuthentication')
  .service('TokenService', TokenService);

TokenService.$inject = [];
function TokenService() {

}
```

### Saving a token

The first piece of logic we need in this service is to  create a method that will save our token to `localStorage`:

```js
angular
  .module('angularAuthentication')
  .service('TokenService', TokenService);

TokenService.$inject = ['$window'];
function TokenService($window) {
  const self = this;

  self.setToken = (token) => {
    return $window.localStorage.setItem('auth-token', token);
  }
}
```

We're using the angular `$window` instead of `window` (which would also work). This is just incase another library has changed the global window in some way, which might adversely affect our code.

> **Note:** We're namespacing `this` to be `self` instead of `vm` because unlike a controller a service is not linked to a view and therefore doesn't represent the ViewModel.

This code expects that when we call the `setToken`, we will be passing through the `token` that we received from our API call.

Just to test this out, inside our `LoginCtrl`, we need to injext the `TokenService` as a new dependency, so we can use it.

```js
LoginCtrl.$inject = ['User', 'TokenService'];
function LoginCtrl(User, TokenService) {
  const vm = this;

  vm.login = () => {
    User.login(vm.user)
    .$promise
    .then(data => {
      console.log(data);
      TokenService.setToken(data.token);
    });
  };
}
```

#### Test that our `token` is saved in `localStorage`

Try to login using the details that you used before. You _should_ see the `console.log` still displaying, (remember to remove this later!) However, if you now go to the **Application** tab in your Chrome console, you should see that there is a section called **Storage**. There should be a subsection called **Local Storage**. If you click on the arrow, you should then see the domain address that you are currently serving your site from.

You should see something like this:

|**Key**|**Value**|
|---|---|
|`auth-token`|`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4M2I3MzczNmM3ZThiMGM1ZDg0Yjk0MSIsInVzZXJuYW1lIjoiUG9vIiwiaWF0IjoxNDgwMjkyMzQ2LCJleHAiOjE0ODAzNzg3NDZ9.SwOGQeUqiqt-ExgrNHXboGvJ_to9qgYzTQMs65y0Guo`|

If you see this, the your token has been saved to `localStorage`! This means, even if you refresh your page, your browser will still remember it. This will allow us to **keep a user logged in**.

Although this method does work, we can improve this with using an interceptor...

## What is an interceptor?

If we break it down, all HTTP requests going to of from our clientside to our API need to be watched:

- The **outgoing** requests need to have tokens added to their headers so that we can access protected endpoints (the ones that require a token to access).
- The **incoming** requests need to be checked for tokens so that the tokens can be saved to local storage.

HTTP requests from Angular are made using the Angular [`$http`](https://docs.angularjs.org/api/ng/service/$http) service. 

HTTP interceptors offer a convenient way to modify requests made by the `$http` service both before they are sent and after they return.

An interceptor is simply a `factory` service that returns an object with 4 special properties that map to functions:

- `request` - called before a request is sent, capable of mutating the request object
- `requestError` - called when a request fails
- `response` - called when an `$http` request succeeds, is passed the results object,
- `responseError` - called if an $http method fails

This object is then registered as an interceptor with the `$httpProvider` in a `config` block.

The way to think about interceptor functions is as promise callback functions that are called for all HTTP requests.

### Our interceptor

We're going to call this factory `auth-interceptor.factory.js`.

```bash
$ touch src/js/factories/auth-interceptor.factory.js
```

Now, let's add some boilerplate code:

```js
angular
  .module('angularAuthentication')
  .factory('AuthInterceptor', AuthInterceptor);

AuthInterceptor.$inject = [];
function AuthInterceptor() {
  return {
    request(config) {
      return config;
    },
    response(res) {
      return res;
    }
  };
}
```

As mentioned, this factory needs to follow a very specific pattern in order for it to work. We need to return an object with two functions as properties: one called `request` and one called `response`. (Optionally, we can add `requestError` and `responseError`).

```javascript
return {
  request: function(config){
    return config;
  },
  response: function(res){
  	 return res;
  }
}
```

Next, we need to tell the `$http` service (the underlying code that handles API requests) to add our new `AuthInterceptor` to its array of interceptors. This means the code will be run every time `$http` is used. 

We do this by adding it to the `$httpProvider.interceptors` array. To do this, we can create a new `interceptor.config.js` file:

```bash
$ src/js/config/interceptor.config.js
```

Inside here, we need to require the `$httpProvider` and push our `AuthInterceptor` factory into it's `.interceptors`. We don't need to add `AuthInterceptor` as a dependency due to the load order of our Angular app.

```js
angular
  .module('angularAuthentication')
  .config(Interceptor);

Interceptor.$inject = ['$httpProvider'];
function Interceptor($httpProvider) {
  return $httpProvider.interceptors.push('AuthInterceptor');
}
```

Now, whenever we make requests our `AuthInterceptor` should intercept the request and response. To check that this is happening we can add some `console.log()`s:

```js
AuthInterceptor.$inject = [];
function AuthInterceptor() {
  return {
    request(config) {
console.log(config);
      return config;
    },
    response(res) {
console.log(res);
      return res;
    }
  };
}
```

If you refresh the page, you should see that you get two `console.log` without doing anything. This is because UI-Router makes and HTTP request using AJAX to grab your template file! We intercepted the request and the response!

**Note** The `config` object is a bit like an options object for the `$http` service. 

### Checking for tokens

We want to intercept the responses from our API to look for JWT tokens.

However, we only want to intercept requests that involve our own API (the one we have setup as the constant `API`). Therefore we can add the code:

```js
AuthInterceptor.$inject = ['API'];
function AuthInterceptor(API) {
  return {
    request(config) {
      return config;
    },
    response(res) {
      if (res.config.url.indexOf(API) === 0 && res.data.token) {
        console.log(res.data.token);
      }
      return res;
    }
  };
}
```

> **Note:** Remember to `$inject` the API constant.

We can check this is working by trying to login using our form. You should see a `console.log` of the token!

### Combining our TokenService & AuthInterceptor

Now, instead of saving our token in both our `LoginCtrl` & `RegisterCtrl` separately, it makes sense just to do this directly in our `AuthInterceptor`.

In order to do this, we need to inject our `TokenService`:

```js
AuthInterceptor.$inject = ['API', 'TokenService'];
function AuthInterceptor(API, TokenService) {
  //
}
```

Then instead of `console.log(res)` we should add the code the save a `token`:

```js
response(res) {
  if (res.config.url.indexOf(API) === 0 && res.data.token) {
    TokenService.setToken(res.data.token);
  }
  return res;
}
```

Now in our `LoginCtrl` we can remove `TokenService` as a dependency and also we don't need to handle setting the token in this file as it's now happening automatically as part of our interceptor!

So our `LoginCtrl` should look like this:

```js
LoginCtrl.$inject = ['User'];
function LoginCtrl(User) {
  const vm = this;

  vm.login = () => {
    User.login(vm.user)
    .$promise
    .then(data => {
      console.log(data);
    });
  };
}
```

Now, clear your `localStorage` and try to login again. You should see a token still being saved when we login or register.

## Sending the token

Now that we can login and register, we want to be able to access the protected endpoints of our API by sending the token with our requests.

Before we can do this, we need to add a few more functions to our `TokenService`, with the first being a function to retrieve the `token` from `localStorage`:

```js
TokenService.$inject = ['$window'];
function TokenService($window) {
  const self = this;

  self.setToken = (token) => {
    return $window.localStorage.setItem('auth-token', token);
  }

  self.getToken = () => {
    return $window.localStorage.getItem('auth-token');
  }
}
```

Now that we can access this token, we can check it's presence in our `request` function of our `AuthInterceptor`:

```js
request(config) {
  const token = TokenService.getToken();

  console.log(token);

  return config;
},
```

To test this, try to view the Users index. We should see the JWT token being logged out!

### Setting the Authorization header

Now that we can fetch this token from `localStorage`, the next thing is to add this to the `headers` of our HTTP request.

```js
request(config) {
  const token = TokenService.getToken();

  if (config.url.indexOf(API) === 0 && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
},
```

Let's break this down a bit. We're saying that if our `API` url is a sub-string of the request's url and there is a token stored in our TokenService, then set an `Authorization` header on the outgoing HTTP request.

Once this has been done, we should be able to access the users Index page and see a list of users!

#### Manually delete the token

If we manually delete the token, we should see that we get an error if we try to view the users INDEX page.

```
GET http://localhost:7000/api/users 401 (Unauthorized)
```

## CurrentUser Service

Whilst we know that can find out whether a user has logged before by checking if there is a token in `localStorage`,  we often want to know a bit more information about the user who has logged in.

To handle this logic, we're going to call `CurrentUser`.

```bash
$ touch src/js/services/current-user.service.js
```

Let's bootstrap this file:

```js
angular
  .module('angularAuthentication')
  .service('CurrentUserService', CurrentUserService);

CurrentUserService.$inject = [];
function CurrentUserService() {

}
```

### How do we get this information?

The JWT token we have saved in `localStorage` currently contains whatever information we have decided to store inside the payload of the JWT token (the middle section). 

The payload of the JWT is BASE64 encoded, not encrypted. We can usually decode it using the built-in Javascript method `btoa()`.

However, we can also use an Angular module that we have already installed called `angular-jwt`.

We have already installed this in `app.js`:

```js
angular
  .module('angularAuthentication', [
    'ui.router',
    'ngResource',
    'angular-jwt'
  ]);
```

We're going to use `angular-jwt` inside the `TokenService` as that's where we're doing all of our `token` logic:

```js
TokenService.$inject = ['$window', 'jwtHelper'];
function TokenService($window, jwtHelper) {
```

**Note:** It's annoying that the name `jwtHelper` isn't very similar to `angular-jwt`!

Let's make a function to decode the JWT. First, we need to use the `self.getToken()` function to get the token from `localStorage`. Next, if there is one there, we're going to decode it.

```js
self.decodeToken = () => {
  const token = self.getToken();
  return token ? jwtHelper.decodeToken(token) : null;
};
```

### Fetching the user information

Now that we have decoded this information, we can use this function in our `CurrentUserService`. Therefore we need to inject the `TokenService` into the `CurrentUserService`:

```js
CurrentUserService.$inject = ['TokenService'];
function CurrentUserService(TokenService) {
```

Next, we need to create a method that will use the decoded payload given to us by `TokenService.decodeToken()` and use it to fetch the correct user's information from our API:

```js
CurrentUserService.$inject = ['TokenService', '$rootScope', 'User'];
function CurrentUserService(TokenService, $rootScope, User) {
  const self = this;

  self.getUser = () => {
    const decoded = TokenService.decodeToken();
    console.log(decoded);
    
    if (decoded) {
      User
        .get({ id: decoded.id }).$promise
        .then(data => {
			console.log(data);
        });
    }
  };
}
```

In order to trigger this function, let's use it in our `LoginCtrl` after we have finished logging in. Remember, we need to first inject the `CurrentUserService`:

```js
LoginCtrl.$inject = ['User', 'CurrentUserService'];
function LoginCtrl(User, CurrentUserService) {
  const vm = this;

  vm.login = () => {
    User
      .login(vm.user).$promise
      .then(() => {
        CurrentUserService.getUser();
      }, err => {
        console.log(err);
      });
  };
}
```

If you now login, we should see the decoded token and the logged in user's full information!

Let's also do this in our `RegisterCtrl`:

```js
RegisterCtrl.$inject = ['User', 'CurrentUserService'];
function RegisterCtrl(User, CurrentUserService){
  const vm = this;

  vm.register = () => {
    User
      .register(vm.user).$promise
      .then(() => {
        CurrentUserService.getUser();
      }, err => {
        console.log(err);
      });
  };
}
```

Great! So why have we done this?!

## Updating the UI

You may have noticed that our navbar does not change state depending on whether there is a logged-in user or not. 

### `$broadcast` & `$on`

However, this presents us with a bit of a problem. The navbar is ourside the `ui-view` and therefore outside of the scope of our `LoginCtrl` and `RegisterCtrl`.

We somehow need to send a message to the parent controller `MainCtrl`. We can achieve this using Angular's `$broadcast()` function.

**Note:** There are other ways to achieve this. However, it's okay if you have one parent controller and then lots of children controllers. 

In this example, we're going to use `$broadcast`. `$broadcast` essentially sends a message DOWN the scope of your angular application from the `$rootScope`. 

We can catch the `$broadcast` message using `$on`. `$broadcast` is a bit like an angular event and `$on` is a bit like an event listener.

So let's broadcast from our `CurrentUserService` when we have finished getting our currentUser.

```js
  self.getUser = () => {
    const decoded = TokenService.decodeToken();
    if (decoded) {
      User
        .get({ id: decoded.id }).$promise
        .then(data => {
          self.currentUser = data;
          $rootScope.$broadcast('loggedIn');
        });
    }
  };
```

We have also stored the user's information in `self.currentUser`.

### `$on` in `MainCtrl`

We can listen to this `$broadcast` in our `MainCtrl` with the code:

```js
$rootScope.$on('loggedIn', () => {
  console.log('Inside MainCtrl`);
});
```

Now when we login, we should see this `console.log`! 

We can now use our `CurrentUserService` inside our `MainCtrl` to return the value of `CurrentUserService.currentUser` and assign it to the `MainCtrl`'s ViewModel.

```js
  $rootScope.$on('loggedIn', () => {
    vm.user = CurrentUserService.currentUser;
  });
```

This is great! We can now use this inside our HTML! Inside our navbar we can add:

```html
<ul class="nav navbar-nav navbar-right">
  <li>
    <p class="navbar-text">Welcome, {{ main.user.username }}</p>
  </li>
```

If we are logged in, you should now see this information!

### Showing and hiding content

Cool, now let's change the navbar links depending on whether the `MainCtrl` has a value for `user` or not:

```html
<ul class="nav navbar-nav navbar-right">
  <li>
    <p class="navbar-text">Welcome, {{ main.user.username }}</p>
  </li>
  <li ng-hide="main.user">
    <a ui-sref="register">Register</a>
  </li>
  <li ng-hide="main.user">
    <a ui-sref="login">Login</a>
  </li>
  <li ng-show="main.user">
    <a ui-sref="usersIndex">Users</a>
  </li>
  <li ng-show="main.user">
    <a ng-click="main.logout()">Logout</a>
  </li>
</ul>
```

### Updating UI on refresh

We're almost there! However, our UI doesn't update on refresh! We can fix this by invoking our `getUser` function in our `CurrentUserService` when it is first loaded!

```
CurrentUserService.$inject = ['TokenService', '$rootScope', 'User'];
function CurrentUserService(TokenService, $rootScope, User) {
  const self = this;

  self.getUser = () => {
    const decoded = TokenService.decodeToken();
    if (decoded) {
      User
        .get({ id: decoded.id }).$promise
        .then(data => {
          self.currentUser = data;
          $rootScope.$broadcast('loggedIn');
        });
    }
  };

  self.getUser();
}
```

When the `MainCtrl` is loaded when the page is refreshed, the `CurrentUserService` will be injected and this function will be run!

## Logout

Finally, let's allow our users to log out! In order to do this, we need to add a function to our `MainCtrl`.

We already have a click event on the `navbar`:

```html
<li ng-show="main.user">
  <a ng-click="main.logout()">Logout</a>
</li>
```

Inside our `MainCtrl` let's write a function:

```js
 vm.logout = () => {
    CurrentUserService.removeUser();
  }; 
}
```

The logic to remove our CurrentUser, we'll put in our `CurrentUserService`: 

```js
self.removeUser = () => {
  self.currentUser = null;
  TokenService.removeToken();
  $rootScope.$broadcast('loggedOut');
};
```

We're doing several things here: 

1. Resetting the `currentUser` property to `null`
2. Next use a function in our `TokenService` to remove the token from our `localStorage` (we haven't written yet`
3. Broadcast a `loggedOut` message

#### TokenService.removeToken()

Inside our `TokenService` let's write this function that will clear our `localStorage`:

```js
self.removeToken = () => {
  $window.localStorage.clear();
};
```

#### `$broadcast('loggedOut')`

Next, let's write some code that will respond to the `$broadcast` of `loggedOut` inside `MainCtrl`:

```js
$rootScope.$on('loggedOut', () => {
  vm.user = null;
  $state.go('login');
});
```

Great! You should be able to login and logout!

### `$state.go`

You might want to add some `$state.go` code inside `LoginCtrl` and `RegisterCtrl` depending on your applications logic!

## Conclusion (5 mins)

This has been a very hard lesson! However, we've covered lots of concepts! 

