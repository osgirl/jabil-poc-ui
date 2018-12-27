sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/viz/ui5/data/FlattenedDataset',
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format',
	'JabilPoc/Jabil_Poc/libs/xl',
	"sap/m/BusyDialog",
], function (Controller, Filter, FilterOperator, FlattenedDataset, FeedItem, ChartFormatter, Format, xljs, BusyDialog) {
	"use strict";

	return Controller.extend("JabilPoc.Jabil_Poc.controller.requestScreen", {
		onInit: function () {

			var that = this;
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this.oHeader = {
				"Accept": "application/json",
				"Content-Type": "application/json"
			};

			this.busy = new BusyDialog();

			this._router.attachRoutePatternMatched(function (oEvent) {
				var viewName = oEvent.getParameter("name");
				var tileData = that.getOwnerComponent().tileSelected;
				var sideNav = that.getOwnerComponent().getRootControl().byId("sideNavigation");
				var item;

				if (viewName === "inbox" || tileData === "3") {
					var itemsLen = sideNav.getItem().getItems().length;
					for (var i = 0; i <= itemsLen - 1; i++) {
						if (sideNav.getItem().getItems()[0].getKey() === "Inbox") {
							var item = sideNav.getItem().getItems()[i];
							sideNav.setSelectedItem(item);
						}
					}
					that._router.navTo("inbox");
				} else if (viewName === "marginMaintenance" || tileData === "1") {
					var itemsLen = sideNav.getItem().getItems().length;
					for (var i = 0; i <= itemsLen - 1; i++) {
						if (sideNav.getItem().getItems()[0].getKey() === "marginMaintenance") {
							var item = sideNav.getItem().getItems()[i];
							sideNav.setSelectedItem(item);
						}
					}
					that._router.navTo("marginMaintenance");
				} else if (viewName === "Reports" || tileData === "4") {
					var itemsLen = sideNav.getItem().getItems().length;
					for (var i = 0; i <= itemsLen - 1; i++) {
						if (sideNav.getItem().getItems()[0].getKey() === "Reports") {
							var item = sideNav.getItem().getItems()[i];
							sideNav.setSelectedItem(item);
						}
					}
					that._router.navTo("Reports");
				} else if (viewName === "requestScreen" || tileData === "2") {
					var itemsLen = sideNav.getItem().getItems().length;
					for (var i = 0; i <= itemsLen - 1; i++) {
						if (sideNav.getItem().getItems()[0].getKey() === "Main") {
							var item = sideNav.getItem().getItems()[i];
							sideNav.setSelectedItem(item);
						}
					}
					that._router.navTo("requestScreen");
				}

				//	that.getOwnerComponent().sId = "none";
				//that.routePatternMatched(oEvent);
			});

			this.oDataModel = this.getOwnerComponent().getModel("oMatTableDataModel");

			var elemVisibilityModel = this.getOwnerComponent().getModel("elemVisibilityModel");
			this.elemVisibilityModel = elemVisibilityModel;
			this.getView().setModel(elemVisibilityModel, "elemVisibilityModel");
			elemVisibilityModel.setProperty("/tableVisibilty", false);

			var path = jQuery.sap.getModulePath("JabilPoc.Jabil_Poc");
			var oPriceTrendGraphModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oPriceTrendGraphModel, "oPriceTrendGraphModel");
			oPriceTrendGraphModel.loadData(path + "/model/reportsData.json", null, false);
			this.oPriceTrendGraphModel = oPriceTrendGraphModel;
			this.createGraph();
			this.createGraph2();

			this.getAllRecords();
		},

		getAllRecords: function () {
			var that = this;
			this.busy.open();
			var oMatTableDataModel = this.oMatTableDataModel;
			var sUrl = "/jabilPriceUpdate/POC_JABIL/price_maintenance.xsjs";
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(sUrl, "", true, "GET", false, false, this.oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				if (oEvent.getParameter("success")) {
					var resultData = oModel.getData();
					if (resultData) {
						oMatTableDataModel.getData().listRequestDto = resultData;
						//	oComboLapiDataModel.setData(resultData);
						that.busy.close();
						oMatTableDataModel.refresh();
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

		createGraph: function () {
			var oPriceTrendGraphModel = this.oPriceTrendGraphModel;
			var oVizFrame = this.getView().byId("idVizFrame");
			var oDataset = new FlattenedDataset({
				dimensions: [{
					name: "Date",
					value: "{oPriceTrendGraphModel>Date}",
					dataType: "date"
				}],
				measures: [{
					name: "ApprovedPrice",
					value: "{oPriceTrendGraphModel>Revenue}"
				}],
				data: {
					path: "oPriceTrendGraphModel>/milk"
				}
			});
			oVizFrame.setDataset(oDataset);
			oVizFrame.setVizType("timeseries_line");
			//set  viz properties
			oVizFrame.setVizProperties({
				tooltip: {
						visible: false
					},
				plotArea: {
					window: {
						start: "firstDataPoint",
						end: "lastDataPoint"
					},
					dataLabel: {
						formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
						visible: false
					}
				},
				valueAxis: {
					visible: true,
					label: {
						//formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
						visible: true
					},
					title: {
						visible: false
					}
				},
				timeAxis: {
					title: {
						visible: false
					},
					interval: {
						unit: ""
					}
				},
				legend: {
					visible: false
				},
				title: {
					visible: false
				},
				interaction: {
					syncValueAxis: false
				}
			});
			/*var scales = [{
				'feed': 'color',
				'palette': ['#36a6e3','#55b49b','#67bb3a','#e3df11','#fdc400','#ec1010','#ec10d5']

			}];
			oVizFrame.setVizScales(scales);*/

			var oFeedValueAxis = new FeedItem({
				"uid": "valueAxis",
				"type": "Measure",
				"values": ["ApprovedPrice"]
			});

			var feedCategoryAxis1 = new FeedItem({
				"uid": "timeAxis",
				"type": "Dimension",
				"values": ["Date"]
			});
			oVizFrame.destroyFeeds();
			oVizFrame.addFeed(oFeedValueAxis);
			oVizFrame.addFeed(feedCategoryAxis1);

		},
		createGraph2: function () {
			var oPriceTrendGraphModel = this.oPriceTrendGraphModel;
			var oVizFrame = this.getView().byId("idVizFrame1");
			var oDataset = new FlattenedDataset({
				dimensions: [{
					name: "Date",
					value: "{oPriceTrendGraphModel>Date}",
					dataType: "date"
				}],
				measures: [{
					name: "Inventory",
					value: "{oPriceTrendGraphModel>Revenue}"
				}],
				data: {
					path: "oPriceTrendGraphModel>/graph2data"
				}
			});
			oVizFrame.setDataset(oDataset);
			oVizFrame.setVizType("column");
			//set  viz properties
			oVizFrame.setVizProperties({
				tooltip: {
						visible: false
					},
				plotArea: {
					window: {
						start: "firstDataPoint",
						end: "lastDataPoint"
					},
					dataLabel: {

						visible: true
					}
				},
				valueAxis: {
					visible: true,
					label: {
						//formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
						visible: true
					},
					title: {
						visible: false
					}
				},
				timeAxis: {
					title: {
						visible: false
					},
					interval: {
						unit: ""
					}
				},
				legend: {
					visible: false
				},
				title: {
					visible: false
				},
				interaction: {
					syncValueAxis: false
				}
			});
			/*var scales = [{
				'feed': 'color',
				'palette': ['#36a6e3','#55b49b','#67bb3a','#e3df11','#fdc400','#ec1010','#ec10d5']

			}];
			oVizFrame.setVizScales(scales);*/

			var oFeedValueAxis = new FeedItem({
				"uid": "valueAxis",
				"type": "Measure",
				"values": ["Inventory"]
			});

			var feedCategoryAxis1 = new FeedItem({
				"uid": "categoryAxis",
				"type": "Dimension",
				"values": ["Date"]
			});
			oVizFrame.destroyFeeds();
			oVizFrame.addFeed(oFeedValueAxis);
			oVizFrame.addFeed(feedCategoryAxis1);

		},

		onSelectGraph1Point: function (data) {
			var oPriceTrendGraphModel = this.oPriceTrendGraphModel;
			var approvedPrice = data.getParameters().data[0].data.ApprovedPrice;
			var date=data.getParameters().data[0].data.Date;
			oPriceTrendGraphModel.getData().approvedPrice =approvedPrice;
			oPriceTrendGraphModel.getData().approvedDate =date;
			this.createPopOver1(data);
		},
		
		onSelectGraph2Point: function (data) {
			var oPriceTrendGraphModel = this.oPriceTrendGraphModel;
			var stockLevel = data.getParameters().data[0].data.Inventory;
			var date=data.getParameters().data[0].data.Date;
			oPriceTrendGraphModel.getData().stockLevel =stockLevel;
			oPriceTrendGraphModel.getData().stockDate =date;
			this.createPopOver2(data);
		},

		createPopOver1: function (data) {
			var oEvent = data;
			if (!this.oPopOver1) {
				this.oPopOver1 = sap.ui.xmlfragment("JabilPoc.Jabil_Poc.fragments.popOverGraph1", this);
				this.getView().addDependent(this.oPopOver1);
			}
			this.oPopOver1.setModel(this.getView().getModel("oPriceTrendGraphModel"));
			this.oPriceTrendGraphModel.refresh();
			this.oPopOver1.openBy(oEvent.getParameter("data")[0].target);
		},
		
		createPopOver2: function (data) {
			var oEvent = data;
			if (!this.oPopOver2) {
				this.oPopOver2 = sap.ui.xmlfragment("JabilPoc.Jabil_Poc.fragments.popOverGraph2", this);
				this.getView().addDependent(this.oPopOver2);
			}
			this.oPopOver2.setModel(this.getView().getModel("oPriceTrendGraphModel"));
			this.oPriceTrendGraphModel.refresh();
			this.oPopOver2.openBy(oEvent.getParameter("data")[0].target);
		},

		onClosePopOver1: function () {
			// var oGraphPopOverModel = this.oGraphPopOverModel;
			// oGraphPopOverModel.setData({});
			this.oPopOver1.close();
		},
		
		onClosePopOver2: function () {
			// var oGraphPopOverModel = this.oGraphPopOverModel;
			// oGraphPopOverModel.setData({});
			this.oPopOver2.close();
		},


		filterGlobally: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("commodity", FilterOperator.Contains, sQuery),
					new Filter("sub-commodity", FilterOperator.Contains, sQuery),
					new Filter("materialNumber", FilterOperator.Contains, sQuery),
					new Filter("basePrice", FilterOperator.Contains, sQuery),
					new Filter("Category", FilterOperator.Contains, sQuery),
					new Filter("Category", FilterOperator.Contains, sQuery)
				], false);
			}

			this.byId("table1").getBinding("rows").filter(this._oGlobalFilter, "Application");
		},

		onBulkUpdatePress: function () {
			// this._router.navTo("bulkUpdate");
			if (!this.bulkUpdate) {
				this.bulkUpdate = sap.ui.xmlfragment("JabilPoc.Jabil_Poc.fragments.bulkUpdate", this);
				this.getView().addDependent(this.bulkUpdate);
			}
			this.bulkUpdate.open();
		},

		onSearch: function () {
			var elemVisibilityModel = this.elemVisibilityModel;
			elemVisibilityModel.setProperty("/tableVisibilty", true);
		},

		onCancel: function () {
			this.bulkUpdate.close();
		},

		//works only for csv files
		onUpload: function (e) {
			var oDataModel = this.oDataModel;
			var ext = sap.ui.getCore().byId("fileUploader").getValue().split(".");
			if (ext[0] === "") {
				sap.m.MessageToast.show("Please select a .csv file to upload");
				return;
			}
			var oFileFormat = ext[1].toLowerCase();
			// if(oFileFormat!=="csv"){
			// 	sap.m.MessageToast.show("Please select a .csv file to upload");
			// 	return;
			// }
			//clearing the model everytime new data is uploaded.
			oDataModel.setData({
				listRequestDto: []
			});
			var oBulkUploadModelData = oDataModel.getData().listRequestDto;
			var oFileUploader = sap.ui.getCore().byId("fileUploader");
			this.fileType = oFileUploader.getValue().split(".")[1];
			var domRef = oFileUploader.getFocusDomRef();
			var file = domRef.files[0];
			// Create a File Reader object
			var reader = new FileReader();
			var that = this;
			reader.onload = function (e) {

				if (that.fileType === "csv") {
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
							commodity: oRowDataArray[0],
							subCommodity: oRowDataArray[1],
							sapMaterial: oRowDataArray[2],
							margin: oRowDataArray[3],
							basePrice: oRowDataArray[4],
							newProposedPrice: oRowDataArray[4],
							validityStart: oRowDataArray[5],
							validityEnd: oRowDataArray[6],
							previousQuaterPrice: oRowDataArray[7],
							comments: oRowDataArray[8]
						};
						oBulkUploadModelData.push(oTblRowData);
					}
				} else if (that.fileType === "xlsx") {
					var workbook = XLSX.read(e.target.result, {
						type: 'binary'
					});
					var sheet_name_list = workbook.SheetNames;
					sheet_name_list.forEach(function (y) { /* iterate through sheets */
						//Convert the cell value to Json
						that.ExcelData = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
					});
					oBulkUploadModelData = that.ExcelData;
					that.oDataModel.getData().listRequestDto = oBulkUploadModelData;
				} else {
					console.log("inCorrectFormat");
				}

				oFileUploader.setValue(null);
				oFileUploader.oPropagatedProperties.oModels.oDataModel.refresh();
				that.bulkUpdate.close();
				that.onSearch();
			};
			reader.readAsArrayBuffer(file);
		},

		onExportToCSV: function () {
			jQuery.sap.require("sap/ui/core/util/Export");
			jQuery.sap.require("sap/ui/core/util/ExportTypeCSV");
			var oExport = new sap.ui.core.util.Export({
				exportType: new sap.ui.core.util.ExportTypeCSV({
					separatorChar: "\t",
					mimeType: "application/vnd.ms-excel",
					charset: "utf-8",
					fileExtension: "xls"
				}),
				models: this.oDataModel,
				rows: {
					path: "/listRequestDto"
				},
				columns: [{ /* IDEATION_TAB*/
					name: "commodity",
					template: {
						content: "{commodity}"
					}
				}, {
					name: "subCommodity",
					template: {
						content: "{subCommodity}"
					}
				}, {
					name: "sapMaterial",
					template: {
						content: "{sapMaterial}"
					}
				}, {
					name: "margin",
					template: {
						content: "{margin}"
					}
				}, {
					name: "basePrice",
					template: {
						content: "{basePrice}"
					}
				}, {
					name: "newProposedPrice",
					template: {
						content: "{newProposedPrice}"
					}
				}, {
					name: "validityStart",
					template: {
						content: "{validityStart}"
					}
				}, {
					name: "validityEnd",
					template: {
						content: "{validityEnd}"
					}
				}, {
					name: "previousQuaterPrice",
					template: {
						content: "{previousQuaterPrice}"
					}
				}, {
					name: "comments",
					template: {
						content: "{comments}"
					}
				}]
			});

			//oExport.saveFile("NPP_SKU TABLE"); // download exported file
			oExport.saveFile("ExcelDownload"); // download exported file

		},
		onExportToTemplte: function () {
			jQuery.sap.require("sap/ui/core/util/Export");
			jQuery.sap.require("sap/ui/core/util/ExportTypeCSV");
			var oExport = new sap.ui.core.util.Export({
				exportType: new sap.ui.core.util.ExportTypeCSV({
					separatorChar: "\t",
					mimeType: "application/vnd.ms-excel",
					charset: "utf-8",
					fileExtension: "xls"
				}),
				models: this.oDataModel,
				rows: {
					path: "/listRequestDto"
				},
				columns: [{ /* IDEATION_TAB*/
					name: "comodity",
					template: {
						content: ""
					}
				}, {
					name: "subcommodity",
					template: {
						content: ""
					}
				}, {
					name: "sapMaterial",
					template: {
						content: ""
					}
				}, {
					name: "margin",
					template: {
						content: ""
					}
				}, {
					name: "basePrice",
					template: {
						content: ""
					}
				}, {
					name: "newProposedPrice",
					template: {
						content: ""
					}
				}, {
					name: "validityStart",
					template: {
						content: ""
					}
				}, {
					name: "validityEnd",
					template: {
						content: ""
					}
				}, {
					name: "previousQuaterPrice",
					template: {
						content: ""
					}
				}, {
					name: "comments",
					template: {
						content: ""
					}
				}]
			});

			//oExport.saveFile("NPP_SKU TABLE"); // download exported file
			oExport.saveFile("ExcelDownload"); // download exported file

		},

		onSelectionChange: function (oEvent) {
			var pgnBtnGroup = this.getView().byId("pgnId");
			var pageBtn = pgnBtnGroup.getItems()[1];
			pgnBtnGroup.setSelectedButton(pageBtn);
		}

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf JabilPoc.Jabil_Poc.view.requestScreen
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf JabilPoc.Jabil_Poc.view.requestScreen
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf JabilPoc.Jabil_Poc.view.requestScreen
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf JabilPoc.Jabil_Poc.view.requestScreen
		 */
		//	onExit: function() {
		//
		//	}

	});

});