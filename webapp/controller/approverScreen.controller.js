sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/BusyDialog",
], function (Controller, BusyDialog) {
	"use strict";

	return Controller.extend("JabilPoc.Jabil_Poc.controller.approverScreen", {

		onInit: function () {
			var that = this;
			this.busy = new BusyDialog();

			this.oHeader = {
				"Accept": "application/json",
				"Content-Type": "application/json"
			};

			var oComponent = this.getOwnerComponent();
			// this._router = oComponent.getRouter();
			// this._router.attachRoutePatternMatched(function(oEvent) {
			// 	var viewName = oEvent.getParameter("name");
			// 	//that.routePatternMatched(oEvent);
			// }); 

			var oTaskContextDataModel = this.getOwnerComponent().getModel("oTaskContextDataModel");
			this.getView().setModel(oTaskContextDataModel, "oTaskContextDataModel");
			var oTblHdrDetailsModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oTblHdrDetailsModel, "oTblHdrDetailsModel");
			this.oTaskContextDataModel = oTaskContextDataModel;

			this.oApproverDataModel = this.getOwnerComponent().getModel("oApproverDataModel");
			this.oApproverDataModel = this.oApproverDataModel;

			this.getUserDetails();
		},

		getUserDetails: function () {
			var oUserModel = this.getOwnerComponent().getModel("oUserModel");
			var sUrl = "/html5apps/jabilpocui/services/userapi/attributes?multiValuesAsArrays=true";
			//	var sUrl = "/services/userapi/currentUser";
			var oModel = new sap.ui.model.json.JSONModel();
			var that = this;
			oModel.loadData(sUrl, true, "GET", false, false);
			oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oEvent.getSource().getData();
					if (resultData) {
						oUserModel.setData(resultData);
						that.userID = resultData.name;
						var taskUrl = window.location.href;
						var instanceId = taskUrl.split("'")[3];
						that.instanceId = instanceId;
						that.getTaskInstanceData(instanceId);
					}
				} else {
					sap.m.MessageToast.show("Internal Server Error");
				}
			});
			oModel.attachRequestFailed(function (oEvent) {
				sap.m.MessageToast.show("Internal Server Error");
			});
		},

		getTaskInstanceData: function (instanceId) {
			var that = this;
			this.busy.open();
			var oTaskContextDataModel = this.oTaskContextDataModel;
			var sUrl = "/html5apps/jabilpocui/destination/bpmworkflowruntime/workflow-service/rest/v1/task-instances/" + instanceId +
				"/context";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, "", true, "GET", false, false, this.oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oModel.getData();
					if (resultData) {
						that.oTaskContextDataModel.setData(resultData);
						that.getRecordsList();
						that.busy.close();
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

		getRecordsList: function () {
			var that = this;
			if (this.userID === "P1940781507") {
				this.Ids = this.oTaskContextDataModel.getData().reviewer2.ids;
			} else if (this.userID === "P2000869457") {
				this.Ids = this.oTaskContextDataModel.getData().reviewer1.ids;
			} else {
				this.Ids = this.oTaskContextDataModel.getData().ids;
			}
			this.getRecordsData();
		},

		getRecordsData: function () {
			var that = this;
			this.busy.open();
			var oPayload = {
				"ids": this.Ids
			};
			this.getView().byId("table1").setVisibleRowCount(this.Ids.length);
			var sUrl = "/html5apps/jabilpocui/jabilPriceUpdate/POC_JABIL/service.xsjs/getPriceMaintById";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, this.oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oModel.getData();
					if (resultData) {
						that.oApproverDataModel.getData().listRequestDto = resultData;
						that.oApproverDataModel.refresh();
						that.busy.close();
					}
				} else {
					//		var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
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

		//works only for csv files
		onUpload: function (e) {
			var ext = this.getView().byId("fileUploader").getValue().split(".");
			if (ext[0] === "") {
				sap.m.MessageToast.show("Please select a .csv file to upload");
				return;
			}
			var oFileFormat = ext[1].toLowerCase();
			// if(oFileFormat!=="csv"){
			// 	sap.m.MessageToast.show("Please select a .csv file to upload");
			// 	return;
			// }
			var oBulkUploadModel = this.getView().getModel("oBulkUploadModel");
			//clearing the model everytime new data is uploaded.
			oBulkUploadModel.setData({
				listRequestDto: []
			});
			var oBulkUploadModelData = oBulkUploadModel.getData().listRequestDto;
			var oFileUploader = this.getView().byId("fileUploader");
			var domRef = oFileUploader.getFocusDomRef();
			var file = domRef.files[0];
			// Create a File Reader object
			var reader = new FileReader();
			var that = this;
			reader.onload = function (e) {

				//var data = e.target.result;
				//      var wb = XLSX.read(data, {type: 'binary'});
				//      wb.SheetNames.forEach(function(sheetName) {
				//       var roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
				//       if(roa.length > 0){
				//          result[sheetName] = roa;
				//       }
				//       });
				if (reader.result) reader.content = reader.result;
				var base64Data = btoa(reader.content);
				var bytes = new Uint8Array(reader.result);
				var binary = "";
				var length = bytes.byteLength;
				for (var i = 0; i < length; i++) {
					binary += String.fromCharCode(bytes[i]);
				}
				var strCSV = e.target.result;
				var arrCSV = binary.split("\n");
				// To ignore the first row which is header
				var oTblData = arrCSV.splice(1);

				for (var i = 0; i < oTblData.length - 1; i++) {
					var oRowDataArray = oTblData[i].split(',');
					var oTblRowData = {
						materialNumber: oRowDataArray[0],
						commodity: oRowDataArray[1],
						subcommodity: oRowDataArray[2],
						attribute1: oRowDataArray[3],
						attribute2: oRowDataArray[4],
						attribute3: oRowDataArray[5],
						attribute4: oRowDataArray[6],
						basePrice: oRowDataArray[7],
						historicalPrice: oRowDataArray[8],
						foreCastPrice: oRowDataArray[9],
						approvedCMMPrice: oRowDataArray[10],
						CMMsuggestedMargin: oRowDataArray[11],
						CMMproposedMargin: oRowDataArray[12],
						CMMproposedPrice: oRowDataArray[13],
						CMMcomments: oRowDataArray[14],
						CMMnotes: oRowDataArray[15]
					};
					oBulkUploadModelData.push(oTblRowData);
				}
				oFileUploader.setValue(null);
				oFileUploader.oPropagatedProperties.oModels.oBulkUploadModel.refresh();
			};
			reader.readAsArrayBuffer(file);
		},

		onBack: function () {
			this._router.navTo("requestScreen");
		},

		// onAction: function () {
		// 	var that = this;
		// 	this.busy.open();
		// 	var instanceId = that.instanceId;

		// 	var oPayLoad = {
		// 		"context": {
		// 			"reviewer1": {
		// 				"isApproved": true
		// 			}
		// 		},
		// 		"status": "COMPLETED",
		// 		"subject": "Price Update Review - P2000869457",
		// 		"description": "Price Update Review",
		// 		"recipientUsers": "P2000869457",
		// 		"recipientGroups": "string",
		// 		"processor": "P2000869457",
		// 		"dueDate": "2018-12-31T04:30:08.983Z",
		// 		"priority": "VERY_HIGH"
		// 	};

		// 	var sUrl = "/html5apps/jabilpocui/destination/bpmworkflowruntime/workflow-service/rest/v1/task-instances/" + instanceId;
		// 	var oModel = new sap.ui.model.json.JSONModel();
		// 	oModel.loadData(sUrl, JSON.stringify(oPayLoad), true, "POST", false, false, this.oHeader);
		// 	oModel.attachRequestCompleted(function (data) {
		// 		if (data.getParameter("success")) {
		// 			var resultData = oModel.getData();
		// 			if (resultData) {
		// 				// that.oTaskContextDataModel.setData(resultData);
		// 				// that.getRecordsList();
		// 				that.busy.close();
		// 			}
		// 		} else {
		// 			//			var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
		// 			//		formatter.toastMessage(errorText);
		// 			that.busy.close();
		// 		}
		// 	});
		// 	oModel.attachRequestFailed(function (oEvent) {
		// 		//	var errorText = that.oResourceModel.getText("INTERNAL_SERVER_ERROR");
		// 		//	formatter.toastMessage(errorText);
		// 		that.busy.close();
		// 	});
		// },

		onAction: function (oEvent) {

			var that = this;
			this.busy.open();
			this.userId = that.getOwnerComponent().getModel("oUserModel").getData().name;
			var buttonData = oEvent.getSource().getCustomData()[0].getValue();
			if (buttonData === "accept") {
				var actionType = true;
			} else {
				var actionType = false;
			}
			if (this.userId === "P1940781507") {
				var contextData = {
					"reviewer2": {
						"isApproved": actionType
					}
				};
			} else if (this.userId === "P2000869457") {
				var context = {
					"reviewer1": {
						"isApproved": actionType
					}
				};
			} else {
				var context = {
					"approver": {
						"isApproved": actionType
					}
				};
			}
			
			var instanceId = that.instanceId;
			var oUrl = "/html5apps/jabilpocui/destination/bpmworkflowruntime/workflow-service/rest/v1/xsrf-token";
			var token = this.fetchToken(oUrl);
			this.token = token;
			var oPayLoad = {
				"context": {
					"reviewer1": {
						"isApproved": true
					}
				},
				"status": "COMPLETED",
				"subject": "Price Update Review - P2000869457",
				"description": "Price Update Review",
				"recipientUsers": this.userId,
				"recipientGroups": "string",
				"processor": this.userId,
				"dueDate": "2018-12-31T04:30:08.983Z",
				"priority": "VERY_HIGH"
			};
			oPayLoad.context = contextData;

			// var oContextData = oPayload;
			if (this.token) {
				var sUrl = "/html5apps/jabilpocui/destination/bpmworkflowruntime/workflow-service/rest/v1/task-instances/" + instanceId;
				var oHeader = {
					"Content-Type": "application/json; charset=utf-8",
					"X-CSRF-Token": this.token
				};
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.loadData(sUrl, JSON.stringify(oPayLoad), true, "PATCH", false, false, oHeader);
				oModel.attachRequestCompleted(function (oEvent) {
					that.busy.close();
					sap.m.MessageToast.show("Task Successfully Completed");
				});
				oModel.attachRequestFailed(function (oEvent) {
					that.busy.close();
					sap.m.MessageToast.show("Internal Server Error");
				});
			}
		},

		fetchToken: function (oUrl) {
			var token;
			$.ajax({
				url: oUrl,
				method: "GET",
				async: false,
				headers: {
					"X-CSRF-Token": "Fetch"
				},
				success: function (result, xhr, data) {
					token = data.getResponseHeader("X-CSRF-Token");
				},
				error: function (result, xhr, data) {
					token = result.getResponseHeader("x-csrf-token");
				}
			});
			return token;
		},

		//works only for csv files
		// onUpload: function (e) {
		// 	var ext = this.getView().byId("fileUploader").getValue().split(".");
		// 	if (ext[0] === "") {
		// 		sap.m.MessageToast.show("Please select a .csv file to upload");
		// 		return;
		// 	}
		// 	var oFileFormat = ext[1].toLowerCase();
		// 	if (oFileFormat !== "csv") {
		// 		sap.m.MessageToast.show("Please select a .csv file to upload");
		// 		return;
		// 	}
		// 	var oBulkUploadModel = this.getView().getModel("oBulkUploadModel");
		// 	//clearing the model everytime new data is uploaded.
		// 	oBulkUploadModel.setData({
		// 		listRequestDto: []
		// 	});
		// 	var oBulkUploadModelData = oBulkUploadModel.getData().listRequestDto;
		// 	var oFileUploader = this.getView().byId("fileUploader");
		// 	var domRef = oFileUploader.getFocusDomRef();
		// 	var file = domRef.files[0];
		// 	// Create a File Reader object
		// 	var reader = new FileReader();
		// 	var that = this;
		// 	reader.onload = function (e) {
		// 		if (reader.result) reader.content = reader.result;
		// 		var base64Data = btoa(reader.content);
		// 		var bytes = new Uint8Array(reader.result);
		// 		var binary = "";
		// 		var length = bytes.byteLength;
		// 		for (var i = 0; i < length; i++) {
		// 			binary += String.fromCharCode(bytes[i]);
		// 		}
		// 		var strCSV = e.target.result;
		// 		var arrCSV = binary.split("\n");
		// 		// To ignore the first row which is header
		// 		var oTblData = arrCSV.splice(1);

		// 		for (var i = 0; i < oTblData.length - 1; i++) {
		// 			var oRowDataArray = oTblData[i].split(',');
		// 			var oTblRowData = {
		// 				materialNumber: oRowDataArray[0],
		// 				commodity: oRowDataArray[1],
		// 				subcommodity: oRowDataArray[2],
		// 				attribute1: oRowDataArray[3],
		// 				attribute2: oRowDataArray[4],
		// 				attribute3: oRowDataArray[5],
		// 				attribute4: oRowDataArray[6],
		// 				basePrice: oRowDataArray[7],
		// 				historicalPrice: oRowDataArray[8],
		// 				foreCastPrice: oRowDataArray[9],
		// 				approvedCMMPrice: oRowDataArray[10],
		// 				CMMsuggestedMargin: oRowDataArray[11],
		// 				CMMproposedMargin: oRowDataArray[12],
		// 				CMMproposedPrice: oRowDataArray[13],
		// 				CMMcomments: oRowDataArray[14],
		// 				CMMnotes: oRowDataArray[15]
		// 			};

		// 			oBulkUploadModelData.push(oTblRowData);
		// 		}
		// 		oFileUploader.setValue(null);
		// 		// that.checkErrorRecords();
		// 	};
		// 	reader.readAsArrayBuffer(file);
		// 	oBulkUploadModel.getData().listRequestDto = oBulkUploadModelData;
		// 	oBulkUploadModel.refresh();
		// },

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf JabilPoc.Jabil_Poc.view.bulkUpdate
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf JabilPoc.Jabil_Poc.view.bulkUpdate
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf JabilPoc.Jabil_Poc.view.bulkUpdate
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf JabilPoc.Jabil_Poc.view.bulkUpdate
		 */
		//	onExit: function() {
		//
		//	}

	});

});