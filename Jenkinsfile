pipeline {
    agent any

    environment {
        ACR_NAME = 'acrregistry11'
        ACR_LOGIN = 'acrregistry11.azurecr.io'
        IMAGE_NAME = 'project-2'
        RG = 'acr-rg'
        AKS = 'aks-cluster11'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/MercyChristinaLanka/project-2.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install || true'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner || true'
                }
            }
        }

        stage('Snyk Scan') {
            steps {
                sh 'snyk test || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t project-2:latest .'
            }
        }

        stage('Trivy Scan') {
            steps {
                sh 'trivy image project-2:latest || true'
            }
        }

     stage('Azure Login & ACR') {
    steps {
        withCredentials([
          string(credentialsId: 'azure-client-id', variable:'1b2b3322-7797-4554-8517-3c97d4adb49d'),
          string(credentialsId: 'azure-client-secret', variable: 'j0n8Q~IXQsPDpTYtf7nZsjXjdJWPzqmURbuDNbrU'),
          string(credentialsId: 'azure-tenant-id', variable: '9e6530da-c1ae-4b6a-b8ae-811eb9bf481e')
        ]) {
            sh '''
              echo "Logging into Azure..."

        az login --service-principal \
          -u $AZURE_CLIENT_ID \
          -p $AZURE_CLIENT_SECRET \
          --tenant $AZURE_TENANT_ID

        az account show
      '''
        }
    }
}


        stage('Push to ACR') {
            steps {
                sh '''
                docker tag project-2:latest acrregistry11.azurecr.io/project-2:latest
                docker push acrregistry11.azurecr.io/project-2:latest
                '''
            }
        }

        stage('Connect to AKS') {
            steps {
                sh '''
                az aks get-credentials --resource-group acr-rg --name aks-cluster11
                '''
            }
        }

        stage('Helm Deploy') {
            steps {
                sh '''
                helm upgrade --install project-2 ./helm-chart \
                --set image.repository=acrregistry11.azurecr.io/project-2 \
                --set image.tag=latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl get pods
                kubectl get svc
                '''
            }
        }
    }
}
