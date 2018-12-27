sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/BusyDialog",
], function (Controller, Filter, FilterOperator, BusyDialog) {
	"use strict";

	return Controller.extend("JabilPoc.Jabil_Poc.controller.marginMaintenance", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf JabilPoc.Jabil_Poc.view.marginMaintenance
		 */
		onInit: function () {

			this.oHeader = {
				"Accept": "application/json",
				"Content-Type": "application/json"
			};
			this.busy = new BusyDialog();

			this.oMarginDataModel = this.getOwnerComponent().getModel("oMarginDataModel");
			this.oMarginAllDataModel = this.getOwnerComponent().getModel("oMarginAllDataModel");
			this.elemVisibilityModel = this.getOwnerComponent().getModel("elemVisibilityModel");
			var elemVisibilityModel = this.elemVisibilityModel;
			this.getView().setModel(elemVisibilityModel, "elemVisibilityModel");
			this.elemVisibilityModel.setProperty("/tableEditIcon", false);
			this.elemVisibilityModel.setProperty("/tablDeleteIcon", false);
			elemVisibilityModel.refresh();

			this.allData = [];
			var tableRowSelect = [];

			this.getAllRecords();
		},

		getAllRecords: function (pagenumber) {
			var that = this;
			this.busy.open();
			var oMarginDataModel = this.oMarginDataModel;
			var oMarginAllDataModel = this.oMarginAllDataModel;
			var sUrl = "/jabilPriceUpdate/POC_JABIL/service.xsjs/getall?pageNumber=1";
			// if (pagenumber) {
			// 	var sUrl = "/jabilPriceUpdate/POC_JABIL/service.xsjs/getall?pageNumber=" + pagenumber;
			// } else {
			// 	var sUrl = "/jabilPriceUpdate/POC_JABIL/service.xsjs/getall?pageNumber=1";
			// }
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, "", true, "GET", false, false, this.oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oModel.getData();
					if (resultData) {
						that.getAllData= jQuery.extend(true, [], resultData);
						that.allData = jQuery.extend(true, [], resultData);
						that.result = jQuery.extend(true, [], resultData);
						oMarginAllDataModel.getData().listRequestDto = resultData;

						oMarginDataModel.getData().listRequestDto = oMarginAllDataModel.getData().listRequestDto.splice(0, 20);
						oMarginAllDataModel.getData().listRequestDto = that.result;
						// var pgnBtnGroup = that.getView().byId("pgnId");
						// var pageBtn = pgnBtnGroup.getItems()[1];
						// pgnBtnGroup.setSelectedButton(pgnBtnGroup.getItems()[1]);

						//	oComboLapiDataModel.setData(resultData);
						that.busy.close();
						oMarginDataModel.refresh();
					}
				} else {
					//			var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
					//		formatter.toastMessage(errorText);
					that.busy.close();
				}
			});
			oModel.attachRequestFailed(function (oEvent) {
				//	var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
				//	formatter.toastMessage(errorText);
				that.busy.close();
			});
		},

		onUpdateRecord: function (payload) {
			var that = this;
			this.busy.open();
			var oMarginDataModel = this.oMarginDataModel;
			var sUrl = "/jabilPriceUpdate/POC_JABIL/service.xsjs/updateCMMatrix";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify(payload), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oModel.getData();
					if (resultData) {
						// oMarginDataModel.getData().listRequestDto = resultData;

						// var pgnBtnGroup = that.getView().byId("pgnId");
						// var pageBtn = pgnBtnGroup.getItems()[1];
						// pgnBtnGroup.setSelectedButton(pgnBtnGroup.getItems()[1]);

						//	oComboLapiDataModel.setData(resultData);
						that.busy.close();
						oMarginDataModel.refresh();
					}
				} else {
					//			var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
					//		formatter.toastMessage(errorText);
					that.busy.close();
				}
			});
			oModel.attachRequestFailed(function (oEvent) {
				//	var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
				//	formatter.toastMessage(errorText);
				that.busy.close();
			});
		},

		onSearch: function () {
			var that = this;
			this.busy.open();
			var oMarginDataModel = this.oMarginDataModel;
			var oMarginAllDataModel = this.oMarginAllDataModel;
			var payload = {
				commodity: "CAPACITOR-CERAMIC",
				subCommodity: "MLCC-SMT"
			};
			var sUrl = "/jabilPriceUpdate/POC_JABIL/service.xsjs/searchCMMatrix";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify(payload), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oModel.getData().result;
					if (resultData) {
						that.getAllData= jQuery.extend(true, [], resultData);
						that.allData = jQuery.extend(true, [], resultData);
						that.result = jQuery.extend(true, [], resultData);
						oMarginAllDataModel.getData().listRequestDto = resultData;

						oMarginDataModel.getData().listRequestDto = oMarginAllDataModel.getData().listRequestDto.splice(0, 20);
						oMarginAllDataModel.getData().listRequestDto = that.result;

						that.busy.close();
						oMarginDataModel.refresh();
					}
				} else {
					//			var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
					//		formatter.toastMessage(errorText);
					that.busy.close();
				}
			});
			oModel.attachRequestFailed(function (oEvent) {
				//	var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
				//	formatter.toastMessage(errorText);
				that.busy.close();
			});
		},

		filterGlobally: function (oEvent) {
			var that = this;
			that.containData = [];
			var oMarginAllDataModel = this.oMarginAllDataModel;
			this.oMarginAllDataModel.getData().listRequestDto= this.getAllData;
			if (oEvent) {
				var sQuery = oEvent.getParameter("query");
			} else {
				var sQuery = "";
			}
			this._oGlobalFilter = null;

			if (sQuery) {
				this.oMarginAllDataModel.getData().listRequestDto.filter(function (obj, i, arr) {
					if (obj.attribute4.startsWith(sQuery) || obj.attribute3.startsWith(sQuery) || obj.attribute2.startsWith(sQuery) || obj.attribute1
						.startsWith(sQuery) || obj.commodity.startsWith(sQuery) || obj.subCommodity.startsWith(sQuery)) {
						that.containData.push(that.oMarginAllDataModel.getData().listRequestDto[i]);
					}
				});

				that.allData = jQuery.extend(true, [], that.containData);
				that.result = jQuery.extend(true, [], that.containData);
				oMarginAllDataModel.getData().listRequestDto = that.containData;

				this.oMarginDataModel.getData().listRequestDto = oMarginAllDataModel.getData().listRequestDto.splice(0, 20);
				oMarginAllDataModel.getData().listRequestDto = that.result;
				this.oMarginDataModel.refresh();

			} else {
				this.getAllRecords();
			}
			// this.byId("marginTableId").getBinding("rows").filter(this._oGlobalFilter, "Application");

		},

		onMarginDelete: function (oEvent) {
			this.marginTable = this.getView().byId("marginTableId");
			var selectedRows = this.marginTable._oSelection.getSelectedIndices();
			var oMarginDataModel = this.oMarginDataModel;
			for (var i = 0; i <= selectedRows.length - 1; i++) {
				oMarginDataModel.getData().listRequestDto.splice(selectedRows, 1);
			}
			this.marginTable._oSelection.aSelectedIndices = [];
			oMarginDataModel.refresh();
		},

		clearAllFilters: function () {
			var oTable = this.getView().byId("marginTableId");

			this._oGlobalFilter = null;

			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}
			this.oMarginDataModel.refresh();
		},

		onMarginAdd: function () {
			this.filterGlobally();
			this.getView().byId("filterId").setValue("");
			var commodity = this.oMarginDataModel.getData().listRequestDto[0].commodity;
			var subCommodity = this.oMarginDataModel.getData().listRequestDto[0].sub - commodity;
			var newRowObj = {
				"commodity": commodity,
				"sub-commodity": subCommodity,
				"attribute1": "",
				"attribute2": "",
				"attribute3": "",
				"attribute4": "",
				"CMMproposedMargin": "",
				"editable": false
			};
			this.oMarginDataModel.getData().listRequestDto.unshift(newRowObj);
			this.oMarginDataModel.refresh();
		},

		onRowSelect: function (oEvent) {
			var selctLen = oEvent.getSource()._oSelection.getSelectedIndices().length;
			var tableLen = this.oMarginDataModel.getData().listRequestDto.length;
			if (selctLen === 1) {
				this.elemVisibilityModel.setProperty("/tableEditIcon", true);
				this.elemVisibilityModel.setProperty("/tablDeleteIcon", true);
			} else if (selctLen >= 1) {
				this.elemVisibilityModel.setProperty("/tableEditIcon", false);
				this.elemVisibilityModel.setProperty("/tablDeleteIcon", true);

				for (var i = 0; i <= tableLen - 1; i++) {
					this.oMarginDataModel.getData().listRequestDto[i].editable = false;
				}
			} else {
				this.elemVisibilityModel.setProperty("/tablDeleteIcon", false);
				this.elemVisibilityModel.setProperty("/tableEditIcon", false);
				this.elemVisibilityModel.setProperty("/tableAddIcon", true);
				for (var i = 0; i <= tableLen - 1; i++) {
					this.oMarginDataModel.getData().listRequestDto[i].editable = false;
				}

			}
			this.elemVisibilityModel.refresh();
			this.oMarginDataModel.refresh();
		},

		onMarginEdit: function (oEvent) {
			this.marginTable = this.getView().byId("marginTableId");
			var selectedRowIndex = this.marginTable._oSelection.getSelectedIndices()[0];
			this.oMarginDataModel.getData().listRequestDto[selectedRowIndex].editable = true;
			this.elemVisibilityModel.setProperty("/tableAddIcon", false);
			this.elemVisibilityModel.refresh();
			this.oMarginDataModel.refresh();
		},

		onSelectionChange: function (oEvent) {

			var dupData = jQuery.extend(true, [], this.allData);

			var oMarginAllDataModel = this.oMarginAllDataModel;
			var oMarginDataModel = this.oMarginDataModel;
			var currentPageNum = oEvent.getSource().getItems()[1].getText();
			if (oEvent.getSource().getSelectedKey() === "front") {
				currentPageNum++;
			} else {
				if (currentPageNum > 1) {
					currentPageNum--;
				} else {
					var pgnBtnGroup = this.getView().byId("pgnId");
					var pageBtn = pgnBtnGroup.getItems()[1];
					pgnBtnGroup.setSelectedButton(pgnBtnGroup.getItems()[1]);
					return;
				}
			}
			oEvent.getSource().getItems()[1].setText(currentPageNum);
			var pgnBtnGroup = this.getView().byId("pgnId");
			var pageBtn = pgnBtnGroup.getItems()[1];
			pgnBtnGroup.setSelectedKey("competitor");

			if (currentPageNum > 1) {
				oMarginDataModel.getData().listRequestDto = oMarginAllDataModel.getData().listRequestDto.splice((((currentPageNum - 1) * 20) - 1),
					20);
			} else {
				oMarginDataModel.getData().listRequestDto = oMarginAllDataModel.getData().listRequestDto.splice(0, 20);
			}

			oMarginAllDataModel.getData().listRequestDto = dupData;
			oMarginDataModel.refresh();

		},

		onfieldValueChange: function (oEvent) {
			var payload = [];
			var rowPosition = parseInt(oEvent.getSource().getParent().getBindingContext("oMarginDataModel").sPath.split("/")[2]);
			var obj = oEvent.getSource().getParent().getBindingContext("oMarginDataModel").getModel().getData().listRequestDto[rowPosition];
			
			var dupObj = jQuery.extend(true, {}, obj);
			
			delete dupObj["commodity"];
			delete dupObj["subCommodity"];
			delete dupObj["updatedAt"];
			delete dupObj["updatedBy"];
			delete dupObj["sapMaterial"];
			delete dupObj["createdAt"];
			delete dupObj["createdBy"];
			
			var dateStart = new Date(dupObj.validityStartDate);
			dupObj.validityStartDate = dateStart.getFullYear().toString()+"-"+(dateStart.getMonth()+1).toString()+"-"+ dateStart.getDate().toString();
			var dateEnd = new Date(dupObj.validityEndDate);
			dupObj.validityEndDate= dateEnd.getFullYear().toString()+"-"+(dateEnd.getMonth()+1).toString()+"-"+dateEnd.getDate().toString();
			dupObj.margin = parseInt(dupObj.margin);
			dupObj.editable = false;
			
			payload.push(dupObj);
			this.onUpdateRecord(payload);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf JabilPoc.Jabil_Poc.view.marginMaintenance
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf JabilPoc.Jabil_Poc.view.marginMaintenance
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf JabilPoc.Jabil_Poc.view.marginMaintenance
		 */
		//	onExit: function() {
		//
		//	}

	});

});