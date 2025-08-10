

### **1. Please Create a `.env.example` File before running the code**
This file will serve as a template for the required environment variables. Add the following content to a file named `.env.example` in the root of your project:

```env
# Clerk API keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# MongoDB connection URI
MONGODB_URI=your_mongodb_uri_here

# Gemini API Key
API_KEY_GEMINI=your_gemini_api_key_here
```

### Steps to Run the Project

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env.local` file in the project root.
   - Copy the contents of `.env.example` into `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in the required values:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Get this from your [Clerk dashboard](https://dashboard.clerk.dev/).
     - `CLERK_SECRET_KEY`: Get this from your Clerk dashboard.
     - `MONGODB_URI`: Your MongoDB connection string.
     - `API_KEY_GEMINI`: Your Gemini API key.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   - Visit `http://localhost:3000` in your browser.

Changelog
- 13/01/2025: Added admin dashboard.