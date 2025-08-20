# Node.js APIs for School Management

## Project Overview
This project is a simple Node.js-based API system for managing schools. It allows users to add new schools with location data (latitude and longitude) and fetch a list of schools sorted by proximity to a given location. The APIs are built with Express.js and MySQL for data storage.

The project is ideal for applications that require geolocation-based school searches, such as educational platforms or school-finding apps.

---

## Features
- Add a new school with name, address, latitude, and longitude.
- List all schools sorted by distance from the user's location.
- Input validation for all API requests.
- Uses MySQL for data storage.
- Can be tested using Postman.

---
## Node.js-APIs-for-School-Management/

- ── src/
-   ├── controllers/       # Contains API logic for adding and listing schools
-   ├── routes/            # Defines API endpoints
-   ├── config/            # Database configuration and connection
-   └── app.js             # Main application entry point
-
- ── package.json            # Project metadata and dependencies
- ── package-lock.json
- ── README.md               # Project documentation




---

## Technologies Used
- Node.js
- Express.js
- MySQL
- Postman (for testing APIs)

---

## Prerequisites
- Node.js and npm installed
- MySQL installed and running
- Postman or similar tool for API testing

---

## Setup Instructions

1. **Clone the repository:**
```bash
git clone https://github.com/Arunendra21/Node.js-APIs-for-School-Management.git
cd Node.js-APIs-for-School-Management
```
## Install dependencies:
```
npm install
```

## Testing

Import the provided Postman collection from the Postman folder.
Test the /addSchool and /listSchools endpoints with example requests.

## Future Enhancements

1)Add user authentication to manage schools securely.
2)Implement pagination and filtering for the listSchools API.
3)Integrate Google Maps API for better geolocation visualization.
4)Add support for updating and deleting school records.
5)Cache frequently accessed school data for performance improvements.

