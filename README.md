# Insurance Automation System for OUSL staff

Design By YML Kumara Under the supervision of Dr.LSk Udugama as a Software training component for BTech degree

## Development server for test

Run `ng s --host 0.0.0.0 --disable-host-check`
for access in IP adress

## run Nginx server

events{}

http{

    include /etc/nginx/mime.types;
    server {
        listen 4200;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        location / {
            try_files $uri /program-specialization/get/1  $uri/ /index.html;
        }
    }
}

## Docker build

FROM nginx:1.17.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY /dist /usr/share/nginx/html

## Create docker image


docker build -t $imagename .

## Running docker image

docker run -d --name $imagename --restart=unless-stopped -p $portout:$portin $imagename


## Configeration

Backend port: 9000
