# HPPK-Robo-Cup-2019

Vue project

## How to run on your local machine

1. Clone this repository.

2. Move into the robocup-web folder and install modules

```
> cd robocup-web
> npm install
```

3. Run the server
```
> npm run serve
```

4. Open your web browser and access to 'localhost:8080'

## How to run using Firebase Hosting

1. Clone this repository.

2. Move into the robocup-web folder and install modules

```
> cd robocup-web
> npm install
```

3. Bulld to production
```
> npm run build
```

4. Initialize Firebase project
(Before this step, you should have a firebase project.)
```
> firebase init
```

This project uses some Firebase services:
 * Auth
 * Firestore
 * Hosting
 * Storage

When you initialize the Firebase project, you should never overwrite 'index.html'.

4. Edit 'firebase.json' file.

Find "hosting > public" and change the value from "public" to "./dist".

5. Deploy it into the Firebase Hosting
```
firebase deploy
```
