---
layout: post
title: "Docker containerized deployment of enterprise-level application clusters"
categories: Containerize
date: 2023-04-20
image: "/assets/images/docker_enterprise.png"
excerpt:
reading_time: 20
---

# 1. Docker containerized deployment of enterprise-level applications

## 1.1 Necessity of Deploying Enterprise-level Applications Using Docker Containerization

-   Conducive to rapid implementation of enterprise-level application deployment
-   Facilitate rapid implementation of enterprise-level application recovery

# 2. Docker Nginx

Here is a demonstration of the technique I use on this site. (link to be updated)

# 3. Docker Tomcat

## 3.1 Search for the image on DockerHub and run it

https://hub.docker.com/_/tomcat

### 3.1.1 Without port exposure

```bash
# docker run -d --rm tomcat:9.0
```

```bash
# docker ps
CONTAINER ID   IMAGE        COMMAND                  CREATED             STATUS             PORTS                                                  NAMES
c20a0e781246   tomcat:9.0   "catalina.sh run"        27 seconds ago      Up 25 seconds      8080/tcp                                               heuristic_cori
```

### 3.1.2 With port exposure

```bash
# docker run -d -p 8080:8080 --rm tomcat:9.0
2fcf5762314373c824928490b871138a01a94abedd7e6814ad5f361d09fbe1de
```

```bash
# docker ps
CONTAINER ID   IMAGE        COMMAND                  CREATED             STATUS             PORTS                                                  NAMES
2fcf57623143   tomcat:9.0   "catalina.sh run"        3 seconds ago       Up 1 second        0.0.0.0:8080->8080/tcp, :::8080->8080/tcp              eloquent_chatelet
```

Then you can go to localhost:8080.

### 3.1.3 Port exposure and add a static file

```bash
docker run -d -p 8081:8080 -v /opt/tomcat-server:/usr/local/tomcat/webapps/ROOT tomcat:9.0

# f456e705d48fc603b7243a435f0edd6284558c194e105d87befff2dccddc0b63
```

```bash
# docker ps

CONTAINER ID   IMAGE        COMMAND             CREATED         STATUS         PORTS                                       NAMES
f456e705d48f   tomcat:9.0   "catalina.sh run"   3 seconds ago   Up 2 seconds   0.0.0.0:8081->8080/tcp, :::8081->8080/tcp   cool_germain
```

```bash
# echo "tomcat running" > /opt/tomcat-server/index.html
```

**Access on localhost**

```bash
root@master-01:~# curl localhost:8081

tom cat running
```

# 4. Docker MySQL

## 4.1 Single Node MySQL Deployment

```bash
# docker run -p 3306:3306 --name=mysql-container \
-e MYSQL_ROOT_PASSWORD=your_password \
-e MYSQL_DATABASE=your_database \
-d mysql
```

```bash
# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                 NAMES
6f0303faae0c   mysql     "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   3306/tcp, 33060/tcp   mysql-container
```

```bash
Access via client inside container
# docker exec -it mysql-container mysql -u root -p
Enter password: your_password
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 8.0.33 MySQL Community Server - GPL

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

## 4.2 MySQL Master-Slave Node Deployment

### 4.2.1 Master Node

```bash
docker run -p 3306:3306 --name=mysql-master \
-e MYSQL_ROOT_PASSWORD=root \
-e MYSQL_DATABASE=your_database \
-v /opt/mysql_master/log:/var/log \
-v /opt/mysql_master/data:/var/lib/mysql \
-d mysql
```

```bash
# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                                                  NAMES
024f3008ec0e   mysql     "docker-entrypoint.s…"   3 seconds ago   Up 2 seconds   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   mysql-master
```

```bash
docker cp mysql-master:/etc/my.cnf /opt/mysql_master/config/my.cnf
```

### 4.2.2 Master Node Config File

```bash
vim /opt/mysql_master/config/my.cnf

# For advice on how to change settings please see
# http://dev.mysql.com/doc/refman/8.0/en/server-configuration-defaults.html

[mysqld]
#
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
# innodb_buffer_pool_size = 128M
#
# Remove leading # to turn on a very important data integrity option: logging
# changes to the binary log between backups.
# log_bin
#
# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
# join_buffer_size = 128M
# sort_buffer_size = 2M
# read_rnd_buffer_size = 2M

# Remove leading # to revert to previous value for default_authentication_plugin,
# this will increase compatibility with older clients. For background, see:
# https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_default_authentication_plugin
# default-authentication-plugin=mysql_native_password
skip-host-cache
skip-name-resolve
datadir=/var/lib/mysql
socket=/var/run/mysqld/mysqld.sock
secure-file-priv=/var/lib/mysql-files
user=mysql

pid-file=/var/run/mysqld/mysqld.pid

# add these to the file!!!!!!!!!!!!!!!!!!!! (start)
server_id=1
log-bin=mysql-bin
read-only=0
binlog-do-db=your_database

replicate-ignore-db=mysql
replicate-ignore-db=sys
replicate-ignore-db=information_schema
replicate-ignore-db=performance_schema

# add these to the file!!!!!!!!!!!!!!!!!!!!! (end)

[client]
socket=/var/run/mysqld/mysqld.sock

