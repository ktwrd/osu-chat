class Instance
{
	defaultPage()
	{
		this.instance.content(`
			<div class="center">
				<h1>osu!chat</h1>
				<table class="home">
					<tr>
						<td>
							<h3>login details</h3>
							<input type="text" required placeholder="username">
							<input type="password" required placeholder="irc password">
						</td>
						<td>
							<h3>connection settings</h3>
							<input type="text" for="ircAddress" placeholder="addr: irc.ppy.sh">
							<input type="number" for="ircPort" placeholder="port: 6667">
							<input type="text" for="initialChannel" placeholder="channel: #announcements">
						</td>
					</tr>
				</table>
				<div class="animationContainer">		
					<h3 action="connectIRC" allow="true">connect!</h3>
				</div>
			</div>
		`)
	}

	async functionListener()
	{

	}

	storage = {

	}

	constructor(instance)
	{
		this.instance = instance;
		console.log(`[home_${this.instance.GUID}] Spawned`)
		this.defaultPage();
		this.listen = this.functionListener();
	}
}
module.exports = {
	f: Instance,
	meta: {
		type: "home",
		displayname: "Home",
		openOnLaunch: true,
		duplicatable: false,
	}
}