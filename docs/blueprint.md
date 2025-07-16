# **App Name**: n8n Workflow Generator

## Core Features:

- Workflow Generation: Use a Large Language Model tool to convert user input into a valid n8n workflow JSON definition, using only nodes available in the n8n community edition. The tool reasons about which nodes to use, and how to configure them, based on the task description provided by the user.
- JSON Display: Display the generated n8n workflow JSON in a text editor.
- Copy to Clipboard: Implement functionality to copy the generated JSON to the clipboard.
- Download JSON: Implement functionality to download the generated JSON as a file.
- Error Handling: Implement basic error handling to display warnings when the LLM cannot interpret the input request.

## Style Guidelines:

- Primary color: A deep, sophisticated indigo (#EA4B71) to evoke intelligence and automation.
- Background color: Very light gray (#F0F0F0) to ensure high readability and a clean workspace.
- Accent color: A vibrant, energetic magenta (#101330) for buttons and interactive elements to draw the user's eye.
- Font: 'Inter', a grotesque-style sans-serif, will be used for both headlines and body text, given its neutral, modern look.
- Code Font: 'Source Code Pro', for displaying the n8n workflow JSON.
- Use clear, minimalist icons to represent actions like copy and download.
- The user input text area and JSON output text area will be split horizontally with equal space.
- A subtle loading animation will appear while the workflow JSON is generated.