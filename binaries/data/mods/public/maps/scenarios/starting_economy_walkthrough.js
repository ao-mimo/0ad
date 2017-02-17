let goals = [
	{
		"name": "intro",
		"instructions": markForTranslation("This tutorial will let you learn how to develop your economy. You usually start with a bunch of units and a civil center at the 'Village Phase' and your goal is to make them develop, evolving to 'Town Phase' and then 'City Phase'.\n" +
			"Select your building, the civil centre, by clicking on it. Its selection ring should be highlighted with the color of your civilization."),
	},
	{
		"name": "productionPanel",
		"instructions": markForTranslation("The civil center production panel appears on the bottom right, with icons representing the different possibilities: a grey icon means that the corresponding item is not yet available and a red icon means that you don't have enough resources for it. You can pass the mouse over the icons to see what is needed in both cases.\n" +
			"The top line display the units which can be trained in this building, while the bottom line displays the technologies which can be researched. Pass your mouse over the icon of the bottom line: we have to build some structures and we need food and wood resources to go to 'Town Phase'."),
	},
	{
		"name": "outline",
		"instructions": markForTranslation("This tutorial will show you how to gather resources and build structures."),
	},
	{
		"name": "gatherFruit",
		"instructions": markForTranslation("\nAt this point, Food and Wood are the most important resources for expanding your civ, so let's get started with food gathering. Females have the higher food gather rates, thus select all of them and then right-click on the grapes (just near your civil centre, on the south-east) when you see a fruit cursor.\n" +
			"To select the females, you can either grab them with the mouse (which will select all units inside the selection rectangle) or click on one of them and then add the other ones by shift-clicking each of them or double-click on one of them (which will select all visible units of the same kind): try these 3 ways before asking them to gather the grapes. Selected units have their selection ring highlighted and click on an empty point to reset the selection."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "gather" && msg.cmd.target &&
				TriggerHelper.GetResourceType(msg.cmd.target).specific == "fruit")
				this.NextGoal();
		}
	},
	{
		"name": "gatherWood",
		"instructions": markForTranslation("Let's now gather some wood with your citizen soldiers; Select them and right-click on the nearest tree, you should see a tree cursor."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "gather" && msg.cmd.target &&
				TriggerHelper.GetResourceType(msg.cmd.target).specific == "tree")
				this.NextGoal();
		}
	},
	{
		"name": "gatherMeat",
		"instructions": markForTranslation("Cavalry are good for hunting. You can start targeting chicken. Select your cavalry and right-click on some chiken when you see a meat cursor."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "gather" && msg.cmd.target &&
				TriggerHelper.GetResourceType(msg.cmd.target).specific == "meat")
				this.NextGoal();
		}
	},
	{
		"name": "setRallyPointOnWood",
		"instructions": markForTranslation("All your units are now gathering resources. It is time to learn how to produce more units.\n" +
			"But first, let's see how to set a rally-point for newly produced units to do a specific task. We want to send the newly trained units gathering wood on the bunch of trees in the south of the civil centre. To do so, select the civil centre by clicking on it and then right-click on one of the trees.\n" +
			"Rally-Points are indicated by a small flag at the end of the blue line."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type != "set-rallypoint" || !msg.cmd.data ||
			   !msg.cmd.data.command || msg.cmd.data.command != "gather" ||
			   !msg.cmd.data.resourceType || msg.cmd.data.resourceType.specific != "tree")
			{
				this.WarningMessage(markForTranslation("Select the civil centre, then pass the mouse over the tree and Right-click when you see a wood icon."));
				return;
			}
			this.NextGoal();
		}

	},
	{
		"name": "train5Hoplites",
		"instructions": markForTranslation("Now that the rally-point is setup, we can produce a few additional units.\n" +
			"As soldiers are better than females for wood gathering, select the civil centre and shift-click on the second unit icon, the hoplites (shift-clicking allows to produce a batch of five units)."),
		"OnTrainingQueued": function(msg)
		{
			if (msg.unitTemplate != "units/athen_infantry_spearman_b" || +msg.count == 1)
			{
				let entity = msg.trainerEntity;
				let cmpProductionQueue = Engine.QueryInterface(entity, IID_ProductionQueue);
				cmpProductionQueue.ResetQueue();
				let txt = +msg.count == 1 ?
					markForTranslation("Do not forget to shift-click to produce several units.") :
					markForTranslation("Shift-click on the HOPLITE icon.");
				this.WarningMessage(txt);
				return;
			}
			this.NextGoal();
		}
	},
	{
		"name": "waitTraining",
		"instructions": markForTranslation("Let's wait for the units to be trained.\n" +
			"While waiting, look at the top panel: you see there your amount of resources, and see them increase when a worker brings them back to the civil centre. That's an important concept to keep in mind: gathered resources have to be brought back to a dropsite to be accounted, and your should always try to minimize the distance to improve your gathering rate."),
		"OnTrainingFinished": function(msg)
		{
			this.NextGoal();
		}
	},
	{
		"name": "buildDropsite",
		"instructions": markForTranslation("The new units automatically go to the trees and start gathering wood.\n" +
			"But as they have to bring it back to the civil centre to deposit it, their gathering rate suffer from the distance. To fix that, we can build a storehouse near the trees. To do so, select your five new soldiers and look for the construction panel on the bottom right, then click on the storehouse icon, move the mouse as near as possible to the trees you want to collect and click on a valid place to build the dropsite.\n" +
			"Invalid (obstructed) positions are indicated in red."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "construct" && msg.cmd.template == "structures/athen_storehouse")
				this.NextGoal();
		}
	},
	{
		"name": "waitBuilding",
		"instructions": markForTranslation("As soon as the foundation is placed, the builders start its construction."),
		"OnStructureBuilt": function(msg)
		{
			let cmpResourceDropsite = Engine.QueryInterface(msg.building, IID_ResourceDropsite);
			if (cmpResourceDropsite && cmpResourceDropsite.AcceptsType("wood"))
				this.NextGoal();
		},
	},
	{
		"name": "train5Females",
		"instructions": markForTranslation("And when the construction finishes, the units switch back to wood gathering.\n" +
			"Let's train some females workers to gather more food. Select the civil centre and shift-click on the female icon."),
		"OnTrainingQueued": function(msg)
		{
			if (msg.unitTemplate != "units/athen_support_female_citizen" || +msg.count == 1)
			{
				let entity = msg.trainerEntity;
				let cmpProductionQueue = Engine.QueryInterface(entity, IID_ProductionQueue);
				cmpProductionQueue.ResetQueue();
				let txt = +msg.count == 1 ?
					markForTranslation("Do not forget to shift-click to produce several units.") :
					markForTranslation("Shift-click on the HOPLITE icon.");
				this.WarningMessage(txt);
				return;
			}
			this.NextGoal();
		}
	},
	{
		"name": "waitTraining",
		"instructions": markForTranslation("Let's wait for the units to be trained.\n" +
			"In the meantime, as we don't want to send them gathering wood, we should remove the current rally-point of the civil centre. For that purpose, right-click on the civil centre when it is selected (and the flag icon indicating the rally-point is crossed)."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "unset-rallypoint")
				this.NextGoal();
		}
	},
	{
		"name": "waitTraining",
		"instructions": markForTranslation("The units should be ready soon now.\n" +
			"In the meantime, let's have a look at your population count on the top panel (the fifth item, after the resources). You should always keep an eye on it. It indicates your current population (including those being trained) and the limit allowed."),
		"OnTrainingFinished": function(msg)
		{
			this.NextGoal();
		}
	},
	{
		"name": "buildHouse",
		"instructions": markForTranslation("Now that the units are ready, let's build two houses.\n" +
			"Indeed, as you have nearly reached the population limit, you must increase it by building some new structures if you want to train more units. The one with a good ratio of additional population over cost and which is available already in the first phase is the house.\n" +
			"Select two of your newly created women and ask them to build these houses in the empty space on the east of the civil centre. For that purpose, click on the house icon in the bottom right panel and shift-click on the position in the map where you want to build the first house followed by a shift-click on the position of the second house (when giving orders, shift-click put the order in the queue and the units will automatically switch to the next order in their queue when they finish their work). You may need to click on an empty space to get rid of the house cursor.\n" +
			"Reminder: to select only two females, click on the first one and then shift-click on the second one to add it to the selection."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "construct" && msg.cmd.template == "structures/athen_house" &&
				++this.count == 2)
				this.NextGoal();
		}
	},
	{
		"name": "buildFarm",
		"instructions": markForTranslation("Then we will see how to build fields which produce an infinite food resource.\n" +
			"But to minimize the path done by our farmers to bring back the food to a dropsite, we will first build a farm.\n" +
			"Select the three remaining (idle) women and ask them to build a farmstead in the center of the large open area in the west of the civil centre.\n" + 
			"We will need room around to build fields and, in addition, we can see some goats on the west side so having a food dropsite not far will be useful.\n" + 
			"If you try to select the three idle women by grabing them, there is a high chance that one additional gatherers is included in your selection rectangle. To prevent that, press the 'i' key while grabing: only idle units are then selected. And if during your grabing you select the cavalry which may now be idle, you can remove it by control-clicking on its icon in the selection panel (bottom centre)."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "construct" && msg.cmd.template == "structures/athen_farmstead")
				this.NextGoal();
		}
	},
	{
		"name": "waitHouse",
		"instructions": markForTranslation("When the farmstead will be built, its builders will automatically look for food around, going after the nearby goats.\n" +
			"But your house builders will only look for something else to build and, if nothing found, become idle. Let's wait for them to build the houses."),
		"OnStructureBuilt": function(msg)
		{
			if (TriggerHelper.EntityHasClass(msg.building, "House") && ++this.count == 2)
				this.NextGoal();
		},
	},
	{
		"name": "buildField",
		"instructions": markForTranslation("When both houses are built, select your two females and ask them to build a field as near as possible to the farmstead (farms are a dropsite for all food)."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "construct" && msg.cmd.template == "structures/athen_field")
				this.NextGoal();
		}
	},
	{
		"name": "gatherGoats",
		"instructions": markForTranslation("When the field is built, the builders will automatically start gathering it.\n" +
			"The cavalry should have slaughtered all chicken by now. Select it and right-click on one of the goats in the west to start slaughtering them."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "gather" && msg.cmd.target &&
				TriggerHelper.GetResourceType(msg.cmd.target).specific == "meat")
				this.NextGoal();
		}
	},
	{
		"name": "addFarmers",
		"instructions": markForTranslation("A field can have up to five farmers working on it. To add some new one, select again the civil centre and setup a rally-point on the field by right-clicking on it. As long as the field is not yet build, new workers sent by a rally-point will help building it, while they will gather it when built."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type != "set-rallypoint" || !msg.cmd.data || !msg.cmd.data.command ||
			    msg.cmd.data.command != "build" || !msg.cmd.data.target ||
			    !TriggerHelper.EntityHasClass(msg.cmd.data.target, "Field"))
			{
				this.WarningMessage(markForTranslation("Select the civil centre and right-click on the field."));
				return;
			}
			this.NextGoal();
		}
	},
	{
		"name": "addFarmersFollowup",
		"instructions": markForTranslation("Now click three times on the female icon in the bottom right panel to train three additional farmers."),
		"OnTrainingQueued": function(msg)
		{
			if (msg.unitTemplate != "units/athen_support_female_citizen" || +msg.count != 1)
			{
				let entity = msg.trainerEntity;
				let cmpProductionQueue = Engine.QueryInterface(entity, IID_ProductionQueue);
				cmpProductionQueue.ResetQueue();
				let txt = +msg.count == 1 ?
					markForTranslation("Do a simple click to produce only one unit.") :
					markForTranslation("Click on the FEMALE icon.");
				this.WarningMessage(txt);
				return;
			}
			if (++this.count < 3)
				return;
			this.NextGoal();
		}
	},
	{
		"name": "researchTech",
		"instructions": markForTranslation("You can increase the gather rates of your workers by researching new technologies available in some buildings.\n" +
"The farming rate for example can be improved in the farmstead. Select it and look at its production panel on the bottom right. You see there several researchable technologies. Pass the mouse over them to see what are their cost and their effect and click on the one you want to research."),
		"OnResearchQueued": function(msg)
		{
			if (msg.technologyTemplate && TriggerHelper.EntityHasClass(msg.researcherEntity, "Farmstead"))
				this.NextGoal();
		}
	},
	{
		"name": "buildBarracks",
		"instructions": markForTranslation("Select again the civil centre and pass the mouse over the 'Town Phase' icon to see what is still needed.\n" +
			"We now have enough resources, but one structure is missing. Although this is an economic tutorial, it is nonetheless useful to be prepared for defense in case of attack, so let's build barracks.\n" +
			"Select four of your soldiers and ask them to build barracks: as before, start selecting the soldiers, click on the barracks icon in their production panel and then click in an empty space not far from your civil centre where you want to build."),
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "construct" && msg.cmd.template == "structures/athen_barracks")
				this.NextGoal();
		}

	},
	{
		"name": "waitBarracks",
		"instructions": markForTranslation("Let's wait for the barracks to be built."),
		"OnStructureBuilt": function(msg)
		{
			if (TriggerHelper.EntityHasClass(msg.building, "Barracks"))
				this.NextGoal();
		},
	},
	{
		"name": "researchPhase",
		"instructions": markForTranslation("You should now be able to go to 'Town Phase'. Select the civil centre and click on the tech icon."),
		"OnResearchQueued": function(msg)
		{
			if (msg.technologyTemplate && TriggerHelper.EntityHasClass(msg.researcherEntity, "CivilCentre"))
				this.NextGoal();
		}
	},
	{
		"name": "PhaseUp",
		"instructions": markForTranslation("In later phase, you need usually stone and metal to build bigger structures and train better soldiers. So while waiting for the research to be done, you will send half of your idle soldiers (those having built the barracks) to gather rock and the other half to gather metal.\n" +
			"So we could select two of them and click on the rock mine on the west of the civil centre (a stone cursor is shown when you pass the mouse over it while your soldiers are selected. But remember these soldiers were gathering wood, so they may still carry some wood which would be lost when starting to gather something else. So we will ask them to deposit their wood in the civil centre along the way. For that, we will queue orders with shift-click: select your soldiers, shift-click on the civil centre to deposit their wood and then shift-click on the stone mine to gather it.\n" +
			"Finally some thing with the last two soldiers and the metal mine: select the last two soldiers, shift-click on the civil centre and then shift-click on the metal mine also on the west."),
		"OnResearchFinished": function(msg)
		{
			if (msg.tech == "phase_town_athen" && ++this.count == 3)
				this.NextGoal();
		},
		"OnPlayerCommand": function(msg)
		{
			if (msg.cmd.type == "gather" && msg.cmd.target &&
				TriggerHelper.GetResourceType(msg.cmd.target).generic == "stone" &&
				++this.count == 3)
				this.NextGoal();
			if (msg.cmd.type == "gather" && msg.cmd.target &&
				TriggerHelper.GetResourceType(msg.cmd.target).generic == "metal" &&
				++this.count == 3)
				this.NextGoal();
		}
	},
	{
		"name": "end",
		"instructions": markForTranslation("This is the end of the walkthrough. This should give you a good idea of how to start up a nice economy rapidly.")
	}
];

{
	let cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);
	cmpTrigger.goals = goals;
	cmpTrigger.RegisterNeededTriggers();
	cmpTrigger.DoAfterDelay(1000, "NextGoal", {});
}
