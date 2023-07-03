---
layout: post
title: "Docker Compose"
categories: Containerize
date: 2023-05-01
image: "/assets/images/docker_compose.png"
excerpt:
reading_time: 10
---

# 1. Why Compose?

To run a service in a container, you need to use the `docker run` command. But what if you want to run multiple services? Should you use one container or multiple containers?

Running multiple services in one container can increase the complexity of the image and goes against Docker's preference for one container per application. As a result, complex architectures require many containers that are dependent and connected to each other.

This complexity requires a solution, which brings up the issue of container orchestration.

-   Compose
    -   Orchestration
        -   A method for starting and managing multiple containers
        -   For example: start MySQL first, then Tomcat, and finally Nginx
-   Evolution of Service Architecture
    -   Monolithic Service Architecture
    -   Distributed Service Architecture
    -   Microservice Architecture
    -   Hyper-microservice Architecture
-   Container Orchestration Tools
    -   Docker Machine
        -   A tool for deploying Docker container engines in virtual machines
    -   Docker Compose
        -   A tool for defining and running multi-container Docker applications
    -   Docker Swarm
        -   A tool for batch management and resource scheduling of Docker Hosts
    -   Mesos+Marathon
        -   Mesos manages and schedules computer computing resources
        -   Marathon provides service discovery and load balancing functions
    -   Kubernetes
        -   An open source container orchestration tool developed by Google

# 2. Docker Compose Intro

## 2.1 Terms

-   Project: A group of related services that work together to provide an application.

-   Service: A container or group of containers that perform a specific task as part of the application.
-   Container: A standalone package of software that includes everything needed to run an application, and is isolated from other containers to ensure portability and consistency.

## 2.2 How it works in brief

1. Define a Dockerfile: this allows us to build an image anywhere.
2. Define a docker-compose.yaml file.
3. use `docker-compose up` to start an app.

# 3. Docker Compose Installation

During the installation of Docker, I also installed all related tools, including `docker-compose`. Therefore, this command is already available on my machine.

If you do not have this command, you can go to the official github release page: https://github.com/docker/compose/releases, find the package under 'Assets' that is suitable for your machine, download and install it.

Or you can also follow the official documents: https://docs.docker.com/compose/install/, this might be easier for you.

# 4. Docker Compose Demo

We are going to follow the official documents (https://docs.docker.com/compose/gettingstarted/) to start a simple redis-flask application on our linux machine.

## 4.1 Define the application dependencies

Create a directory for the project:

```
mkdir composetest
cd composetest
```

Create a file called `app.py` in your project directory and paste the following code in:

```
vim app.py
----------------
import time
import redis
from flask import Flask

app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hello World! I have been seen {} times.\n'.format(count)
```

Create another file called `requirements.txt` in your project directory and paste the following code in:

```
vim requirements.txt
----------------------
flask
redis
```

## 4.2 Create a Dockerfile

```
vim Dockerfile
--------------------
# syntax=docker/dockerfile:1
FROM python:3.7-alpine
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run"]
```

## 4.3 Define services in a Compose file

```
vim docker-compose.yaml
------------------------
version: "3.9"
services:
  web:
    build: .
    ports:
      - "8000:5000"
  redis:
    image: "redis:alpine"
```

## 4.4 Build and run your app with Compose

```
docker compose up
-----------------------
[+] Running 3/1
 ✔ Network composetest_default    Created                                                                                                                                  0.1s
 ✔ Container composetest-redis-1  Created                                                                                                                                  0.0s
 ✔ Container composetest-web-1    Created                                                                                                                                  0.0s
Attaching to composetest-redis-1, composetest-web-1
composetest-redis-1  | 1:C 30 Apr 2023 00:31:54.724 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
composetest-redis-1  | 1:C 30 Apr 2023 00:31:54.724 # Redis version=7.0.11, bits=64, commit=00000000, modified=0, pid=1, just started
composetest-redis-1  | 1:C 30 Apr 2023 00:31:54.724 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
composetest-redis-1  | 1:M 30 Apr 2023 00:31:54.725 * monotonic clock: POSIX clock_gettime
composetest-redis-1  | 1:M 30 Apr 2023 00:31:54.725 * Running mode=standalone, port=6379.
composetest-redis-1  | 1:M 30 Apr 2023 00:31:54.725 # Server initialized
composetest-redis-1  | 1:M 30 Apr 2023 00:31:54.725 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. Being disabled, it can can also cause failures without low memory condition, see https://github.com/jemalloc/jemalloc/issues/1328. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
composetest-redis-1  | 1:M 30 Apr 2023 00:31:54.727 * Ready to accept connections
composetest-web-1    |  * Serving Flask app 'app.py'
composetest-web-1    |  * Debug mode: off
composetest-web-1    | WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
composetest-web-1    |  * Running on all addresses (0.0.0.0)
composetest-web-1    |  * Running on http://127.0.0.1:5000
composetest-web-1    |  * Running on http://172.18.0.2:5000
composetest-web-1    | Press CTRL+C to quit
```

Open another terminal and visit:

```
curl localhost:8000
---------------------
Hello World! I have been seen 1 times.
```

Visit again:

```
curl localhost:8000
--------------------
Hello World! I have been seen 2 times.
```

Check docker images:

```
docker image ls
-----------------
REPOSITORY        TAG       IMAGE ID       CREATED         SIZE
composetest-web   latest    a224d19462e3   2 minutes ago   203MB
redis             alpine    d196fde608b2   12 days ago     30.4MB
nginx             latest    9e7e7b26c784   2 weeks ago     135MB
```

Great! This was just a quick and simple demonstration. If you want to learn more, I encourage you to visit the documentation I mentioned earlier at https://docs.docker.com/compose/gettingstarted/. There, you can find complete and detailed information on Docker Compose and its functionality.
