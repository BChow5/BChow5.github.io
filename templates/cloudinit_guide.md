---
layout: default
title: Cloudinit Guide
description: A guide to cloud initialization.
---


# Guide to Create Virtual Servers on Digital Ocean using Cloud-Init for Arch Linux Users

## Introduction

This guide will teach you the process of creating a Arch Linux droplet on DigitalOcean using cloud-Init. Ensuring a smooth and automated setup for your virtual servers! During this process, you will learn how to use doctl, SSH keys, API tokens, and cloud-init.

DigitalOcean is a cloud provider that offers the ability to deploy virtual servers, known as *droplets*, and other cloud-based resources like databases, storage, and networking tools (DigitalOcean, 2024). When creating a droplet, we can automate the setup process to save time and create servers with consistent repeatable configurations using *Cloud-Init*. 
 
*Cloud-init* is an industry standard tool that allows you to automate the initialization of your Linux instances. This means that you can use a cloud-init file to configure droplets at deployment that automatically sets up things like new users, firewall rules, app installations, and SSH keys (DigitalOcean, 2024). This tutorial uses doctl to add a cloud-init file with information on users, programs, and your SSH key.

### Prerequisites 
- A computer running Arch Linux 
- Neovim installed on your system
- The Arch Linux disk image
- All code provided should be run through the Terminal

<br>

