@echo off
title appengine
set JAVA_TOOL_OPTIONS=%JAVA_TOOL_OPTIONS% -Dfile.encoding=UTF8
echo .
echo .
echo ================================================================
echo ==             UPDATE PROD: mvn appengine:update              ==
echo ==             START DEV:   mvn appengine:devserver           ==
echo ================================================================
echo .
echo .
echo .
echo .
echo .
@echo on
mvn appengine:devserver -Dfile.encoding=UTF8
