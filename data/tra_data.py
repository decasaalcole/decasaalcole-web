#!/usr/bin/env python
# −*− coding: UTF−8 −*−

import subprocess
import os

DIR = os.path.abspath(os.path.dirname(__file__))
ARCHIVOCSV = os.path.join(DIR, 'registre.ods.csv')

VRTCONTENT = """<OGRVRTDataSource>
    <OGRVRTLayer name="registre.ods">
        <SrcDataSource>registre.ods.csv</SrcDataSource>
        <GeometryType>wkbPoint</GeometryType>
        <LayerSRS>WGS84</LayerSRS>
        <GeometryField encoding="PointFromColumns" x="longitud" y="latitud"/>
    </OGRVRTLayer>
</OGRVRTDataSource>
"""

# Creando el archivo vrt
with open('registre.ods.vrt', 'w') as myfile:
    myfile.write(VRTCONTENT)

# Corrección del formato de cordenadas (separador decimal coma)
# Es necesario tener instalado CSVKIT
if os.path.isfile(ARCHIVOCSV):
    subprocess.call('csvcut -c latitud,longitud,codigo,dgenerica,despecifica,dabreviada,regimen,tipocalle,direccion,numero,codpostal,localidad,provincia,telefono,fax {} > temp.csv'.format(ARCHIVOCSV), shell=True)
    subprocess.call(r"""sed -i 's/"\([^,]*\),\([^,]*\)","\([^,]*\),\([^,]*\)"\(.*\)/\1.\2,\3.\4\5/' temp.csv""", shell=True)
    subprocess.call('csvcut -c codigo,dgenerica,despecifica,dabreviada,regimen,tipocalle,direccion,numero,codpostal,localidad,provincia,telefono,fax,latitud,longitud temp.csv > {}'.format(ARCHIVOCSV), shell=True)

    os.remove('temp.csv')

    subprocess.call('ogr2ogr -f "ESRI Shapefile" coles_cp_ods.shp registre.ods.csv', shell=True)
    subprocess.call('ogr2ogr -f "ESRI Shapefile" coles_cp_ods.shp registre.ods.vrt', shell=True)



