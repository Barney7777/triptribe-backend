def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]

pipeline {
    agent any

    environment {
        registryCredential = 'ecr:ap-southeast-2:awscreds'
        appRegistry = "067912176361.dkr.ecr.ap-southeast-2.amazonaws.com/triptribe-backend"
        backendRegistry = "https://067912176361.dkr.ecr.ap-southeast-2.amazonaws.com"
        scannerHome = tool 'sonar-backend'
    }
    
    stages {
        stage('pull code') {
            steps {
                git branch: 'dev', credentialsId: '927ecf94-de07-45cf-9ff6-a3a2aea54996', url: 'https://github.com/ExploreXperts/TripTribe-Backend.git'
            }
        }

        stage('set up .env file') {
            steps {
                sh '''echo \'
                NODE_ENV=development
                PORT=8080
                DATABASE_PORT=27017
                DATABASE_HOST=172.17.0.1
                DATABASE_NAME=tripTribeDb\' > .env'''
            }
        }

        stage('Sonarqube analysis') {
            steps {
                withSonarQubeEnv('sonar-backend'){
                    sh '''${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=$JOB_NAME \
                    -Dsonar.projectName=$JOB_NAME \
                    -Dsonar.projectVersion=$BUILD_NUMBER \
                    -Dsonar.sources=src/
                    '''
                }
            }
        }

        stage('Build App Image') {
            steps {
            
                script {
                        dockerImage = docker.build( appRegistry + ":$BUILD_NUMBER", ".")
                    }

                }
        }

        stage('Upload App Image') {
            steps{
                script {
                    docker.withRegistry( backendRegistry, registryCredential ) {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                }
          }
     }
    }
    post {
        always {
            echo 'Slack Notifications.'
            slackSend channel: '#devops',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL}"
        }
    }
    // post {
    //     // Clean after build
    //     always {
    //         cleanWs(cleanWhenNotBuilt: false,
    //                 deleteDirs: true,
    //                 disableDeferredWipeout: true,
    //                 notFailBuild: true,
    //                 patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
    //                            [pattern: '.propsfile', type: 'EXCLUDE']])
    //     }
    // }
}
