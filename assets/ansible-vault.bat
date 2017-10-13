@echo off
set arg1=%1
set arg2=%2
set arg3=%3
set arg4=%4

IF /I "%arg1%"=="--help" (
  bash -c "ansible-vault %arg1%"
  EXIT /B %errorlevel%
)

set USERPATH=%HOMEDRIVE%%HOMEPATH%
cd %USERPATH%

call set arg3=%%arg3:%USERPATH%=.%%
call set arg3=%%arg3:\=/%%

set USERPATH=%HOMEDRIVE%%HOMEPATH%
call set arg4=%%arg4:%USERPATH%=.%%
call set arg4=%%arg4:\=/%%

for %%F in (%arg3%) do set passfile=%%~nxF
bash -c "cp %arg3% ~/%passfile%" 
bash -c "chmod -x ~/%passfile%" 

bash -c "ansible-vault %arg1% %arg2%=~/%passfile% %arg4%"
set exitCode=%errorlevel%
bash -c "rm ~/%passfile%"
EXIT /B %exitCode%

