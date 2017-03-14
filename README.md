![ga](https://cloud.githubusercontent.com/assets/20629455/23824362/2c9817c2-066d-11e7-8988-7b1eefc6d628.jpg)
![wdi](https://cloud.githubusercontent.com/assets/20629455/23824363/2ddeaa7e-066d-11e7-8630-f7c890c9f1c1.png)

___

## MuSync

#### About

![musync-background](https://cloud.githubusercontent.com/assets/23199168/23894467/22282208-089a-11e7-926f-82db2e709fb7.png)

A music syncing app, where users are invited into private rooms with friends, where the same track will play for all members in the room. Any user can create a room and invite registered users; all users must have a Spotify account (this can be a free _or_ premium account)

1. Log in
2. Create a music 'room'
3. Invite your friends
4. Search for songs
5. Play the song for the whole room


#### How it works:

###### The build:
* Ruby on Rails backend
* AngularJS frontend framework
* PostgreSQL and Redis
* Spotify API
* Action Cable and WebSockets


When the user logs in a request is sent to the API to find the user by email address, if one exists in the database this will trigger the Spotify oAuth. If they are not already logged into Spotify the user will have to log in again here - completing oAuth is essential or the user won't be able to play any music.
<br>
The user is then redirected to a list of all of the rooms that they have access to. You can only see rooms that you have created and rooms that you have been invited to _and_ accepted. 
<br>
The user can create a new music room, which stores in the database but also uses AJAX to make a POST request to the Spotify API, which will also create the room as a collaborative playlist in your Spotify app.
<br>
From within the room you can search for friends to invite them to the room. The request is sent with the sender id, the room id, the receiver id and the request status, which is all stored in the backend. Requests can be accepted and rejected and the room will only show if the request has all of the above id's and the status of 'accepted'.
<br>
From inside the room, any user who is authorized is able to make a GET request to the Spotify API to search for songs - currently it returns 20 results, but this can be increased. Any of the songs can be chosen to play, and the URI is passed into the Spotify embedded player.
<br>Using Action Cable and WebSockets the room will update in real time every time someone changes a song - anyone in the room is able to change the track at any point

![musync-collage](https://cloud.githubusercontent.com/assets/23199168/23895069/65caf042-089c-11e7-8ac7-f384fa85828a.png)


#### Problems & Challenges

The idea of the app was to have the music syncing up in the room, so everyone would be listening to the same playlist and if someone changed the track it would change on all of the other devices as well. Spotify no longer have the auto-play feature, so users have to decide when to press play. Also, at the moment although you can create a collaborative playlist using the Spotify API, you are only able to add songs to the playlist online if you are not the playlist owner, otherwise it has to be through the app. So although the functionality was there to create and add songs to playlists, this issue along with the previous auto-play issue meant that it made more sense to just have one song playing in the room at any one time, so anyone can search and play, and no songs are added to a playlist.


#### Future Improvements

The ideal future improvement would be to have the music completely syncing, so it was at the same point in the track for all users, and the ability to create and play through playlists, with skip functionality that allows a track to change if a certain number in the group has clicked 'next'.
There are currently no user profiles, you would have to know your friend is using the app and then search through and recognise their name. I would like to add these profiles in and have a list of authorized users in the room, so everyone can see the other users and potentially implement a 'chat' feature within the room.
