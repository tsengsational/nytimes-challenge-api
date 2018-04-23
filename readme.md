# New York Times Challenge

This is a web application built with Vue.js that takes in data using a backend api running on a local server and serves article previews in two optional reader experiences: A flipboard-inspired book view and a standard list view.

## Getting Started

In the `/nytimes-challenge-api` directory, run this following commands:

```
npm install
npm run serve
```

This should start the backend web server on `localhost:3000`

Clone the front end api, available [here](https://github.com/tsengsational/nytimes-challenge-front). And run the following commands:

```
npm install
npm start
```

This should start the Vue development server on `localhost:8080`. Navigate to [HERE](http://localhost:8080) once the server is running and the Vue app should load.

**NOTE:**
If your machine's local IP address is not `127.0.0.1`, you will need to change the IP address in the config file located in `src/config.js` to match your machine's local IP address.

## Known Issues:
- When emulating mobile devices using browser dev tools, article images will initially be sized for desktop mode. Requires a reload to resize. This is mostly an edge case since most devices requiring mobile views will have properly sized images on load. More an issue for dev environment.
- When translating from English to Martian, I assumed that numbers were not to be translated.
- When toggling back and forth between List and Book views, due to the timeouts required for pageFlip animations, sometimes the wrong index is sent to either the List or Book views. This is typically only off by 1 or 2 articles, which isn't the worst, but not optimal.
