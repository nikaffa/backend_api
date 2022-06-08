# Backend Assessment - Blog Posts
- A simple backend JSON API built in Javascript with Node v15/Express and tested by Jest

## Dependencies
- axios
- body-parser
- nodemon
- apicache for server side caching
- Jest/supertest for unit testing
- axios-mock-adapter for mocking axios requests in unit testing

## Setup

Install dependencies with `npm install`.

## Run The Server
- With nodemon
```sh
nodemon run start
```
- Without nodemon
```sh
npm start
```
- The back-end will be served at `http://localhost:8080/`

## Running Jest Test Framework

```sh
npm test
```
- Unit testing performed with Jest/supertest
- Axios api calls were mocking in tests
- Jest generates coverage report by default

#### Test coverage
-  95.45% Stmts, 94.28% Branch, 81.25% Funcs, 95.23% Lines (Uncovered Lines: catching the errors)

## Notes
- Actual time taken for the assessment (minus the breaks): 4 days