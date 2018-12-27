jQuery.sap.require("JabilPoc.Jabil_Poc.util.xlsx");
jQuery.sap.require("JabilPoc.Jabil_Poc.util.jszip");
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("JabilPoc.Jabil_Poc.controller.bulkUpdate", {

		onInit: function () {
			var that = this;
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._router.attachRoutePatternMatched(function(oEvent) {
				var viewName = oEvent.getParameter("name");
				//that.routePatternMatched(oEvent);
			}); 
			
			
			var oBulkUploadModel = this.getOwnerComponent().getModel("oBulkUploadModel");
			this.getView().setModel(oBulkUploadModel, "oBulkUploadModel");
			var oTblHdrDetailsModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oTblHdrDetailsModel, "oTblHdrDetailsModel");
			this.oBulkUploadModel = oBulkUploadModel;
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
		
		onBack: function(){
			this._router.navTo("requestScreen"); 
		}

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