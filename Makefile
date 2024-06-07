# As the processes are running in parallel to kill them you need to use the following commands in shell
# kill $(lsof -t -i:3000) to kill the client
# kill $(lsof -t -i:8090) to kill the server
#!/bin/bash

defualt: 
	$(MAKE) server &
	$(MAKE) client & 

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

server:
	@echo "Work Started"
	@echo ""

	@if [ $(shell ls | grep pyvenv.cfg) = "pyvenv.cfg" ]; then\
		echo "Yes python venv exists" ;\
		echo "" ;\
		source bin/activate;\
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
	@echo "Initiating Server ..."
	@python main.py


client:
	@cd frontend/reactfront && npm start

