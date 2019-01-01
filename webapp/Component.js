jQuery.sap.includeStyleSheet(sap.ui.resource("JabilPoc.Jabil_Poc", "css/style.css"));
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"JabilPoc/Jabil_Poc/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("JabilPoc.Jabil_Poc.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			var oApplicationModel = new sap.ui.model.json.JSONModel();

			// enable routing
			// this.getRouter().initialize();

			// set the device model
			var that = this;
			this.setModel(models.createDeviceModel(), "device");

			if (this.getComponentData() && this.getComponentData().startupParameters) {
				var startupParameters = this.getComponentData().startupParameters;
				if (startupParameters.inboxAPI) {
					oApplicationModel.setProperty("/runningInInbox", true);
					oApplicationModel.setProperty("/sApplicationPath", startupParameters.oParameters.sApplicationPath);
				}
			}

			// var sUserApiURL = "/services/userapi/attributes?multiValuesAsArrays=true";
			// // if we are running in Inbox...
			// // Service-URLs have to be prefixed with application Path

			// sUserApiURL = "/" + oApplicationModel.getProperty("/sApplicationPath") + sUserApiURL;

			// var oUserModel = new sap.ui.model.json.JSONModel(sUserApiURL);

			// oUserModel.attachRequestCompleted(function (oEvent) {
			// 	if (oEvent.getParameter("success")) {
			// 		var resultData = oUserModel.getData();
			// 		if (resultData) {
			// 			that.userID = resultData.name;
			// 			var taskUrl = window.location.href;
			// 			var instanceId = taskUrl.split("'")[3];
			// 		//	var oController = JabilPoc.Jabil_Poc.controller.approverScreen;
			// 	//		JabilPoc.Jabil_Poc.controller.approverScreen.prototype.getTaskInstanceData(instanceId, oController);

			// 		}
			// 	}
			// });

		}
	});
});