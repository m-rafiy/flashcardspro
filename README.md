# FlashcardPro

FlashcardPro is a web application that allows users to create and manage flashcards for study purposes. Users can sign in using Auth0 authentication, create flashcards, and view their flashcards on a personalized dashboard.

## Current Features

- User authentication via Auth0
- Create and store flashcards
- View flashcards on a personalized dashboard
- MongoDB integration for data storage

## Setup Instructions

1. Clone the repository

2. Install dependencies: npm install
   
4. Set up Auth0:
- Create an account at [Auth0](https://auth0.com/)
- Create a new application and get your Client ID and Client Secret
- Set up your callback URLs and allowed logout URLs in Auth0 dashboard
- Ensure your Auth0 domain, client ID, and client secret match those in your `.env` file

4. Set up MongoDB:
- Install MongoDB locally or use a cloud service
- Ensure your MongoDB URI in the `.env` file points to your database

5. Set up your `.env` file in the root directory with the following structure:

   ```env
   AUTH0_CLIENT_ID=your_auth0_client_id
   ISSUER_BASE_URL=https://your_auth0_domain
   SECRET=your_secret_key
   PORT=3000
   AUTH0_CLIENT_SECRET=your_auth0_client_secret
   AUTH0_DOMAIN=your_auth0_domain
   BASE_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/flashcardspro

6. Start the application: npm start

7. Access the application at `http://localhost:3000`

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Auth0 for authentication
- EJS for templating

## Project Structure

- `server.js`: Main entry point of the application
- `routes/`: Contains route handlers
- `models/`: Defines MongoDB schemas
- `views/`: EJS templates for rendering pages
- `public/`: Static assets (CSS, client-side JS, images)

## Future Enhancements

- Space out cards to maxmimise memorisation efficiency 
- Edit and delete flashcards
- Categorize flashcards
- Study mode with flashcard flipping
- Progress tracking
