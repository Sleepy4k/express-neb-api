# Express Naka Exam Bypasser API

This project focuses on providing a fast and reliable API service for Naka Exam Bypasser application. With this API, users can submit their exam configurations and receive results quickly. The service also includes features for downloading or saving exam bypass configurations, as well as a contact form for feedback and reports.

## Tech Stack

**Frontend:** -

**Backend:** Express.JS

**Database:** JSON File

**Authentication:** -

## Run Locally

Clone the project

```bash
git clone https://github.com/Sleepy4k/express-neb-api.git
```

Go to the project directory

```bash
cd express-neb-api
```

Copy /env.example into .env

```bash
cp .env.example .env
```

Install node dependencies

```bash
npm install
```

Or, if you are in production mode run this command
(don't forget to built it first)

```bash
npm install --production
```

Start the server

```bash
npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`APP_NAME`
`APP_ENV`
`APP_PORT`
`APP_HOST`
`APP_MAIL_SYSTEM`

`SESSION_SECRET`

`SMTP_HOST`
`SMTP_PORT`
`SMTP_USER`
`SMTP_PASS`

`WEB3FORMS_FORM_URL`
`WEB3FORMS_ACCESS_KEY`

## Feedback

If you have any feedback, please make an issue with detail description, proof of concept, and node dependencies list
