echo "------------Task list----------------"
echo "1. Remove Docker container"
echo "2. Remove Docker image"
echo "3. Build and run Docker container"
echo "4. Build Docker image"
echo "5. Run Docker container"
echo "6. Remove previous docker image, container and build and run new Docker container"
echo "7. NPM install build application and build docker container"
#..........................................
read task
if [ $task -eq 1 ]
then
	clear
        docker ps
        echo "Enter container/s name/s or ID/s "
        read containerid
        docker rm -f $containerid
#...........................................
elif [ $task -eq 2 ]
then
clear
docker ps
docker images
echo "Enter Docker image/s name/s"
read containerid
docker image remove $containerid
#............................................
elif [ $task -eq 3 ]
then
echo "Please Enter Imagename"
read imagename
echo "Please Enter external port which is in proxy_pass port in dauflt file 80"
read portout
echo "Please Enter Internal port 4200" 
read portin
docker build -t $imagename .
echo "press enter to host"
docker run -d --name $imagename --restart=unless-stopped -p $portout:$portin $imagename
echo "Successfully created."

#..............................................
elif [ $task -eq 4 ]
then
docker ps
echo "Please Enter Image name"
read imagename
docker build -t $imagename .
#..............................................
elif [ $task -eq 5 ]
then
docker ps
echo "Please Enter Previous Imagename(releted to hosted port)"
read piname
docker rm -f $piname
docker image remove $piname
echo "Previous image and continer are removed....."
docker images
echo "Please Enter Imagename"
read imagename
echo "Please Enter external port which is in proxy_pass port in dauflt file usually 80"
read portout
echo "Please Enter Internal port 4200"
read portin
docker run -d --name $imagename --restart=unless-stopped -p $portout:$portin $imagename
echo "Successfully created."
#...............................................
elif [ $task -eq 6 ]
then
docker ps
echo "Please Enter external port which is in proxy_pass port in dauflt file"
read portout
echo "Please Enter Internal port 4200"
read portin
echo "Please Enter Previous Imagename(releted to hosted port)"
read piname
echo "Please Enter Image name to new build"
read imagename
npm install
ng build --configuration production --aot
docker build -t $imagename .
docker rm -f $piname
docker image remove $piname
echo "Previous image and continer are removed....."
docker run -d --name $imagename --restart=unless-stopped -p $portout:$portin $imagename
echo "Successfully created."
#................................................
elif [ $task -eq 7 ]
then
docker ps
echo "Please Enter Image name to new build"
read imagename
npm install
ng build --prod
docker build -t $imagename .
fi
