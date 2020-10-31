# Coding Challenge

#### Donnie R. Battle Jr.

## **Installation**

1. Clone the Repo `git clone https://github.com/drb0rn4gr8ness/mediavine-coding-challenge
2. Change into the tallyscore Directory

```
cd tallyscore
```

3. Install dependencies

```
npm install
```

## **Usage**

There are two different versions of the application that have been made available.

### **CLI**

The **CLI** version is to be used from the command line. It accepts 1 argument which is the file that you would like to tally scores for. Other options include `--version` to see the current version and `--help` to get help if you forget the commands.

The **CLI** version can be ran with 1 of 2 methods.

1. Running the file directly from the directory
   ```
   bin/tallyscores.js -f <filename>
   ```
2. Installing the tool globally
   ```bash
   npm install -g .
   tallyscores -f <filename>
   ```

### **WebVersion**

The **Web** version is made accessible from the web browser. You can upload the file and the web page will display the results.

The **Web** version runs by default on port 8080. However, the application must be started first. To use the application use the following commands.

1. Start the server with `npm start`
2. Browse to localhost:8080
3. Upload your file

> NOTE: Example Files can be found in the examples folder
