# n8n Workflow Generator

This is a web application that leverages AI to generate n8n workflow JSON configurations from natural language descriptions. Users can describe a desired automation or workflow in plain English, and the application will produce the corresponding JSON needed to import that workflow into n8n.

## Functionality

-   **AI-Powered Generation**: Uses Genkit and Google's Gemini model to understand user descriptions and generate accurate n8n workflow JSON.
-   **Simple User Interface**: A clean and intuitive interface where you can type your workflow description.
-   **Instant Output**: The generated JSON is displayed in a text area.
-   **Copy & Download**: Easily copy the generated JSON to your clipboard or download it as a `.json` file.
-   **Built with Modern Tech**: The application is built with Next.js, React, ShadCN UI, and Tailwind CSS for a fast and responsive user experience.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (version 20 or later recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    This will install all the necessary packages for Next.js, React, Genkit, and the UI components.
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    This application uses Google's AI models. You'll need a Google AI API key.
    
    Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```
    
    Open the `.env` file and add your Google AI API key:
    ```
    GOOGLE_API_KEY=your_google_api_key_here
    ```
    You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

You need to run two processes simultaneously: the Next.js frontend application and the Genkit AI flows.

1.  **Start the Next.js development server:**
    Open a terminal and run:
    ```bash
    npm run dev
    ```
    This will start the web application, typically on [http://localhost:9002](http://localhost:9002).

2.  **Start the Genkit development server:**
    Open a second terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit service and will watch for any changes you make to the AI flows in the `src/ai/flows/` directory.

Now you can open your browser and navigate to [http://localhost:9002](http://localhost:9002) to use the application.
