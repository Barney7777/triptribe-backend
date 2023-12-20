pipeline {
    agent any

    environment {
        registryCredential = 'ecr:ap-southeast-2:awscreds'
        appRegistry = "067912176361.dkr.ecr.ap-southeast-2.amazonaws.com/triptribe-backend"
        backendRegistry = "https://067912176361.dkr.ecr.ap-southeast-2.amazonaws.com"
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