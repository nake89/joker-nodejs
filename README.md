# Joker Automation

This is a node.js script for automating Joker.com services.
Still in early development. Currently only logs you in and unlocks a domain and gives you the auth-id (transfer key) of a domain.

## Usage

### Installation
`npm i joker-auto -g`

### Login
`joker-auto login`
This command returns the temporary (1h) session id.

###Order auth-id
`joker-auto getkey domain.com <INSERT THE SESSION ID HERE>`
This will queue the auth-id order. You will have to wait a bit.
You will get the queue ID here.

### Show auth-id
`joker-auto showkey <INSERT THE QUEUE ID HERE> <INSERT THE SESSION ID HERE>`
If you do this too fast. You will not get the auth-id. Patience is key.
