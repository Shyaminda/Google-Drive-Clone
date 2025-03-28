TODOs for Google Drive Clone
This project is actively being improved. Below is a list of pending tasks and enhancements.

📌 General Improvements

- Cache the thumbnail to improve performance and mitigate visibility issues in the frontend.

- Ensure the folder button is disabled until folders are fetched.

- Prevent passing the S3 bucket URL directly for files.

- Implement breadcrumb navigation for better file/folder tracking.

- Improve mobile responsiveness for the folders UI.

📂 File & Folder Management

- Ensure the "Load More" function works properly with folderId.

- Improve rename functionality:

- Only select the file name (not the extension) when renaming.

- Show the renamed file instantly without refreshing the page.

- Implement a progress percentage indicator for file uploads.

🚀 Performance & UX Enhancements

- Implement a loading state while fetching permissions.

- Add a loading indicator for the download action.

- Ensure files are downloaded with the original name shown in the app.

- Add a scrollable area for search results.

- Terminate the file retrieval process when the close button is clicked.

🖼 Media & UI Enhancements

- Store thumbnail URLs in localStorage for better caching.

- Test and fix image zooming functionality if needed.

🛠 Error Handling & State Management

- Implement state resets for better error handling.

🔧 Infrastructure & Scalability

- Implement Kafka queue for better message and file upload handling.

- Set up Nginx for better reverse proxy management and load balancing.

- Set up monitoring and logging (e.g., using Prometheus or Grafana).
