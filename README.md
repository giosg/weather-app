Simple Hello World Application

* App fetches visitor location from visitor data.
* App uses location data to fetch weather data from openweathermap API
* App adds current temperature and if it's (not) raining/snowing etc to visitor variables


# *** WORK IN PROGRESS *** #

# Getting started

Welcome to build your first giosg app. This guide takes less than 30 minutes to complete.

# Prerequisites

Before you begin, make sure your development environment includes Node.js® and an npm package manager.

# Step 1: Create a workspace

**NOTE**: We will be using Mac OS. Commands I use may differ depending on your operating system. Simple google search will help you find the right commands for your operating system.

Make a directory for your project. You can also skip these steps and clone a skeleton project from the github.

```
mkdir my-giosg-app
```

Navigate to that folder using command

```
cd my-giosg-app
```

You can either use text editor but we would recommend you using an IDE for developing web software. We recommend using free editor like Visual Studio Code.

You can configure your visual studio code to be opened by writing command

```
code . // Dot represents current directory in this context
```

# Step 2: Create your first app

**NOTE**: Hello World instructions up-to-date can be found for expressjs can be found behind this [link](https://expressjs.com/en/starter/hello-world.html)

Create app.js file inside your working directory.
You can copy paste code down bellow.

```
const express = require('express') // Imports express to your app.js file
const app = express() // Boostraps app variable
const port = 4000 // Select port you want to use with your app. We will use this port later.

app.get('/', (req, res) => res.send('Hello World!')) // Send simple "Hello World" text to path / 

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // Starts express app
```

# Step 3: Make your app available to the internet

**NOTE:** Instructions to setup ngrok can be found on their website [ngrok](https://ngrok.com)

Using simple app "Ngrok" you can forward your localhost to be available outside of your local environment.

To run ngrok, you can simply type
```
ngrok http 4000 // 4000 is the port we specified in app.js as variable port
```

# Step 4: Using your app inside Giosg

