if (localStorage.DEVICE_UUID == undefined)
{
	var setupTimestamp = parseInt(new Date());
	localStorage.DEVICE_UUID = 
	`${
		osuChat.toolbox.stringGen(4,7)
	}-${
		osuChat.toolbox.b64.to(`${setupTimestamp}&&&&${Math.round(Math.abs((setupTimestamp-new Date(2000,10,01)) / (24 * 60 * 60 * 1000)))}`)
	}-${
		osuChat.toolbox.stringGen(64,3)
	}`
}
const lookup = 
{
	temporary:
	{ },
	firstTime:
	{
		"esix_credentialsValid":"false",
		"esix_downloadLocation": require('electron').remote.app.getPath('downloads'),
		"esix_postsPerPage":"90",
		"esix_enforceGlobalBlacklist": "true",
		"esix_search_savedTags": "[]",
		"esix_tagBlacklist": "[]",
		"esix_videoOptions": "autoplay loop",
		"keymap": 
		JSON.stringify({
			"arrowleft": "previous",
			"arrowright": "next",
			"arrowup": "actionup",
			"arrowdown": "actiondown",
			"keyd": "download",
			"escape": "exit",
			"keyf": "favorite",
			"keys": "save"
		}),
	}
}

if (osuChat.toolbox.JSON.toArray(lookup.temporary).length > 1)
{
	osuChat.toolbox.JSON.toArray(lookup.temporary).forEach((m)=>{
		if (localStorage[m[0]] != undefined) return;
		localStorage[m[0]] = `${m[1]}`;
		console.log(`[defaults] Set '${m[0]}' to '${m[1]}'`);
	})
}

if (osuChat.toolbox.JSON.toArray(lookup.firstTime).length > 1)
{
	osuChat.toolbox.JSON.toArray(lookup.firstTime).forEach((m)=>{
		if (localStorage[m[0]] != undefined) return;
		localStorage[m[0]] = `${m[1]}`;
		console.log(`[defaults] Set '${m[0]}' to '${m[1]}'`);
	})
}