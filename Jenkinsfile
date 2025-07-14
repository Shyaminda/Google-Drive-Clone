pipeline {
  agent any

  tools {
    nodejs 'Node 20' //pipeline
  }

  environment {
    REGISTRY   = "ec2-54-89-252-56.compute-1.amazonaws.com:5000"
    SSH_CRED   = 'ec2-ssh-key'
    SSH_TARGET = "ubuntu@ec2-54-89-252-56.compute-1.amazonaws.com"
  }

  stages {
		stage('Debug Info') {
      steps {
        echo "🔍 DEBUG INFO"
        echo "BRANCH_NAME: ${env.BRANCH_NAME}"
        echo "CHANGE_ID: ${env.CHANGE_ID}"
        echo "CHANGE_BRANCH: ${env.CHANGE_BRANCH}"
        echo "CHANGE_TARGET: ${env.CHANGE_TARGET}"
        echo "CHANGE_URL: ${env.CHANGE_URL}"
        echo "Is this a PR? ${env.CHANGE_ID != null}"
      }
    }

    stage('Build & Test') {
      when {
				anyOf {
					allOf {
						changeRequest()
						expression { env.CHANGE_TARGET == 'releases' }
					}

					branch 'releases'
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
      when { branch 'releases' }
      steps {
        checkout scm

        sh "docker build -t $REGISTRY/driveway-backend:latest -f docker/Dockerfile.api ."
        sh "docker build -t $REGISTRY/driveway-frontend:latest -f docker/Dockerfile.client ."

        sh "docker push $REGISTRY/driveway-backend:latest"
        sh "docker push $REGISTRY/driveway-frontend:latest"

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
