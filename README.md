# Capstone

## For Development

### Project Setup

### Setting Up the Count

You need to ensure Count-FAKEula is built in order to ensure the server works as expected. To do so, run the following commands (_this assumes you are using Mac/Linux, you may need to adjust commands if using windows_)

```shell
cd server/count-fakeula
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py -d
```

### Setting Up Project

**Make sure to `npm i` in the following 3 directories**

```shell
.            # 1 top level directory
./client     # 2 client directory
./server     # 3 server directory
```

- `client` has the code to run the ReactJS App
- `server` has the code to run the ExpressJS App
- `server/count-fakeula` has the code to run the Count-FAKEula

## Scripts to Start the Services

```shell
# run in ./server directory
npm run server-dev        # to start the express app
npm run start-the-count   # to start the count

# run in ./client directory
npm run dev               # to start the react app
```
