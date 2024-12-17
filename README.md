# Poketeam

## Requirements

- PHP 8.3+
- Composer
- Node.js

## Running

### Locally

#### Frontend

The frontend is a React.js application and can be found in the `frontend` directory. To run the frontend locally, follow the steps below:

1. Install the dependencies by running `npm install` or `yarn` in the `frontend` directory.

2. Start the development server by running `npm run dev` or `yarn dev` in the `frontend` directory.

#### Backend

##### Database

The database is a MySQL database and can be found in the `backend/src/db/` directory.

##### Server
When ran locally, the application makes requests to a local backend server running at `http://127.0.0.1:8000`. To get
the local server running, follow the steps below:

1. Install the dependencies by running `composer install` in the `backend` directory.

2. Start the server by running `php -S 127.0.0.1:8000 -t ./src` in the `backend` directory.

###### Cache Building

The backend server caches data retrieved from the pokemon API once a day on the live server. To build the cache locally, follow the steps below:

1. Setup the backend server as described above.

2. Run the cache building script by running `LOCAL_SYNC=1 php ./src/buildCache.php` in the `backend` directory.

**WITHOUT BUILDING THE CACHE FIRST POKEMON SEARCH FUNCTIONALLY WILL NOT WORK** 

### Live Server

The project is hosted at [Poketeam](http://169.239.251.102:3341/~madiba.quansah/poketeam/)
