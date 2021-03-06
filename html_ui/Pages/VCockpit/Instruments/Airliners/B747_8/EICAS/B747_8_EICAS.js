class B747_8_EICAS extends Airliners.BaseEICAS {
    init(){
        super.init();
        this.currentPage = "B747_8_EICAS_fuel";
    }
    onEvent(_event) {
        super.onEvent(_event);
        if(this.currentPage !== _event){
            this.currentPage = _event;
        }else{
            this.changePage("BLANK");
            this.currentPage = "blank";
            return;
        }
        var prefix = this.getLowerScreenChangeEventNamePrefix();
        if (_event.indexOf(prefix) >= 0) {
            var pageName = _event.replace(prefix, "");
            this.changePage(pageName);
        }
        else {
            for (let i = 0; i < this.lowerScreenPages.length; i++) {
                this.lowerScreenPages[i].onEvent(_event);
            }
        }
    }
    get templateID() {
        return "B747_8_EICAS";
    }
    createUpperScreenPage() {
        this.upperTopScreen = new Airliners.EICASScreen("TopScreen", "TopScreen", "b747-8-upper-eicas");
        this.annunciations = new Cabin_Annunciations();
        this.upperTopScreen.addIndependentElement(this.annunciations);
        this.warnings = new Cabin_Warnings();
        this.upperTopScreen.addIndependentElement(this.warnings);
        this.addIndependentElementContainer(this.upperTopScreen);
    }
    createLowerScreenPages() {
        this.createLowerScreenPage("FUEL", "BottomScreen", "b747-8-lower-eicas-fuel");
        this.createLowerScreenPage("ENG", "BottomScreen", "b747-8-lower-eicas-engine");
        this.createLowerScreenPage("STAT", "BottomScreen", "b747-8-lower-eicas-stat");
        this.createLowerScreenPage("FCTL", "BottomScreen", "b747-8-lower-eicas-fctl");
        this.createLowerScreenPage("DRS", "BottomScreen", "b747-8-lower-eicas-drs");
        this.createLowerScreenPage("ELEC", "BottomScreen", "b747-8-lower-eicas-elec");
        this.createLowerScreenPage("BLANK", "BottomScreen", "b747-8-lower-eicas-blank"); // To blank the bottom eicas when selecting same page again
    }
    getLowerScreenChangeEventNamePrefix() {
        return "EICAS_CHANGE_PAGE_";
    }
    onUpdate(_deltaTime) {
        super.onUpdate(_deltaTime);
        this.updateAnnunciations();
    }
    updateAnnunciations() {
        let infoPanelManager = this.upperTopScreen.getInfoPanelManager();
        if (infoPanelManager) {
            infoPanelManager.clearScreen(Airliners.EICAS_INFO_PANEL_ID.PRIMARY);
            if (this.warnings) {
                let text = this.warnings.getCurrentWarningText();
                if (text && text != "") {
                    let level = this.warnings.getCurrentWarningLevel();
                    switch (level) {
                        case 0:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.INDICATION);
                            break;
                        case 1:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION);
                            break;
                        case 2:
                            infoPanelManager.addMessage(Airliners.EICAS_INFO_PANEL_ID.PRIMARY, text, Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING);
                            break;
                    }
                }
            }
            if (this.annunciations) {
                for (let i = this.annunciations.displayWarning.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayWarning[i].Acknowledged)
                        infoPanelManager.addMessage(
                            Airliners.EICAS_INFO_PANEL_ID.PRIMARY,
                            this.annunciations.displayWarning[i].Text,
                            Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.WARNING
                        );
                }
                for (let i = this.annunciations.displayCaution.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayCaution[i].Acknowledged)
                        infoPanelManager.addMessage(
                            Airliners.EICAS_INFO_PANEL_ID.PRIMARY,
                            this.annunciations.displayCaution[i].Text,
                            Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.CAUTION
                        );
                }
                for (let i = this.annunciations.displayAdvisory.length - 1; i >= 0; i--) {
                    if (!this.annunciations.displayAdvisory[i].Acknowledged)
                        infoPanelManager.addMessage(
                            Airliners.EICAS_INFO_PANEL_ID.PRIMARY,
                            this.annunciations.displayAdvisory[i].Text,
                            Airliners.EICAS_INFO_PANEL_MESSAGE_STYLE.INDICATION
                        );
                }
            }
        }
    }
}
registerInstrument("b747-8-eicas-element", B747_8_EICAS);
//# sourceMappingURL=B747_8_EICAS.js.map
