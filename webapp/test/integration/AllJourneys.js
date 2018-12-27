/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"JabilPoc/Jabil_Poc/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"JabilPoc/Jabil_Poc/test/integration/pages/View1",
	"JabilPoc/Jabil_Poc/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "JabilPoc.Jabil_Poc.view.",
		autoWait: true
	});
});