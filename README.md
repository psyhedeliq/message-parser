# Message Parsing Application

This application parses structured plain-text messages containing patient information and extracts relevant data fields.

## Project Structure

- `src/utils/messageParser.ts`: Core functionality for parsing messages and extracting patient data.
- `src/tests/unit/messageParser.test.ts`: Unit tests for the parsing functionality.
- `README.md`: Project documentation.
- `README-FULL-APPLICATION.md`: Description for the structure of a full application (including an API and database).

## Codebase Structure

### Separation of Concerns

- **Data Access**: Handled by reading the message from a file.
- **Business Logic**: Encapsulated in the `parseMessage` function, which handles message parsing and data extraction.
- **Presentation**: For simplicity, the extracted data is logged to the console.

### Modularity and Maintainability

- The core parsing logic is separated into its own module (`messageParser.ts`).
- Unit tests are provided in a separate test file (`messageParser.test.ts`).

### Error Handling and Logging

- Errors are handled gracefully using the `handleError` function, which logs errors using the winston logging library.

### Scalability and Future Extensions

- The code is designed to be modular, making it easy to extend with additional functionality (e.g., more segments).
- Future enhancements can include database integration, API endpoints, and more complex validation.

## Running the Application

1. Install dependencies:
   ```npm install```

2. Run the application:
    ```npx ts-node src/app.ts```

3. Run the tests:
    ```npx jest```

## To test your Express.js API endpoint using Postman, follow these steps

1. Start the Server:
    ```npx ts-node src/server.ts```

2. Open Postman
    Open Postman on your computer. If you don't have it installed, you can download it from [Postman's official website](https://www.postman.com/downloads/).

3. Create a New Request

   - Click on the "New" button and select "Request".

4. Set Up the Request:
   - Method: Set the HTTP method to ```POST```.
   - URL: Enter the URL for your endpoint. If you are running the server locally, it will be something like ```http://localhost:3000/api/parse-message```.

5. Set Up the Request Body
   - Click on the "Body" tab.
   - Select "raw" and then choose "JSON" from the dropdown menu.
   - Enter the JSON payload. For example:
        ```json
        {
            "message": "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\nEVT|TYPE|20230502112233\nPRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101\nDET|1|I|^^MainDepartment^101^Room 1|Common Cold"
        }
        ```

6. Send the Request
   - Click the "Send" button.
   - You should see the response from your server in the "Response" section of Postman.

#### Example Request and Response

**Request**:

Method: ```POST```
URL: ```http://localhost:3000/api/parse-message```

Body:
```json
{
    "message": "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\nEVT|TYPE|20230502112233\nPRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101\nDET|1|I|^^MainDepartment^101^Room 1|Common Cold"
}
```

**Response**:

Status: 200 OK

Body:
```json
    {
        "fullName": {
            "lastName": "Smith",
            "firstName": "John",
            "middleName": "A"
        },
        "dateOfBirth": "1980-01-01",
        "primaryCondition": "Common Cold"
    }
```
