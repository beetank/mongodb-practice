pipeline {
    agent any

    stages {

        stage("run backend") {
            steps {
                echo 'executing npm...'
                script {
                    def text = 'dummy groovy text'
                    echo text
                }
                nodejs(Node-20.14.0) {
                    sh 'npm install'
                }
            }
        }

    }
}
