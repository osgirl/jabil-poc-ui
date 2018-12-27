sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("JabilPoc.Jabil_Poc.controller.inbox", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf JabilPoc.Jabil_Poc.view.inbox
		 */
		onInit: function () {

			var elemVisibilityModel = this.getOwnerComponent().getModel("elemVisibilityModel");
			this.elemVisibilityModel = elemVisibilityModel;
			this.getView().setModel(elemVisibilityModel, "elemVisibilityModel");
			elemVisibilityModel.setProperty("/requestDetailvisible", false);
			elemVisibilityModel.setProperty("/inboxVisible", true);
			elemVisibilityModel.refresh();

			var inBoxModel = new sap.ui.model.json.JSONModel();
			inBoxModel.loadData("model/sampleData.json");
			this.getView().setModel(inBoxModel, "inBoxModel");
			
		},

		onItemSelect: function (oEvent) {
			var oItem = this.getView().byId("oListItems");
		//	var selectedItem = oItem.getSelectedItem("oItem");
			var elemVisibilityModel = this.elemVisibilityModel;
			elemVisibilityModel.setProperty("/requestDetailvisible", true);
			elemVisibilityModel.setProperty("/inboxVisible", false);
			elemVisibilityModel.refresh();
		},
		onBack: function () {
			var elemVisibilityModel = this.elemVisibilityModel;
			elemVisibilityModel.setProperty("/requestDetailvisible", false);
			elemVisibilityModel.setProperty("/inboxVisible", true);
			elemVisibilityModel.refresh();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf JabilPoc.Jabil_Poc.view.inbox
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf JabilPoc.Jabil_Poc.view.inbox
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf JabilPoc.Jabil_Poc.view.inbox
		 */
		//	onExit: function() {
		//
		//	}

	});

});