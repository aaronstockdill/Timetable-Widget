#!/bin/bash

file=$(ls | grep _wdgt)
echo $file
cp -R $file ${file/_wdgt/.wdgt/}