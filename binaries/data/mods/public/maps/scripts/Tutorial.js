Trigger.prototype.events = [];

Trigger.prototype.goals = [];

Trigger.prototype.index = 0;

// Multi-purpose counter if needed when checking the trigger requirements
Trigger.prototype.count = 0;

Trigger.prototype.RegisterNeededTriggers = function()
{
	this.RegisterTrigger("OnPlayerCommand", "OnPlayerCommandTrigger", { "enabled": false });
	this.events.push("OnPlayerCommand");

	for (let goal of this.goals)
	{
		for (let key in goal)
		{
			if (typeof goal[key] !== "function" || this.events.indexOf(key) != -1)
				continue;
			let action = key + "Trigger";
			this.RegisterTrigger(key, action, { "enabled": false });
			this.events.push(key);
		}
	}
};

Trigger.prototype.NextGoal = function()
{
	if (this.index > this.goals.length)
		return;
	let goal = this.goals[this.index];
	let needDelay = true;
	let readyButton = false;
	for (let event of this.events)
	{
		let action = event + "Trigger";
		if (goal[event])
		{
			this[action] = goal[event];
			this.EnableTrigger(event, action);
			needDelay = false;
			this.count = 0;
		}
		else
			this.DisableTrigger(event, action);
	}
	if (needDelay)	// no actions for the next goal
	{
		if (goal.delay)
			this.DoAfterDelay(+goal.delay, "NextGoal", {});
		else
		{
			this.EnableTrigger("OnPlayerCommand", "OnPlayerCommandTrigger");
			this.OnPlayerCommandTrigger = function(msg)
			{ 
				if (msg.cmd.type == "dialog-answer" && msg.cmd.tutorial && msg.cmd.tutorial == "ready")
					this.NextGoal();
			};
			readyButton = true;
		}
	}

	this.GoalMessage(goal.instructions, readyButton, ++this.index == this.goals.length);
};

Trigger.prototype.GoalMessage = function(text, readyButton=false, leave=false)
{
	let cmpGUIInterface = Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface);
	cmpGUIInterface.PushNotification({
		"type": "tutorial",
		"players": [1],
		"message": text,
		"translateMessage": true,
		"readyButton": readyButton,
		"leave": leave
	});
};

Trigger.prototype.WarningMessage = function(txt)
{
	let cmpGUIInterface = Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface);
	cmpGUIInterface.PushNotification({
		"type": "tutorial",
		"players": [1],
		"message": txt,
		"translateMessage": true,
		"warning": true
	});
};

Trigger.prototype.OnPlayerCommandTrigger = function() {};

Trigger.prototype.OnResearchQueuedTrigger = function() {};

Trigger.prototype.OnResearchFinishedTrigger = function() {};

Trigger.prototype.OnStructureBuiltTrigger = function() {};

Trigger.prototype.OnTrainingQueuedTrigger = function() {};

Trigger.prototype.OnTrainingFinishedTrigger = function() {};
