---
layout: post
title: "How to serve React with Docker and Nginx"
categories: Frontend
date: 2023-01-28
image: "/assets/images/react_docker_nginx.png"
excerpt:
reading_time: 10
---

# Intro

This tutorial shows you how to serve your React.js web App with Docker + Nginx, we will also explore securing the website with Https using a trusted CA (Certificate Autority). Are you ready? Let's go!

# Dockerfile without SSL firstly

In the frontend (React) root folder, say, the same level as 'public', 'src', 'node_modules', we are going to create a file named 'Dockerfile', this file contains the following configuration:

```dockerfile
FROM node:19-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port only for HTTP
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

ps: to avoid the image being huge, we also need a '.dockerignore' file, simply put the two folder names in this file:

```bash
node_modules
build
```

# Nginx Configuration for Http firstly

Also, at the same level as our 'Dockerfile', under React root folder, we gonna create another file called 'nginx.conf', this file configures the Nginx server:

```nginx
server {
    listen 80;
    server_name baizeyu.info www.baizeyu.info;

    location / {
        root /usr/share/nginx/html/;
        include /etc/nginx/mime.types;
        try_files $uri $uri/ /index.html;
    }
}
```

# Try to run Http version first

OK, now we have a basic Dockerfile and nginx config file, let's build it into image and test it locally.

-   Open terminal, cd to our React root folder first.
-   Then run this command to build a image: `docker build -t react-http .`, while 'react-http' is the name of the image, oh, don't forget to start your Docker Desktop first ^-^!
-   Check if we've successfully built the image using: `docker images | grep react-http`.
-   If you already got an image, let's try to run this single image with port forwarding to localhost first: `docker run -p 80:80 react-http` .
-   After the above command, our react-http App has already started on localhost, go to the browser and enter http://localhost, you should see your React App default index page!

# Want Https?

To enable Https on the site, we need to get a CA signed SSL certificate first, there are many free or paid options you can choose over the Internet, I used [ZeroSSL](https://zerossl.com/). Normally, you will get a zip which contains 3 files (a certificate file with extension .crt, a ca_bundle file with extension .crt, and a private key file with extension .key) from a provider. By the way, 'certificate.crt' and 'private.key' should be matched, we can check it using [this site.](https://www.sslshopper.com/certificate-key-matcher.htmll)

Once you've got a certificate, we gonna move on:  
**- Copy 'certificate.crt' and 'private.key' files to React root folder.**  
**- Change Dockerfile into this:**

```dockerfile
FROM node:19-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html
# Copy SSL certs to container
COPY ./certificate.crt /etc/nginx/certs/certificate.crt
COPY ./private.key /etc/nginx/certs/private.key
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
EXPOSE 443
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

As we can see, we copied 'certificate.crt' and 'private.key' into the image, and exposed port 443 for Https requests, simple right?

**- Then change nginx.conf as well:**

```nginx
# nginx.conf

server {
    listen 443 ssl;
    server_name baizeyu.info www.baizeyu.info;
    ssl_certificate /etc/nginx/certs/certificate.crt;
    ssl_certificate_key /etc/nginx/certs/private.key;

    location / {
        root /usr/share/nginx/html/;
        include /etc/nginx/mime.types;
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name baizeyu.info www.baizeyu.info;
    return 301 https://$host$request_uri;
}
```

This time, port 443 will host the static content, any request to port 80 which is Http, will be redirected to Https. Status code 301 means redirect.

---

Congrats! We are all set by now! try to **build the image again** and **run the image with port forwarding to 443**, you should be fine if you go to https://localhost.
