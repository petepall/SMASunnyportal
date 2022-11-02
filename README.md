# SMASunnyportal data extraction
---
### ***This is work in progress***
---
## Objective:
Provide a **typescript based interface** for retrieving SMA Solar plant information from the Sunnyportal.

## How to get started?
1. Clone the project to your local drive
2. Install all dependencies. For the project PNPM has been used.

>`npm install` or `pnpm install`

3. Start the program

>`npm run start:dev` or `pnpm run start:dev`

4. Enter the required SMA login credentials. You can leave the baseurl blank, it will use the default.


### What data can be collected?

**Plant information**
- The list of the plants that are registered under your account
- The data from an individual selected plant
- The list of devices used in a plant
- The details of the devices
- The parametes of the devices


**Plant energy generation information**
- The latest yield information
- All the data for a certain plant based on a given interval
- Day overview per day or per quarter of an hour
- Monthly overview
- Yearly overview
- Energybalance information based on totals or details
	- possible periods that can be selected are:
	 - infinite: year, month
	 - year: year, month, day
	 - month: month, day, hour, fifteen
	 - day: day, hour, fifteen

The current index.ts file contains testing code for each of the requests that can be made.

## Tasks
- [x] Switch the logger from Pino to Winston
	- [x] Move Pino logger into it's own file
	- [x] Update the logger entries in requests and index
	- [x] Add Winston logger to the project
	- [x] Replace Pino logger by Winston
	- [x] Enable development (DEBUG) and test/production (INFO) levels for Winston.
- [ ] Setup proper response handling and parsing.
- [ ] Refactor the code to remove further duplication.