## Table of Contents
1. [How to Create an SSH Key Pair](#How-to-create-an-SSH-key-pair)
2. [How to Install Doctl](#how-to-install-doctl)
    1. [Install doctl](#install-doctl)
    2. [Create an API token](#create-an-api-token)
    3. [Granting Account Access to Doctl with an API Token](#granting-account-access-to-doctl-with-an-api-token)
    4. [Validate That Doctl is Working](#validate-that-doctl-is-working)
3. [How to Add your Public Key to Your DigitalOcean Account](#How-to-add-your-public-key-to-your-DigitalOcean-account)
4. [How to Create a Droplet on DigitalOcean](#How-to-Create-a-Droplet-on-DigitalOcean)
    1. [Upload an Arch Linux Image to DigitalOcean](#Upload-an-Arch-Linux-Image-to-DigitalOcean)
    2. [Setting up Cloud-Init](#Setting-up-cloud-init)
    3. [Create a New Arch Linux Droplet](#Create-a-New-Arch-Linux-Droplet)  
5. [How to Connect to Your Droplet Using SSH](#How-to-Connect-to-Your-Droplet-Using-SSH)
6. [References](#References)

<br>

***

## How to Create an SSH Key pair

For the initial set up, you will begin by creating a *Secure Shell Protocol (SSH)* key pair using our local machine. This key will be used to securely connect to your DigitalOcean account. 

You will be using the terminal to create two plain text files in the `.ssh` directory that will be our keys.
- We will create a "hw-key" as our private key
- And we will create "hw-key.pub" as our public key
<br> 

1. Copy then run the following code and after changing the appropriate information:

> **NOTE:** You will need to change *"youremail@email.com"* to your actual information.

<br>

```bash
ssh-keygen -t ed25519 -f ~/.ssh/hw-key -C "youremail@email.com"
```
**What does this code mean?**
* `ssh-keygen`: Generates the public and private key pair
* `-t`: Type of encryption for the key
* `-f`: Specifying filename and location
* `-C`: To add a comment

<br>

**Example of Successful key creation:**

![Image of the SSH key making confirmation](/Assets/Images/SSH_key_make.png)

<br> 

***

## How to Install Doctl

`doctl` is the official DigitalOcean command line interface (CLI) and it allows you to interact with the DigitalOcean API via the command line.

**This section will teach you how to:**
* Install doctl
* Create an API token
* Grant Account Access to doctl with an API Token
* Validate That doctl is Working

<br>

### Install doctl

1. Copy and run the following code to download doctl

```bash
sudo pacman -S doctl
```
**What does this code mean?**
* `sudo`: Allows a user to execute a command as the root user
* `pacman`: The package manager for Arch Linux
* `-S`: It stands for synchronize and is used install or update packages from official repositories

<br>

### Create an API Token

This step will be done on [DigitalOcean](https://www.digitalocean.com/) to create a new API token for your account. An API token is a unique identifier used to authenticate and authorize requests to an Application Programming Interface (API). 

It acts as a digital key that allows applications, scripts, or users to interact with an API securely without needing to provide credentials like usernames and passwords directly.

It's important that the API token has both read and write access. It needs write access to be able to create your droplet, otherwise it would only be able to gather information. 

> **NOTE:** The API token string is only displayed once, so be sure to save it in a safe place for late use

<br>

1. Click **API** on the left side menu
2. Click the **Generate New Token**

A New Personal Access Token page will appear and you will need to fill out the following fields:

![Image of the API settings](/Assets/Images/api_settings.png)

3. Type a name for the token
2. Choose when the token expires
3. Select **Full Access** (this will give the API token both read and write access)
4. Click **Generate Token**
5. Save your API token somewhere safe for later use

<br>

### Granting Account Access to Doctl with an API Token

1. Copy and run the following code to connect your API token

> **NOTE:** Be sure to give this authentication a name by changing "NAME"

<br>

```bash 
doctl auth init --context NAME
```

**What does this code mean?**
* `auth`: Used to manage authentication with DigitalOcean
* `init`: Initializes the authentication process by prompting you to enter a DigitalOcean API token
* `--context`: Allows you to save the authentication settings under a specific context name

<br>

2. Enter in the API token string (the one you made earlier) when prompted by `doctl auth init`
2. Copy and run the following code to switch to the correct authenticated account

>NOTE: Change "NAME" to the name of the account you want to switch to

```bash 
doctl auth list
doctl auth switch --context NAME
```

**What does this code mean?**
* `list`: Displays a list of all the saved authentications
* `switch`: Switch between different authentications

<br>

### Validate that doctl is working

1. Copy and run the following code to confirm you have successfully authorized doctl

```bash 
doctl account get
```

**What does this code mean?**
* `account`: Allows you to manage or retrieve information about the account
* `get`: Retrieves information about the currently authenticated account

<br>

**Successful output looks like this:**

![Image of doctl validation confirmation](/Assets/Images/doctl_validate.png)

<br>

***

## How to add your public key to your DigitalOcean account

You will now add your SSH keys to your DigitalOcean account using doctl. You will be using terminal commands to add your new public key text file.

1. Copy and run the following code to upload your public key to your DigitalOcean account 

> **NOTE:** You will need to change "git-user" to your desired key name and "~/.ssh/hw-key.pub" to your public key file location

<br>

```bash
doctl compute ssh-key import git-user --public-key-file ~/.ssh/hw-key.pub
```

**What does this code mean?**
* `compute`: Subcommand for managing DigitalOcean Droplets and other compute-related resources
* `import`: To import our SSH key
* `--public-key-file`: Specifies the location of the public key file
<br>

![Image of the public key import to DigitalOcean](/Assets/Images/public_key_upload.png)

2. Copy and run the following code to verify a successful import 

```bash 
doctl compute ssh-key list
```
<br>

*If you need to get the contents of your public key, you can run the following code:*

```bash 
cat ~/.ssh/hw-key.pub
```
**What does this code mean?**
* `cat`: Short for concatenate. It is used to read and output the contents of a file to the terminal

<br>

***

## How to Create a Droplet on DigitalOcean

This step will teach about creating your droplet on the DigitalOcean using doctl. Droplets are Linux-based virtual machines (VMs) that run on top of virtualized hardware.

**This section will teach you how to:**
* Upload an Arch Linux Image to DigitalOcean
* Set up Cloud-Init
* Create a new Arch Linux Droplet

<br>

### Upload an Arch Linux Image to DigitalOcean

You will be uploading an Arch Linux image on the [DigitalOcean](https://www.digitalocean.com/) website for your droplet. It's essentially a snapshot that contains information on everything from the files and folders to the operating system and boot information (DigitalOcean, 2024). This image will be the basis for the droplet to be built with.

You can download the Arch Linux image [here](https://gitlab.archlinux.org/archlinux/arch-boxes/-/packages/).
<br>

1. Click the **Manage** dropdown menu in the left side menu 
2. Select **Backups & Snapshots**
3. Select **Custom Images**
4. Click the blue **Upload Image** button.
5. Upload the Arch Linux image

> NOTE: After clicking upload, a new settings box will open and you will need to select the following settings

6. Select **Arch Linux** in the Distribution dropdown menu
2. Select **San Francisco 3** in the Choose a Datacenter Region Section 
	-  You chose San Francisco 3 as the data center in the example because it is the closest to our location
3. Click **Upload Image** to finish

<br>

### Setting up Cloud-Init  

Cloud-init will allow you to set up a server with some initial configurations. For this guide, the example includes packages in the cloud-init configuration that are some examples of commonly used packages 

<br>

1. Copy and run the following code to create your cloud-config.yaml file

```bash
nvim cloud-config.yaml
```

2. Copy and paste the following code into the file

```bash 
#cloud-config
users:
    name: user-name #change me
    primary_group: user-group # change me
    groups: wheel
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-ed25519 your-ssh-public-key # change this

packages:
  - ripgrep
  - rsync
  - neovim
  - fd
  - less
  - man-db
  - bash-completion
  - tmux
disable_root: true
```

**What does this code mean?**
* `shell: /bin/bash`: Sets the default shell to bash/bin
* `sudo: ['ALL=(ALL) NOPASSWD:ALL']`: Grants the user full sudo privileges without needing to enter a password
* `ssh-authorized-keys`: Allows the user to log in via SSH using public key authentication (DigitalOcean, 2014)
* `disable_root: true:`: Disables root login for the server (DigitalOcean, 2014)


3. Press the `i` key after pasting the text to enter insert mode to edit the file contents
1. Change the information (at least the ssh-authorized-keys)
3. Press `esc` key to exit inset mode
4. Type `":"`, then `"wq"`, and then press enter key to save and finish 

<br>

### Create a New Arch Linux Droplet
You will be running the following `doctl` command to create the droplets.

<br>

1. Copy and paste the following code into your terminal 

```bash 
doctl compute droplet create --image 165084633 --size s-1vcpu-1gb-amd --region sfo3 --ssh-keys 43491384 --user-data-file ~/cloud-config.yaml --wait exampleDroplet
```
**What does this code mean?**

* `doctl compute droplet create`: The command doctl requires to create Droplets
* `--image`: The OS image used to create the Droplet. For this example, the Droplet uses Arch Linux
* `--size s-1vcpu-1gb`: The number of processors and the amount of RAM each Droplet has. In this case, each Droplet has one processor and 1 GB of RAM. The example chooses a low amount but you will want to choose an appropriate amount based on what you'll be doing with the droplet 
* `--region sfo3`: The region to create the Droplets in. In this example, doctl deploys the Droplets into the San Francisco 3 datacenter region because it's the closest location. Choose your data center for whichever is the closest location
* `--ssh-keys`: The SSH keys to import into the Droplet from your DigitalOcean account. You can retrieve a list of available keys by running `doctl compute ssh-key list`
* `--user-data-file <path-to-your-cloud-init-file>`: Specifies the path to your cloud-config.yaml file. For example, `~/cloud-config.yaml`

<br>

**Successful droplet creation looks like:**

![Image of the completed droplet creation](/Assets/Images/complete_droplet_make.png)

<br>

***

## How to Connect to Your Droplet Using SSH

1. Open your Terminal
2. Run the following code to create a config file:

```bash
nvim config
```

3. Copy the following code into your new config file

```bash
Host arch
  HostName 24.144.89.149 #change IP address to the IP address of your droplet
  User arch #change "arch" to match your name in your cloud-init.yaml file
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/hw-key #change "hw-key" to match the name of your private SSH key
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
```
**What does this code mean?**
* `Host`: The host alias you use when you run the SSH command
* `HostName`: The IP address of the droplet you're connecting to
* `User`: The username to be used when connecting to the remote host
* `PreferredAuthentications publickey`: Specifies that you should use public key authentication to login
* `IdentityFile`: The path to the private SSH key on your local machine
* `StrictHostKeyChecking no`: Disables host key checking
* `UserKnownHostsFile`: Tells SSH not to store the server's host key in the known hosts file

<br>

4. Copy the IP address of the droplet from DigitalOcean

![Image of completed droplet](/Assets/Images/completed_droplet.png)

5. Change the **HostName** to the IP address of your droplet
6. Save the Config file to finish


You're now ready to connect to your droplet using SSH! You can now connect to your droplet by using `ssh arch`. This will depend on what you named your host in the previous steps.
