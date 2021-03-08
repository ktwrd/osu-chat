global.$ = require("jquery");
global.osuChat = 
{
	toolbox: require("tinytoolbox"),
	$: require("jquery"),
	fs: require("fs"),
	strings: require("./strings.json"),
	instanceManager: require("./instance.js"),
	focusedInstances: [],
	hiddenInstances: [],
	instances: [],
	loadedInstanceTypes: [],
	notification: (g_type,g_context,g_duration) => {
		var t_GUID = osuChat.toolbox.stringGen(6);
		$("div.notification ul").append(`
		<li GUID=${t_GUID} action="notification">
			<span type="${g_type}">${g_context}</span>
		</li>
		`)
		setTimeout(()=>{
			$(`div.notification li[GUID=${t_GUID}]`).addClass('active');
			setTimeout(()=>{
				$(`div.notification li[GUID=${t_GUID}]`).removeClass('active');
				setTimeout(()=>{
					$(`div.notification li[GUID=${t_GUID}]`).remove();
				},500)
			},localStorage.esix_notificationDecay || g_duration || 2500);
		},50)
		return;
	},
	externalLink: ()=>{
		require("jquery")("span#outsidelink").click((me)=>{
			var outsideLink = me.target.attributes.data.value;
			require("electron").shell.openExternal(outsideLink);
		});
	}
};

require("./defaults.js");
let tmp_instanceFiles = [];
osuChat.fs.readdirSync("src/instances").forEach(file => tmp_instanceFiles.push(require(`./instances/${file}`)));
tmp_instanceFiles.forEach((i)=>{
	$("div.selectTabType ul").append(`
	<li>
		<span type="${i.meta.type}">${i.meta.displayname}</span>
	</li>
	`)
})
$("span[action=newInstance]").on('click',()=>{
	if ($("div.selectTabType").is(":visible"))
	{
		$("div.selectTabType").fadeOut("fast");
	} else {
		$("div.selectTabType").fadeIn("fast");
	}
})

var loadInstance = async (instanceType) =>
{
	var instance = new osuChat.instanceManager({type:instanceType});
	await osuChat.instances.push(instance);
	await osuChat.loadedInstanceTypes.push(instanceType);
	await instance.spawn();
}

loadInstance('home');

$("div.selectTabType ul li").on('click',async (me)=>{
	console.log(me)
	$("div.selectTabType").fadeOut("fast")
	var instance = {};
	var t = '';
	if (me.target.tagName == "SPAN")
	{
		t = me.target.attributes.type.value
	} else {
		t = me.target.lastElementChild.attributes.type.value
	}
	if (t == 'settings' && osuChat.toolbox.arrayContains(osuChat.n,'settings'))
	{
		// Disallow creation of settings instance
		alert("Prefrences Instance can Only be created once.");
	} else
	{
		loadInstance(t);
	}
})

$(document).ready(()=>{
	setTimeout(async ()=>{
		$("div.loader.initial").fadeOut('fast');
		setInterval(()=>{
			$("div.loader.initial").remove();
		},500)
	},1000)
})