!includedir /etc/mysql/conf.d/
```

```bash
docker cp /opt/mysql_master/config/my.cnf mysql-master:/etc/my.cnf
docker restart mysql-master
```

```bash
docker exec -it mysql-master mysql -u root -p
```

### 4.2.3 Slave Node

```bash
docker run -p 3307:3306 --name mysql-slave \
-e MYSQL_ROOT_PASSWORD=root \
-e MYSQL_DATABASE=your_database \
-v /opt/mysql_slave/log:/var/log \
-v /opt/mysql_slave/data:/var/lib/mysql \
-d --link mysql-master:mysql-master mysql
```

```bash
# docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                                                  NAMES
f880333ee83b   mysql     "docker-entrypoint.s…"   22 minutes ago   Up 4 minutes    33060/tcp, 0.0.0.0:3307->3306/tcp, :::3307->3306/tcp   mysql-slave
```

```bash
mkdir /opt/mysql_slave/config
docker cp mysql-slave:/etc/my.cnf /opt/mysql_slave/config/my.cnf
```

### 4.2.4 Slave Node Config File

```bash
# vim /opt/mysql_slave/config/my.cnf
# For advice on how to change settings please see
# http://dev.mysql.com/doc/refman/8.0/en/server-configuration-defaults.html

[mysqld]
#
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
# innodb_buffer_pool_size = 128M
#
# Remove leading # to turn on a very important data integrity option: logging
# changes to the binary log between backups.
# log_bin
#
# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
# join_buffer_size = 128M
# sort_buffer_size = 2M
# read_rnd_buffer_size = 2M

# Remove leading # to revert to previous value for default_authentication_plugin,
# this will increase compatibility with older clients. For background, see:
# https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_default_authentication_plugin
# default-authentication-plugin=mysql_native_password
skip-host-cache
skip-name-resolve
datadir=/var/lib/mysql
socket=/var/run/mysqld/mysqld.sock
secure-file-priv=/var/lib/mysql-files
user=mysql

pid-file=/var/run/mysqld/mysqld.pid

# add these to the file!!!!!!!!!!!!!!!!!!!!! (start)

server_id=2
log-bin=mysql-bin
read-only=1
binlog-do-db=your_database

replicate-ignore-db=mysql
replicate-ignore-db=sys
replicate-ignore-db=information_schema
replicate-ignore-db=performance_schema

# add these to the file!!!!!!!!!!!!!!!!!!!!! (end)

[client]
socket=/var/run/mysqld/mysqld.sock

!includedir /etc/mysql/conf.d/
```

```bash
docker cp /opt/mysql_slave/config/my.cnf mysql-slave:/etc/my.cnf
docker restart mysql-slave
```

```bash
docker exec -it mysql-slave mysql -u root -p
```

### 4.2.5 Config Master Node

```bash
docker exec -it mysql-master mysql -u root -p
```

```sql
use mysql;
# Database changed

create user 'backup'@'%' identified with mysql_native_password by '123456';
# Query OK, 0 rows affected (0.01 sec)

grant all privileges on *.* to 'backup'@'%' with grant option;
# Query OK, 0 rows affected (0.00 sec)

flush privileges;
# Query OK, 0 rows affected (0.01 sec)

show master status\G
# *************************** 1. row ***************************
             File: mysql-bin.000001
         Position: 157
     Binlog_Do_DB: your_database
 Binlog_Ignore_DB:
Executed_Gtid_Set:
1 row in set (0.00 sec)
```

### 4.2.6 Config Slave Node

```bash
docker exec -it mysql-slave mysql -u root -p
```

```sql
mysql> change master to
    -> master_host='mysql-master',
    -> master_user='backup',
    -> master_password='123456',
    -> master_log_file='mysql-bin.000001',
    -> master_log_pos=157,
    -> master_port=3306;
# Query OK, 0 rows affected, 9 warnings (0.02 sec)

mysql> start slave;
# Query OK, 0 rows affected, 1 warning (0.02 sec)

show slave status\G
# *************************** 1. row ***************************
               Slave_IO_State: Waiting for source to send event
                  Master_Host: mysql-master
                  Master_User: backup
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000001
          Read_Master_Log_Pos: 157
               Relay_Log_File: f880333ee83b-relay-bin.000002
                Relay_Log_Pos: 326
        Relay_Master_Log_File: mysql-bin.000001
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB: mysql,sys,information_schema,performance_schema
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 157
              Relay_Log_Space: 543
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 913b5d44-df92-11ed-b2d5-0242ac110002
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set:
            Executed_Gtid_Set:
                Auto_Position: 0
         Replicate_Rewrite_DB:
                 Channel_Name:
           Master_TLS_Version:
       Master_public_key_path:
        Get_master_public_key: 0
            Network_Namespace:
1 row in set, 1 warning (0.00 sec)
```

### 4.2.7 Verify the Availability of the MySQL Cluster

We are going to add a table in DB 'your_database' on master (we must use this DB, because we only put this DB in the config file for sync):

```bash
docker exec -it mysql-master mysql -u root -p

mysql> use your_database;
# Database changed

mysql> create table test (id int);
# Query OK, 0 rows affected (0.03 sec)

mysql> show tables ;
+-------------------------+
| Tables_in_your_database |
+-------------------------+
| test                    |
+-------------------------+
1 row in set (0.00 sec)
```

Check the sync status on slave node:

```bash
docker exec -it mysql-slave mysql -u root -p

mysql> use your_database;
# Database changed

mysql> show tables;
+-------------------------+
| Tables_in_your_database |
+-------------------------+
| test                    |
+-------------------------+
1 row in set (0.00 sec)
```
