# Express Server with IP Address and Greeting API

This project sets up a simple Express server with an API endpoint that returns the client's IP address and a personalized greeting message.
## Deployed Link
[Click here...](https://hngstage1-ca0u.onrender.com/api/hello?visitor_name=soloTech)

## Features

- **API Endpoint**: `GET /api/hello?visitor_name=your_name`
- **Response**: JSON object containing the client's IP address and a greeting message.

## Requirements

- Node.js
- npm (Node Package Manager)

## Setup

1. **Clone the repository** (if you are using version control):

    ```sh
    git clone <repository_url>
    cd <repository_directory>
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

## Usage

1. **Start the server**:

    ```sh
    node server.js
    ```

2. **Access the API**:

    Open your browser or use a tool like `insomnia` or Postman to navigate to:

    ```
    http://localhost:3000/api/hello?visitor_name=your_name
    ```

    Replace `your_name` with the desired name. For example:

    ```
    http://localhost:3000/api/hello?visitor_name=soloTech
    ```

3. **Response**:

    The server will respond with a JSON object like this:

    ```json
    {
      "Client_ip": "127.0.0.1",
      "greetings": "hello, soloTech"
    }
    ```


