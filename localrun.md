# Local Development Setup

## Requirements
- Python 3 (pre-installed on macOS)

## Running the Site

### 1. Open Terminal

### 2. Navigate to the project folder
```bash
cd /Users/apple/Desktop/Registration-Docs-Final
```

### 3. Start the local server
```bash
python3 -m http.server 8080
```

### 4. Open in browser
```
http://localhost:8080
```

## Stopping the Server
Press `Ctrl + C` in Terminal

## Note
This site uses JavaScript fetch API to load sections dynamically. A local HTTP server is required. Opening the file directly (`file://`) will not work due to CORS restrictions.
