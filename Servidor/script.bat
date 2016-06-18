REM   Este script serve para procurar nos codes: break, return fora do lugar, switch quando nao for permitido, vetor (procura []),
REM   comentarios (conte com /c o num de //'s), pause's, return 0, cabecalho (procure 'compilado'), etc
Setlocal EnableDelayedExpansion
set procurado="index.html"
REM         						COM  ASPAS!!! 
echo Faltando > faltantes.txt
set home=C:\Users\Victor\Desktop\Com_front
for /r %home%  %%i in (*.html) do (find %procurado% %%i & if !errorlevel! equ 0 echo %%i >>faltantes.txt)
pause
exit