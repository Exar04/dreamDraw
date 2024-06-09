#!/bin/bash

# As the processes are running in parallel to kill them you need to use the following commands in shell
# kill $(lsof -t -i:3000) to kill the client
# kill $(lsof -t -i:8090) to kill the server
# kill $(lsof -t -i:8000) to kill the MQ 

# ls | grep Prediction | tr '\n' ' '

defualt: 
	@$(MAKE) server &
	@$(MAKE) client & 
	@$(MAKE) watcher 

kill:
	@if lsof -t -i:8090 > /dev/null 2>&1; then \
		echo "Server exists."; \
		echo "Shutting down server"; \
		kill $(shell lsof -t -i:8090);\
		echo "Server has been shutdown"; \
	else \
		echo "Server doesn't exist!"; \
	fi

	@if lsof -t -i:3000 > /dev/null 2>&1; then \
		echo "Client exists";\
		echo "Shutting down client"; \
		kill $(shell lsof -t -i:3000);\
		echo "Client has been shutdown"; \
	else \
		echo "Client doesn't exist!"; \
	fi

	@if lsof -t -i:8000 > /dev/null 2>&1; then \
		echo "MQ server exists."; \
		echo "Shutting down MQ server"; \
		kill $(shell lsof -t -i:8000);\
		echo "MQ server has been shutdown"; \
	else \
		echo "MQ Server doesn't exist!"; \
	fi

server:
	@echo "Work Started"
	@echo ""

	@if [ $(shell ls | grep pyvenv.cfg) = "pyvenv.cfg" ]; then\
		echo "Yes python venv exists" ;\
		echo "" ;\
		source bin/activate;\
		$(MAKE) mq & \
		$(MAKE) startTheServer;\
	else\
		echo "python venv doesn't exist";\
		echo "Initiating venv";\
		python3 -m venv . ;\
		source bin/activate ;\
		echo "Initiated venv";\
		echo "Now installing necessary libraries ... ";\
		pip install opencv-python;\
		pip install tensorflow;\
		pip install numpy;\
		pip install matplotlib;\
		pip install flask;\
		pip install flask_cors;\
		echo "changing keras 3 to its older version 2 because of compatibality issues";\
		TF_USE_LEGACY_KERAS=1 ;\
		echo "Switched to keras 2";\
		$(MAKE) startTheServer;\
	fi

startTheServer: 
	@echo "Initiating Web Server ..."
	@python main.py

client:
	@cd frontend/reactfront && npm start

mq:
	@if [ "$(shell ls | grep -E 'falsePrediction|truePrediction')" = "" ]; then\
		echo "No prediction files exist";\
        mkdir falsePrediction ;\
        mkdir truePrediction ;\
        mkdir truePrediction/0 ;\
        mkdir truePrediction/1 ;\
        mkdir truePrediction/2 ;\
        mkdir truePrediction/3 ;\
        mkdir truePrediction/4 ;\
        mkdir truePrediction/5 ;\
        mkdir truePrediction/6 ;\
        mkdir truePrediction/7 ;\
        mkdir truePrediction/8 ;\
        mkdir truePrediction/9 ;\
        source bin/activate ;\
        echo "Initiating MQ server ..." ;\
        python ImgDataMQServer.py ;\
    else\
        echo "Prediction files exist";\
        source bin/activate ;\
        echo "Initiating MQ server ..." ;\
        python ImgDataMQServer.py ;\
    fi

watcher:
	@echo "Initiating watcher ..."
	@python watcher.py


startRabitmq:
	@docker run -d --name DreamDrawMQ -p 8080:15692 -p 5672:5672 rabbitmq
# The port 8080 is consumer i.e we can send images to add in MQ here
# The port 5672 is producer i.e we can get images that are in MQ from this port
	