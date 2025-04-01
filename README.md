# Express Typescript Naka Exam Bypasser

This project is a safe exam's bypasser, built on express js with typescript
as main language, we provide the best experience ever of bypassing the exam.

## Overview

### Service

- User can submit their exam's config and get the result fast as possible
- Download or Save As feature for better experience of bypassing the exam
- Redeem code, we want to make sure each user had best experience not for
  lagging or overload

### Tutorial

- On leading user how to use our tools, we provide video tutorial with
  simple as possible
- Many tutorial based on out recommendation 3rd party tools

### Admin Dashboard

- Find registered redeem code based on username
- Generate redeem code based on username
- Highly secure auth method with different method from convensional method

## Tech Stack

**Frontend:** EJS

**Backend:** Express.JS

**Database:** JSON File

**Authentication:** Non Convensional

## Run Locally

Clone the project

```bash
git clone https://github.com/Sleepy4k/express-typescript-neb.git
```

Go to the project directory

```bash
cd express-typescript-neb
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

`SESSION_SECRET`

## Feedback

If you have any feedback, please make an issue with detail description, proof of concept, and node dependencies list
