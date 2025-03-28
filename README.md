Google Drive Clone



📌 About the Project
A cloud storage web application inspired by Google Drive, enabling users to create folders, upload files, and manage permissions. Users can share files with specific access controls, ensuring secure and efficient collaboration.

📑 Index

Features

Built With

Installation

How It Works

Support

Contribute

License

🚀 Features
✅ Authentication & Security

User authentication with NextAuth

Email verification on signup

OAuth login (Google, GitHub, etc.)

✅ File Management

Create folders and upload files

Categorize files based on type (Images, Videos, Documents, etc.)

AWS S3 for cloud storage

CloudFront CDN for optimized delivery

✅ File Sharing & Access Control

Share files with specific users

Set custom permissions:

Download

Rename

Share

Only users with granted permissions can perform respective actions

✅ Performance & Deployment

Dockerized for easy deployment

Hosted on AWS for scalability

🛠 Built With
Frontend: Next.js, Tailwind CSS, ShadCN UI

Backend: Express, Prisma, NextAuth

Database: PostgreSQL (NeonDB)

Storage & CDN: AWS S3, AWS CloudFront

Deployment: Docker, EC2

📦 Installation
Running Locally
1️⃣ Clone the repository

git clone https://github.com/yourusername/google-drive-clone.git
cd google-drive-clone
2️⃣ Install dependencies

yarn install
3️⃣ Set up environment variables
Copy .env.example to .env and configure the following:

DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET_NAME=your_s3_bucket
4️⃣ Start the database using Docker

docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
5️⃣  Generate Prisma Client

npx prisma generate 
6️⃣ Run database migrations

npx prisma migrate dev
7️⃣ Start the development server

yarn dev
Your app should now be running at http://localhost:3000 🚀

☁️ Deployment
This project is containerized using Docker. To deploy, use:


docker-compose up --build
For AWS deployment:

Use EC2 instance with Docker

Set up a reverse proxy using NGINX

Configure your S3 bucket & CloudFront for file storage

🔍 How It Works
1️⃣ Authentication
Users sign up with email verification

OAuth login is available for seamless access

2️⃣ File Upload & Storage
Files are uploaded to AWS S3

Folders and files are categorized dynamically

3️⃣ File Sharing & Permissions
Users can share files with specific access levels

Permissions control whether a user can rename, share, or download a file

4️⃣ Deployment & Performance
Prisma ORM manages database operations

AWS CloudFront optimizes file delivery

Docker ensures smooth deployment

💡 Support
If you find this project useful, please consider giving it a ⭐ on GitHub.

🤝 Contribute
Contributions are welcome! Feel free to:

Open an issue

Submit a pull request

Improve documentation

📝 License
MIT License – Free to use and modify.
