---
layout: post
title: "Add Signed SSL to your Java REST APIs using Keystore and Openssl"
categories: Java
date: 2023-02-07
image: "/assets/images/keystore.png"
excerpt:
reading_time: 8
---

# Intro

When we are building an application with front-end and back-end separation, our front-end is on one server, and the back-end is on another server. When the front-end has https but the back-end does not support https, the front-end will not be able to make API calls due to security reasons. How to solve this? The article will introduce you a simple way to secure your Java RESTful APIs.

# Prerequisite

-   [openssl](https://macappstore.org/openssl/) (this link provides you on how to install this command line tool on macOS, if you are using Windows, try to search for that 😶‍🌫️)
-   keytool: Keytool is included as part of the Java runtime. So by installing Java, you'll also have keytool in your system.
-   CA signed certificate including two files: "certificate.crt" and "private.key".

# Steps

## Generate a '.jks' file which uses PKCS12 encryption method

First, we gonna export a '.p12' file using "certificate.crt" and "private.key", drag the two files into a folder, open the folder with your terminal, and type:

```
openssl pkcs12 -export -in certificate.crt -inkey private.key \
               -out cert.p12
```

Now, if you use the command `ls`, you will see a file named "cert.p12" has been generated. Next, we are going to create a Java Keystore with it:

```
keytool -importkeystore \
	-destkeystore my_first_keystore.jks -deststoretype pkcs12 -destkeypass [your password] -deststorepass [your password]\
	-srckeystore cert.p12 -srcstoretype pkcs12 -srcstorepass [your password]
```

OK, if the second step succeeds, you could see the keystore file named `my_first_keystore.jks` in this folder!

## Apply the keystore on your SpringBoot REST API application

-   Drag your `my_first_keystore.jks` into `/src/main/resources` folder
-   Create an `application.properties` config file in the same folder, and add the following configuration in it:

```
#SSL for SpringBoot Application
server.ssl.key-store=classpath:my_first_keystore.jks
server.ssl.key-store-type=pkcs12
server.ssl.key-store-password=[your password]
server.ssl.key-password=[your password]
```

**That's it! We are almost set!**

## Test it

Just run the SpringBoot Application, then go to https://localhost:{port}/{your_api_path}, you might see some warning from browser (because the certificate is signed for your domain rather than 'localhost', when you deploy your backend applications on the correct domain, this warning will be disappeared), just ignore it and your will see your API response!
