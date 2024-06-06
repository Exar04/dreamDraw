defualt:
	@echo "Work Started"
	@echo ""

	@if [ $(shell ls | grep pyvenv.cfg) = "pyvenv.cfg" ]; then\
		echo "Yes python venv exists" ;\
		echo "" ;\
		source bin/activate;\
		$(MAKE) startServer;\
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
		$(MAKE) startServer;\
	fi

startServer:
	@echo Initiating Server ...
	@python main.py

fu:
	@if [ $(shell ls | grep pyvenv.cfg) = "pyvenv.cfg" ]; then\
		echo "Yes python venv exists";\
		echo "";\
		source bin/activate;\
		$(MAKE) startServer;\
	fi
