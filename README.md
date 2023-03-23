# Quiz Web Application

This is a simple web application for creating and taking quizzes. It includes functionality for user authentication and authorization, quiz creation and management, quiz-taking, user score tracking, and user dashboards.

## Technologies Used

    Node.js with Express.js framework for server-side scripting
    MongoDB for data storage
    Ejs for server-side rendering
    Bootstrap for front-end styling
    Passport.js for authentication and authorization

## Installation and Setup

* Clone the repository

* Install the dependencies by running the following command:

```bash
npm install
```

* Create a .env file in the root directory of the project and add the following environment variables:

```
MONGODB_URI=<your MongoDB URI>
SECRET=<your session secret>
```
* Start the application by running the following command:

```bash
    npm start
```
* Open your browser and go to http://localhost:3000

## Features

* User authentication and authorization
* Quiz creation and management (add/edit/delete questions and answers)
* Quiz-taking functionality with randomized questions
* User score tracking and display
* User dashboard for taking quizzes and viewing quiz scores

## Code Structure

* app.js: The main entry point for the application.
* models/: Contains the database models for User, Quiz, and Score.
* routes/: Contains the route files for handling HTTP requests.
* views/: Contains the EJS templates for rendering HTML pages.
* middleware/: Contains custom middleware functions, configuration files for Passport.js authentication 


## Conclusion

This is a simple yet functional web application that provides a platform for creating and taking quizzes.
