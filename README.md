
## Description
Carrier Integration Service
A shipping carrier integration service in TypeScript that wraps the UPS Rating API to fetch shipping rates. Built with NestJs.

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app please follow the steps below

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
Please ran the test to try out the api

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
# Tools
Went with nestjs due to its MVCS pattern this offers the best structure for clean reliable code.

# Folder structure:
A more feature oriented structure was chosen for this as it would allow for future expandability, where by in-case of new carriers it would be easy to add them and the code to their own folder reducing modification to what was already done.
This is highlighted by the carriers having their own folder in this we can add others like fedex....in the folder we can add all the different service/apis they provide with their apis. I also moved the auth to carriers folder in order to keep things together and easy to maintain.
The feature folder will contain any new feature we would like to add and then call the courier or other third party service from there.
The auth folder is for add authentication guards and so on.

# Code Pattern & choices:
I was trying to approach this using SOLID principles but most crucially single responsibility.
Nest js strategy pattern was used for different couriers this would require an extra field from the front end to pass the courier, but in terms of code structure and scalability, i felt this would be the best strategy from previous experience.
It add slight complexity in code and is not the simplest solution but help keep code clean and provides for easy scalability all we need to do is add to the strategy for future carriers.
Went with zod for validation of the response after some research it seemed the cleanest feel.

# Future enhancements
- Authentication for our own api, this would be add to the guard
- Add DTO classes + ValidationPipe for rating request body
- Add more test cases as well as e2e test case ran out of time.
- API Documentation added swagger configs