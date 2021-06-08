# Customer Inviter App
This simple node.js app does the following

 1. Reads customer's data such as name, their location co-ordinates and user id from a remote file
 2. Uses "[Great Circle Distance](https://en.wikipedia.org/wiki/Great-circle_distance)" to calculate the distance between customer's location and office co-ordinates
 3. Filters the customers living within a span of `100Kms` from office co-ordinates
 4. Sorts the customers by their user id
 5. Writes the sorted list in a file under file name `output/inviteList100Kms.txt`

## Pre-requisites

 - Node.js v14 or above. Can be downloaded [here](https://nodejs.org/en/download/current/)
 - If you already have a different version of node, you can use the package `n` to switch to v14 or above. Please follow the instructions [here](https://github.com/tj/n)
 - Docker Desktop if you want to run the app inside Docker. Can be downloaded [here](https://www.docker.com/products/docker-desktop)

## Setup

 1. Clone the repo using the command 

	```
	git clone git@github.com:subramaniashiva/customer-inviter.git

 2. Move to the cloned directory and run
	```
	npm install
    
 3. To start the application and view the output run 
	```
	npm start
4. Open the file `output/inviteList100kms.txt` to view the list of customers sorted by user id who can be invited

## Best practices followed

Since this app is expected to be in a quality as if it is intended to ship in production, some of the best practices followed in the industry is implemented here. 

> Quality is not a destination but a result of the process.

 This means as much as the output, it is also equally important on how we arrive at the output. Let's find that about here.

### Branch rules:

 - `main` is the default branch
 - No code can be directly pushed to `main`
 - Code can be merged only via pull requests. List of PRs happened during development of this repo can be found [here](https://github.com/subramaniashiva/customer-inviter/pulls?q=is:pr%20is:closed)
 - Ideally a PR can be merged only if it is reviewed by 2 other people. Since this repo does not have that many users, this rule is turned off temporarily

### Commit guidelines
This repo follows **conventional commits** for all it's commits. It is a lightweight convention on top of commit messages. More details about this convention can be found [here](https://www.conventionalcommits.org/en/v1.0.0/#summary).

Every merge to main should bump the version of package. Bumps it to major or minor or patch depending upon the code change.

### Linting (static code analysis)

 - Run `npm run lint` to run the linting on source javascript files
 - Uses [ESLint](https://eslint.org/) to analyze the code to quickly find problems
 - Uses [Prettier](https://prettier.io/) for code formatting
 - Linter follows google's recommended guidelines. More details can be read [here](https://github.com/google/eslint-config-google)

### Unit tests

 - Run `npm run test:unit` to run unit tests. All source files (few exempted) are covered with unit tests
 - To run it in watch mode, run `npm run test:unit:watch`
 - Uses [Mocha](https://mochajs.org/) as test runner and [Chai](https://www.chaijs.com/) as assertion library
 - All unit test files live in the same level as the source file

### Unit tests coverage
- Run `npm run coverage` view the coverage report for this application
- The current coverage stands at 100%
- Uses `nyc` as the code coverage tool. More details can be read [here](https://www.npmjs.com/package/nyc)

### Integration tests
- Run `npm run integration` to run integration tests. This tests the full flow of getting file from remote location, parsing it, finding distance, filtering the list, sorting and writing the output to a file.
- To run it in watch mode, run `npm run test:integration:watch`
- Uses [nock](https://www.npmjs.com/package/nock) for mocking network requests
- Uses [Mocha](https://mochajs.org/) as test runner and [Chai](https://www.chaijs.com/) as assertion library
- Test data covering various scenarios are under `test/integration/test-data` folder

### Git Hooks
- Uses husky to run git hooks when certain actions occur in the repo
- Runs `npm run lint` before each commit making sure the code and formatting is clean
- Runs `npm run test` (unit tests coverage and integration tests) before pushing. 
- Any code coverage less than 100% will not allow the code to be pushed. Any failing unit tests or integration tests will not allow the code to be pushed, maintaining the quality of the application
- To view the hooks please look into the folder `.husky`

### Dockerised

 - Run `docker-compose up` to run the code in a Docker container
 - View `Dockerfile` and `docker-compose.yml` for more details
 - Since this is a small application, a long running server is not included. 

### Logging
- Uses `bunyan` package to log errors and other important messages. More details can be found [here](https://www.npmjs.com/package/bunyan)
- Enables better debugging and tracing when the app is run in production mode or dev mode

### Dependecy Injection Container pattern
- Uses Awlix package to implement DI pattern in the repo
- All the source files, external dependencies, utils are registered in a single file `src/container.js`
- This helps in writing better unit tests

### Data Validation
If there is one rule that should never be forgetten while development, it is 
> Never trust external data

Validation is built into the repo and handled gracefully. All details about a customer is validated and a customer model is built in `src/models.customerModel.js` file. If a particular data row of a customer contains invalid details, the details are logged as an error and the code moves on to the next row. This way we get some output even if the data is not 100% right.

### Future Enhancements
- Build a UI to view the output data. This will also give the user the power to change radius and sort parameters
- Move certain constants like customer data url to environment variable so that the file location can be changed without touching the code
- Once we have a UI, health check endpoints can be added to check if the service is alive and can accept traffic
- Create and monitor metrics such as file read/write time, sorting time