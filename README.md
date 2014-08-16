# Listen 2 Me!

L2m! ([http://listen2me.io/](http://listen2me.io/)) is currently a prototype of an application aimed to enable friends to build songs/videos playlists in real-time and collaboratively.
It is easy and fun to use. L2m approach is partially based on IRC style except that each #channel has its own playlist.

## Development notes

### Stack

- NPM 1.4.9
- Node 0.11.13
- Express 4
- Socket.io 0.9
- MongoDB

### Development Tooling

- Grunt
- Bower
- Sass

### Install

```
$ git clone https://github.com/marcusgadbem/listen2me.git
$ cd listen2me
$ npm install
```

### Configure

Create a virtual host so application can be tested with real social media authentication support:

```
$ echo "0.0.0.0 listen2me.dev" >> /etc/hosts
```

### Run

```
$ grunt server
```
Now you should be able to access application in browser: [http://listen2me.dev:8000](http://listen2me.dev:8000)

# Copyright

...
