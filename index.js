var Slack = require( "slack-client" );

var httpCats = function( key ) {
var slack = new Slack( key, true, true );

slack.on( "open", function() {
	var channels = [];
	var groups = [];
	var unreads = slack.getUnreadCount();

	for ( var channelName in slack.channels ) {
		var channel = slack.channels[ channelName ];
		if ( channel.is_member ) {
			channels.push( "#" + channel.name );
		}
	}

	for ( var groupName in slack.groups ) {
		var group = slack.groups[ groupName ];
		if ( group.is_open && !group.is_archived ) {
			groups.push( channel );
		}
	}

	console.log( "Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name );
	console.log( "You are in: " + channels.join( ", " ) );
	console.log( "As well as: " + groups.join( ", " ) );

	var messages = ( unreads === 1 ) ? "message" : "messages";

	console.log( "You have " + unreads + " " + messages );
} );

slack.on( "message", function( message ) {
	var channel = slack.getChannelGroupOrDMByID( message.channel );
	var user = slack.getUserByID( message.user );
	var response = "";
	var channelName = ( channel && channel.channel ) ? "#" : "";

	channelName = channelName + ( channel ? channel.name : "UNKNOWN_CHANNEL" );

	userName = ( user && user.name ) ? "@" + user.name : "UNKNOWN_USER";

	console.log( "Recieved message from " + userName + " in " + channelName );
	console.log( message.text );
	if ( message.type === "message" && message.text && channel ) {
		var codes = message.text.match( /http(([0-9]){3})|http (([0-9]){3})/g );
		if ( codes && codes.length ) {
			for ( var i = 0; i < codes.length; i++ ) {
				var code = codes[ i ].match( /([0-9]){3}/ );
				console.log( "code" + code[ 0 ] );
				if ( code[ 0 ] ) {
					console.log( "found" );
					channel.send( "https://http.cat/" + code[ 0 ] );
				}
			}
		}
	}
} );

slack.login();

};

module.exports = httpCats;
