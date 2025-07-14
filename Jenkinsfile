pipeline {
  agent any

  tools {
    nodejs 'Node 20'  // Ensure Node 20 is configured under Manage Jenkins → Global Tool Configuration
  }

  environment {
    REGISTRY   = "ec2-54-89-252-56.compute-1.amazonaws.com:5000"
    SSH_CRED   = 'ec2-ssh-key'  // Jenkins SSH private key for EC2 instance
    SSH_TARGET = "ubuntu@ec2-54-89-252-56.compute-1.amazonaws.com"
  }

  stages {
    stage('Build & Test') {
      when {
        allOf {
          changeRequest()                            // “this is a PR build”
          expression { env.CHANGE_TARGET == 'releases' }  // “and PR target is releases”
        }
      }
      steps {
        checkout scm
        sh '''
          yarn install
          yarn db:generate
          npx turbo run build
        '''
      }
    }

    stage('Dockerize & Deploy') {
      when { branch 'releases' }  // Only on merge to releases
      steps {
        checkout scm

        // 1) Build Docker images
        sh "docker build -t $REGISTRY/driveway-backend:latest -f docker/Dockerfile.api ."
        sh "docker build -t $REGISTRY/driveway-frontend:latest -f docker/Dockerfile.client ."

        // 2) Push to your private registry (no login needed)
        sh "docker push $REGISTRY/driveway-backend:latest"
        sh "docker push $REGISTRY/driveway-frontend:latest"

        // 3) SSH to EC2 and deploy containers
        sshagent([SSH_CRED]) {
          sh """
            ssh -o StrictHostKeyChecking=no $SSH_TARGET << 'EOF'
              docker pull $REGISTRY/driveway-backend:latest
              docker pull $REGISTRY/driveway-frontend:latest

              docker stop backend || true
              docker rm backend || true
              docker stop frontend || true
              docker rm frontend || true

              docker run -d --name backend -p 3006:3001 $REGISTRY/driveway-backend:latest
              docker run -d --name frontend -p 3005:3000 $REGISTRY/driveway-frontend:latest
            EOF
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Build & Deploy completed successfully."
    }
    failure {
      echo "❌ Build or Deploy failed."
    }
  }
}
