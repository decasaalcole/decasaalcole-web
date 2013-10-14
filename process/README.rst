******************************
De casa al cole pre-processing
******************************

OSRM
====

**TO DO**


Python environment
==================

- Install `virtualenv`_ on your system (i.e. on Ubuntu/Debian install the ``python-virtualenv`` package).
- Activate it
- Install the python libraries with::
	
	pip install fiona
- Start the OSRM server
- Adapt the ``process_cp.py`` url for your OSRM instance
- Run the ``process_cp.py`` script (it cant take a while to calculate all the postcodes combinations)

.. _virtualenv: https://pypi.python.org/pypi/virtualenv