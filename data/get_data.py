#!/usr/bin/env python
# −*− coding: UTF−8 −*−

from urllib import urlopen
import os
import subprocess

URLARCHIVOODS = 'http://www.cece.gva.es/ocd/areacd/bd/registre.ods'
PROGRAM = 'libreoffice'

DIR = os.path.abspath(os.path.dirname(__file__))
RAWDIR = os.path.join(DIR, 'raw')
NOMBREARCHIVO = os.path.join(RAWDIR, 'registre.ods')
ARCHIVOCSV = os.path.join(DIR, 'registre.ods.csv')
ARCHIVOCSVUTF = os.path.join(DIR, 'registre.ods.utf8.csv')

# Existe el directorio raw?
if not os.path.exists(RAWDIR):
    os.makedirs(RAWDIR)

# Descarga los datos y los guarda en el directorio raw
datos = urlopen(URLARCHIVOODS)
datos = datos.read()
with open(NOMBREARCHIVO, "wb") as ardat:
    ardat.write(datos)
    ardat.close()

# La conversión a CSV exige que LibreOffice esté instalado
# Chequea que Libreoffice está instalado
for path in os.environ.get('PATH', '').split(':'):
    if os.path.exists(os.path.join(path, PROGRAM)) and not os.path.isdir(\
            os.path.join(path, PROGRAM)):
        # Lanza la conversion
        subprocess.call('libreoffice --headless --convert-to ods.csv {}'\
                .format(NOMBREARCHIVO), shell=True)
        subprocess.call('iconv -f ISO-8859-1 -t UTF-8 {} --output {}'\
                .format(ARCHIVOCSV, ARCHIVOCSVUTF), shell=True)
        os.remove(ARCHIVOCSV)
        os.rename(ARCHIVOCSVUTF, ARCHIVOCSV)

if not os.path.isfile(ARCHIVOCSV):
    print "Ha ocurrido un error en la conversión o LibreOffice no está instalado, deberás crear el CSV por otro medio"

