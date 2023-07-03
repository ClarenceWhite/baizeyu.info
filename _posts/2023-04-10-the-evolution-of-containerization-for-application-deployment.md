---
layout: post
title: The Evolution of Containerization for Application Deployment
categories: Containerize
date: 2023-04-10
image: "/assets/images/e_of_docker.png"
excerpt:
reading_time: 10
---

# 1. Pain Points of Application Deployment

## 1.1 Application Deployment Process

**Example: Deploying a web application developed in the Java programming language using the War package to Tomcat.**

-   The deployment process is as follows:
    -   Configure the server runtime environment: the Java runtime environment, such as JDK or JRE.
    -   Install the Tomcat web middleware on the server to run the War package.
    -   Place the corresponding War package for the Java web application in the Tomcat directory.
    -   Start the Tomcat application on the server.
    -   Optional: Deploy database (MySQL) or caching system (Redis), etc., one by one.

## 1.2 Application Scaling

-   Involves deploying the same environment on multiple servers.
-   Pain point: redeploying the above environment is time-consuming and costly in terms of labor and resources.

## 1.3 Multi-Environment Application Deployment

-   Environments: Local testing environment, pre-production environment, production environment.
-   A successful test in the local environment may encounter problems in the pre-production environment, or even though both environments are fine, there might be issues in the production environment.
-   Need: One successful deployment that can run everywhere.

# 2. Evolution of Computing Resources Application

## 2.1 Pain Points of Physical Server Usage

-   From the perspective of physical server management:

    -   High manpower cost to deploy physical server environment, especially without sufficient automation means, relying on manual operation and maintenance.
    -   When a physical server fails, the restart time is too long, ranging from 1-2 minutes to 3-5 minutes, which does not meet the requirement of achieving 99.999999999% uptime for servers.
    -   Troubleshooting hardware issues during application runtime on physical servers is complicated.
    -   It is difficult to effectively schedule and utilize computational resources on physical servers.

-   From the perspective of deploying applications on physical servers:
    -   Time is wasted in deploying environments on physical servers without automated management tools.
    -   Changing application configurations on physical servers requires repeating the previous steps.

## 2.2 Pros and Cons of Using Virtual Machines

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/640a227606c5e77178f39150-4-6-18-40-3.jpg" id="blog-image" height="300" width="400"/>
</p>

### 2.2.1 Pros of Using Virtual Machines

-   From the perspective of virtual machine management:

    -   Virtual machines are lighter than physical servers and can be quickly generated using virtual machine templates.
    -   The deployment of applications in virtual machines is as controllable as physical servers, and when virtual machines fail, new ones can be used directly to replace them.
    -   Efficient use of physical server resources by virtual machines.
    -   Virtual machines provide isolation similar to physical servers for a good application runtime environment.

-   From the perspective of deploying applications in virtual machines:
    -   Applications can be easily scaled up or down in virtual machines.
    -   Compared to physical servers, when the virtual machine running an application fails, it can be quickly restarted, usually within seconds, and the application can continue to provide services.
    -   Easy migration of applications.

### 2.2.2 Cons of Using Virtual Machines

-   Virtual machine management software itself consumes a lot of physical server computing resources. For example, VMware Workstation Pro will take up a large amount of physical server resources, so KVM virtual machines are more commonly used in enterprise applications.
-   The underlying hardware of virtual machines consumes a lot of physical server resources. For example, the virtual machine operating system's hard disk directly occupies a large amount of physical server hard disk space.
-   Compared to container technology, virtual machine startup time is long, while container startup can be calculated in milliseconds.
-   Virtual machines add a chain of calls for physical server hardware resource allocation, which wastes time and makes virtual machines less performant than physical servers.
-   Since applications are deployed directly on virtual machine hard disks, when migrating applications, the operating system in the virtual machine hard disk needs to be migrated together, resulting in larger migration files, wasting more storage space and consuming more time.

## 2.3 Pros and Cons of Using Containers

<p align="center">
<img src="https://raw.githubusercontent.com/ClarenceWhite/BlogImage/main/images/640a227606c5e77178f39150-4-6-18-39-21.jpg" id="blog-image" height="300" width="400"/>
</p>

### 2.3.1 Pros of Using Containers

-   No need to install an operating system in the container, saving a lot of time.
-   Applications can be directly deployed in the container without manually setting up the runtime environment.
-   Container networking is automatically managed for accessing the services provided by applications in the container.
-   Convenient sharing and building of application containers.
-   Millisecond-level startup time.
-   Containers can directly use physical server hardware resources, with high hardware resource utilization and good performance.

### 2.3.2 Cons of Using Containers

For those who are accustomed to using physical servers or virtual machines, the controllability of containerization is not strong. The most intuitive example is trying to manage containers in the same way as physical servers or virtual machines. In fact, there are fundamental differences in how containers are managed, and it is best not to manage them that way.

# 3. What is a Container?

## 3.1 Container Definition

-   Virtual machine:

    -   Uses virtualization technology to package physical server computing resources, providing an environment similar to a physical server for applications.
    -   Isolates applications from each other.
    -   Provides convenience in deploying and migrating applications using automation technology.
    -   Can scale horizontally.

-   Container:

    -   Packages lightweight physical server computing resources, similar to a lightweight virtual machine, to provide a runtime environment for applications.
    -   Can achieve high-density deployment in a physical server.

-   Comparison of Containers and Virtual Machines

| Attribute                            | Container                        | Virtual Machine                     |
| ------------------------------------ | -------------------------------- | ----------------------------------- |
| Isolation                            | Process                          | Full resource                       |
| Startup time                         | Milliseconds or seconds          | Seconds or minutes                  |
| Kernel                               | Shares host kernel               | Uses independent kernel             |
| Resource usage                       | Megabytes                        | Gigabytes                           |
| System support capacity (same level) | Supports thousands of containers | Supports dozens of virtual machines |

## 3.2 Container Functions

-   Install container management tools such as Docker and Containerd to run applications in a containerized manner.
-   Run applications in their own containers, achieving isolation between applications.
-   The container where the application runs can generate an application template file, called a container image, which is immutable and serves as the foundation for cloud-native infrastructure technologies. It can be run on other physical servers as well.

## 3.3 Problems Solved by Containers

-   Rapid delivery and deployment of applications (through images and containers)
-   Efficient utilization and isolation of resources (high-density deployment on physical servers)
-   Convenient migration and scaling (build once, run anywhere)
