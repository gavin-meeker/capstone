# Capstone

## Deliverables Links

- [Project Plan](https://kennesawedu-my.sharepoint.com/:w:/g/personal/jmeeker2_students_kennesaw_edu/EeUypD47hP9OsqpQWo1TqLYBNx__tu_mJEfPqL8zBsYb_w?e=JZV1kH)
- [Requirements Document](https://kennesawedu-my.sharepoint.com/:w:/g/personal/jmeeker2_students_kennesaw_edu/ETOZZa-FgwRMs6mm9SFuC1YBgKPQ8gBqDNJ4nemFx2Rv6w?e=DK5sNd)
- [Figma UI Design Prototype](https://kennesawedu-my.sharepoint.com/:u:/g/personal/jmeeker2_students_kennesaw_edu/EWlanGjDOBtOu2XjRB_C3DgBdpT_BK8DHqjZo7J-_yB8LA?e=RbKE6B)
- [Design Document](https://kennesawedu-my.sharepoint.com/:w:/g/personal/jmeeker2_students_kennesaw_edu/EYKvJGQ-RChKuto3yPkEx6UBpzTBvfFfRpwpX6fUzI1vjg?e=D8coeK)
- [Milestone 1 Slide Deck](https://kennesawedu-my.sharepoint.com/:p:/g/personal/jmeeker2_students_kennesaw_edu/ES9lw7lWB2tOj2XRWepETfwB_0T51dH1BqgkeCs036wPQA?e=EcddgI)
- [Technical/User Guide](https://kennesawedu-my.sharepoint.com/:w:/g/personal/jmeeker2_students_kennesaw_edu/Eb40qgjM7LBNr4gfMMLzNeYBpd18LMK7yBoiNuc_MHRiyQ?e=LX5cd5)
- [Test Document](https://kennesawedu-my.sharepoint.com/:b:/g/personal/jmeeker2_students_kennesaw_edu/ESCW4DlF7KdHiaR7FMHczLEB3iqN-OU60BDprWkkPt0MGQ?e=1I7eO9)

### Project Setup

### Setting Up the Count

You need to ensure Count-FAKEula cloned and built the server works as expected. To do so, download a copy of the `count-fakula` api and move it into the `./server` directory. After it is moved into the `count-fakeula` run the commands below. These are the same steps outlined in the `README` in the `./server/count-fakeula` directory.

(_This commands are using Mac/Linux tooling, you may need to adjust commands if using windows_).

```shell
cd server/count-fakeula
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py -d
```

### Setting Up Project

**You will have to make a file named `.env.development.local` in the root directory of the project. You can paste the following into that file**

```shell
USERNAME="user"
PASSWORD="pass"
EXPRESS_PORT="8080"
COUNT_PORT="7000"
VITE_EXPRESS_PORT="8080"
```

**Make sure to run `npm install` in the following 3 directories**

```shell
.            # 1 top level directory
./client     # 2 client directory
./server     # 3 server directory
```

- `./client` has the code to run the ReactJS App
- `./server` has the code to run the ExpressJS App
- `./server/count-fakeula` has the code to run the Count-FAKEula

## Scripts to Start the Services

```shell
npm run client # this will start the client react app
npm run sever # this will start the server and count-fakeula
```

After the services are running, the client app should open your browser to the appropriate port of the app.
