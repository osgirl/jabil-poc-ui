sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("JabilPoc.Jabil_Poc.controller.View1", {

		onInit: function () {

			var that = this;
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this.oHeader = {
				"Accept": "application/json",
				"Content-Type": "application/json"
			};
			this._router.attachRoutePatternMatched(function (oEvent) {
				var viewName = oEvent.getParameter("name");
				//	that.getOwnerComponent().tileSelected= that.getOwnerComponent().getComponentData().startupParameters.tile[0];
			});
			//	this._router.navTo("requestScreen"); 

			var path = jQuery.sap.getModulePath("JabilPoc.Jabil_Poc");
			var oDataModel = this.getOwnerComponent().getModel("oMatTableDataModel");
			oDataModel.loadData(path + "/model/data.json", null, false);
			this.oDataModel = oDataModel;
			this.getView().setModel(oDataModel, "oDataModel");
			oDataModel.refresh();
			
			var oMarginAllDataModel = this.getOwnerComponent().getModel("oMarginAllDataModel");
			oMarginAllDataModel.getData().listRequestDto=[];
			this.oMarginAllDataModel = oMarginAllDataModel;
			this.getView().setModel(oMarginAllDataModel, "oMarginAllDataModel");

			var oMarginDataModel = this.getOwnerComponent().getModel("oMarginDataModel");
			oMarginDataModel.getData().listRequestDto=[];
			this.oMarginDataModel = oMarginDataModel;
			this.getView().setModel(oMarginDataModel, "oMarginDataModel");

			this.getUserDetails();

		},

		getUserDetails: function () {
			var oUserModel = this.getOwnerComponent().getModel("oUserModel");
			var sUrl = "/services/userapi/currentUser";
			var oModel = new sap.ui.model.json.JSONModel();
			var that = this;
			oModel.loadData(sUrl, true, "GET", false, false);
			oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oEvent.getSource().getData();
					if (resultData) {
						oUserModel.setData(resultData);
						var sideNav = that.getView().byId("sideNavigation");
						if (resultData.name === "P1940781507") {
							sideNav.getItem().getItems()[2].setVisible(false);
						}

					}
				} else {
					sap.m.MessageToast.show("Internal Server Error");
				}
			});
			oModel.attachRequestFailed(function (oEvent) {
				sap.m.MessageToast.show("Internal Server Error");
			});
		},

		onCollapseExpandPress: function () {
			/*var oSideNavigation = this.byId('sideNavigation');
			var bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);*/
			var sViewId = this.getView().getId();
			var oToolPage = sap.ui.getCore().byId(sViewId + "--rootApp");
			/*	var bSideExpanded = oToolPage.getSideExpanded();
				this._setToggleButtonTooltip(bSideExpanded);*/
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		onHideShowSubItemPress: function () {
			var navListItem = this.byId('subItemThree');

			navListItem.setVisible(!navListItem.getVisible());
		},
		onItemSelect: function (oEvent) {
			var selectedKey = oEvent.getParameters().item.getKey();
			var sideNav = this.getOwnerComponent().getRootControl().byId("sideNavigation");
			if (selectedKey === "marginMaintenance") {
				//	this.getOwnerComponent().getComponentData().startupParameters.tile[0]="1";
				this._router.navTo("marginMaintenance");
			} else if (selectedKey === "Main") {
				//	this.getOwnerComponent().getComponentData().startupParameters.tile[0]="2";
				this._router.navTo("requestScreen");
			} else if (selectedKey === "Reports") {
				//	this.getOwnerComponent().getComponentData().startupParameters.tile[0]="4";
				this._router.navTo("Reports");
			} else if (selectedKey === "Inbox") {
				//	this.getOwnerComponent().getComponentData().startupParameters.tile[0]="3";
				this._router.navTo("inbox");
			} else if (selectedKey === "sideNav") {
				var item = sideNav.getItem().getSelectedItem();
				sideNav.setSelectedItem(item);
				this.onCollapseExpandPress(oEvent);
			}
		}

	});
});