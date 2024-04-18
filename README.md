# Instructions for Facilitators



## Requirements
- [nodejs](https://nodejs.org/en/)

## Install & Run

```
yarn install
yarn start
```
Start in debug mode (activate debug mode for `xinsurance:server`):

```
DEBUG=xinsurance:server yarn start
```

## Test the network
During the workshop, HTTP packages will be exchanged between participant's computers and the server. Although, many networks block incoming connections using firewalls, which will prevent the server from reaching participants.

Before you start an Extreme Insurance workshop, it is strongly recommended that you test if the network you will playing with accepts incoming connections. Follow the instructions bellow.

1. Connect a first computer in the network
1. In that computer run: `$ echo "Hello Extreme Insurance" | nc -l 3000`
1. Connect a second computer in the network
1. In the second computer run: `$ nc <IP address of the 1st computer> 3000 | tee `
1. If the network allows incoming connections, you should see the message `Hello Extreme Insurance` appearing in the second computer

## Freeze the game to make everyone start at the same time

People will take time to setup their HTTP server. Some of them will need more time than others, because of setup problems.

As a facilitator, you may want everyone to be ready before starting the game, to be fair with people that had problems.

You can do this this way:

1. Open ``configuration.json`` file 
1. Replace ``"cashFreeze": false,`` with ``"cashFreeze": true,`` and save
1. Start the game server with ``yarn start``
1. Make everyone register
1. Thanks to the ``cashFreeze`` parameter, everyone's cash stays at 0.
1. Wait until every team is registered **and marked online**. This means the game is setup for everyone.
1. Say '*Looks like that everyone is ready. Then I will start the game in 5 seconds.*' 
1. Open ``configuration.json`` file 
1. Replace ``"cashFreeze": true,`` with ``"cashFreeze": false,`` and save
1. Player's cash is now evaluated. The game starts!

## Workshop
Extreme Insurance is intended to be played with Product Owners (PO) and Developers together. It can be played with only Developers, but slicing strategies tend to be more biased since developers generally focus more on code and than on product and iterations.

The workshop has mainly 3 stages: slicing, implementation and retrospective. A session normally takes between 1:30 and 3:00 hours.

At the beginning, the facilitator exposes the problem to be solved to participants. The participants then form teams between 2-4 (ideally) and try to understand and slice the problem, and together define an implementation strategy, based on product value perspective and technical challenges trade-offs.

Next, the facilitator starts the server and makes sure all the teams are able to exchange HTTP messages with the server. Once everyone is ready, the facilitator allows teams to start implementing (normally requires restarting the server to reset the score) and people start playing.

During the session, the facilitator can activate some "constraints" via the [configuration.json file](https://github.com/qpautrat/extreme-insurance/blob/main/configuration.json), in order to bring some chaos to the game and shake the score. Some examples are: send bad requests (**in which case participants should respond 400 - bad request**); change reduction strategies; change tax rules; charge downtime; etc. Any change to this file is automatically taken into account, no need to restart the server. It is up to the facilitator to announce when he/she triggers a constraint, based on how he/she wants to conduct the session.

At the end, when the facilitator decides to stop the implementation session and the winner becomes known, he/she takes some time at to exchange with participants about the exercise: what worked well, what could be improved, feedbacks, learnings, etc.

## Source

This kata is highly inspired from [extreme-carpaccio](https://github.com/dlresende/extreme-carpaccio/) one.
It changed the domain from pricing order to pricing insurance quote.
More details about the exercise [here](https://diegolemos.net/2016/01/07/extreme-carpaccio/).