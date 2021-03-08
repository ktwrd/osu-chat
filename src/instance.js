class InstanceManager
{
	constructor(config)
	{
		if (config == undefined)
		{
			throw osuChat.strings.instance.error.nullconfig;
		}
		if (config.type == undefined)
		{
			throw osuChat.strings.instance.error.nullconfigtype;
		}
		this.type = config.type;

		this.validConfigTypes = [];
		osuChat.fs.readdirSync("src/instances").forEach(file => this.validConfigTypes.push(file.replace(".js","")));
		this.GUID = osuChat.toolbox.stringGen(8);
		this.exists = false;
		this.attributes = {
			loader:
			{
				visible: false,
				active: false,
			}
		};
		console.log(`[${this.type}_${this.GUID}] Spawned`)
	}

	async spawn()
	{
		if (osuChat.toolbox.arrayContains(this.validConfigTypes,this.type) && !this.exists)
		{
			// Valid config type, spawn the tab and open it.
			$(`div.instanceData`).append(`
			<div class="instanceContents" GUID="${this.GUID}">

			</div>
			`)
			var tmp_require = require(`./instances/${this.type}.js`)
			$("div.instanceToolbar ul.instanceList").append(`
			<li GUID=${this.GUID}>
				<span action="label">${tmp_require.meta.displayname}</span>
				<span action="close">&#x292B;</span>
			</li>
			`)
			this.processing = new tmp_require.f(this);
			this.listenerInstance = this.listener();
			this.exists = true;
			this.show();
			return this.processing;
		} else if (this.exists) {
			// Tab already exists
			throw osuChat.strings.instance.error.exists;
		} else {
			throw osuChat.strings.instance.error.invalidconfigtype;
		}
	}

	async destroy()
	{
		global.osuChat.loadedInstanceTypes = osuChat.loadedInstanceTypes.filter(e => e !== this.GUID);
		global.osuChat.focusedInstances = osuChat.focusedInstances.filter(e => e !== this.GUID);
		global.osuChat.hiddenInstances = osuChat.hiddenInstances.filter(e => e !== this.GUID);
		global.osuChat.loadedInstanceTypes = osuChat.loadedInstanceTypes.filter(e => e !== this.type);
		$(`div.instanceData div.instanceContents[GUID=${this.GUID}]`).remove();
		$(`div.instanceToolbar ul.instanceList li[GUID=${this.GUID}]`).remove();
		this.exists = false;
		delete this.listenerInstance;
		delete this.processing;
		console.log(`[${this.type}_${this.GUID}] Destroyed`);
	}
	async hide(callback)
	{
		global.osuChat.instances.forEach((i)=>{
			if (i.GUID == this.GUID)
			{
				// Hide our instance
				$(`div.instanceData div.instanceContents[GUID=${i.GUID}]`).hide();
				this.attributes.visible = false;
				if (this.attributes.loader.active)
				{

				}
				if (callback != undefined) {
					callback();
				}
			}
		})
	}
	async show(callback)
	{
		global.osuChat.instances.forEach((i)=>{
			if (i.GUID == this.GUID)
			{
				// Show our instance
				$(`div.instanceData div.instanceContents[GUID=${i.GUID}]`).show();
				this.attributes.visible = true;

				if (callback != undefined) {
					callback();
				}
			} else {
				i.hide();
			}
		})
	}

	attr(name,value)
	{
		// User wants all attributes
		if (name == undefined && value == undefined)
		{
			return this.attribute;
		} else if (name != undefined && value == undefined) {
			// User wants to get attribute
			return this.attribute[name];
		} else {
			// User wants to edit attribute
			return this.attribute[name] == value;
		}
	}

	content(data)
	{
		if (data == undefined)
		{
			return $(`div.instanceContents[GUID=${this.GUID}]`);
		} else {
			console.log(`[${this.type}_${this.GUID}] Content Edited.`)
			return $(`div.instanceContents[GUID=${this.GUID}]`).html(data);
		}
	}
	$(d,callback)
	{
		if (callback == undefined) {
			return $(`div.instanceData div.instanceContents[GUID=${this.GUID}] `+d)
		} else {
			callback($(`div.instanceData div.instanceContents[GUID=${this.GUID}] `+d));
		}
	}
	listener()
	{
		$(`div.instanceToolbar ul.instanceList li`).on('click',(me)=>{
			if (!this.exists) return;
			var selectedGUID = '';
			// Get the GUID of the tab clicked on, we need to use
			//		parentElement if its one of the <span> tags
			//		because they don't have the GUID attribute.
			switch (me.target.tagName)
			{
				case "SPAN":
					selectedGUID = me.target.parentElement.attributes.GUID.value;
					break;
				case "LI":
					selectedGUID = me.target.attributes.GUID.value;
					break;
			}
			if (selectedGUID == this.GUID)
			{
				// Focus our instance because our tab got clicked on

				// Check if the <span> clicked on is the close button
				if (me.target.tagName == 'SPAN' && me.target.attributes.action.value == 'close')
				{
					this.destroy();
				} else {
					if (!this.attributes.visible)
					{
						this.show();
					}
				}
			} else {
				// Defocus our instance because someone elses tab got clicked on only if
				// 		our tab is visible/focused.
				this.hide();
			}
			return;
		})
		$(`div.selectTabType span`).on('click',()=>{
			if (!this.exists) return;
			this.hide();
		})
	}
	loader(visible,title,description)
	{
		if (title != undefined)
		{
			this.attributes.loader.title = title;
			this.attributes.loader.active = true;
			if (this.attributes.visible)
			{
				$(`div.loader [action=title]`).html(title);
			}
		}
		if (description != undefined)
		{
			this.attributes.loader.description = description;
			this.attributes.loader.active = true;
			if (this.attributes.visible)
			{
				$(`div.loader [action=description]`).html(description);
			}
		}
		switch (visible)
		{
			case 'on':
			case true:
				if (this.attributes.visible)
				{
					$(`div.loader`).fadeIn('100ms');
				}
				this.attributes.loader.active = true;
				break;
			case 'off':
			case false:
				if (this.attributes.visible)
				{
					$(`div.loader`).fadeOut('100ms');
					this.attributes.loader.visible = false;
				}
				this.attributes.loader.active = false;
				break;
		}
	}
}
module.exports = InstanceManager;