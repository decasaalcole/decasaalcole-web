#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import getopt
import logging
import fiona
import json
import httplib
from time import time


"""Set up logging"""
logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

# Constants
HOST="localhost:5000"
conn = httplib.HTTPConnection(HOST)

# For two coordinates get time and distance
def getTime(flat,flon,tlat,tlon):
    reqString="/viaroute?loc={0:.7},{1:.7}&loc={2:.7},{3:.7}&instructions=false&alt=false".format(flat,flon,tlat,tlon)
    #logging.info("Processing {}-{}".format(fcp,tcp))
    conn.request("GET",reqString)
    response = conn.getresponse()
    summary = json.loads(response.read())['route_summary']
    total_distance = summary['total_distance']
    total_time = summary['total_time']
    return [total_distance,total_time]

# Process a couple of data objects to return times and distances forward and backwards
def processPostCodes(i,j):
    fcp=i['properties']['CP']
    tcp=j['properties']['CP']
    flon,flat = i['geometry']['coordinates']
    tlon,tlat = j['geometry']['coordinates']

    tD,tT = getTime(flat,flon,tlat,tlon)
    fD,fT = getTime(tlat,tlon,flat,flon)

    return [fcp,tcp,tD,tT,fD,fT]


def main(argv=None):
    if argv is None:
        argv = sys.argv
    """
    Open the shapefile and bulk load it into a list
    """
    logging.info("Starting the process")
    #Process the shapefile to get an ordered data list
    data = []
    numResults = 0
    with fiona.open('/home/jsanz/src/decasaalcole/data/cp.shp')as source:
      for f in source:
        try:
          data.append(f)
        except Exception, e:
          print("Error printing feature %s:", f['id'])

    # Sort data by CP
    data.sort(key = lambda x: x['properties']['CP'])

    logging.info("Working with {} features".format(len(data)))
    #Iterate over the datalist only forward
    with open("output_{0}.csv".format(int(time())), mode="w") as my_csv:
        my_csv.write("cp_from,cp_to,from_time,from_dist,to_time,to_dist\r\n")

        num = len(data)
        tot = num * (num-1) * 1.0

        for i in range(0,num):
            for j in range(i+1,num):
                result = processPostCodes(data[i],data[j])
                resultStr = "{0},{1},{2},{3},{4},{5}\r\n".format(result[0],result[1],result[2],result[3],result[4],result[5])
                my_csv.write(resultStr)
                numResults = numResults+1
                if numResults % 1000 == 0:
                    logging.info("{0:.2%} done".format(numResults/tot))
        logging.info("Processed {} calculations".format(numResults))


if __name__ == "__main__":
    sys.exit(main())