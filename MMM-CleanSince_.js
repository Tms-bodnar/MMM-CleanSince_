Module.register("MMM-CleanSince_", {
    // Default module config.
    defaults: {
        datum: "16.03.2020"
    },
    getScripts: function () {
        return ['moment.js'];
    },
    getStyles: function () {
        return ['font-awesome.css'];
    },
    start: function () {
        updated = false;
        periodSince = 0;
        costSince = 0;
    },

    notificationReceived: function (notification, payload, sender) {
        var self = this;
        Log.log("notification", notification);
        if (notification === "MODULE_DOM_CREATED") {
            self.calculateCleanSince();
        }
        if (notification === "CLOCK_HOUR") {
            if ( payload === 0 && !self.updated ) {
                Log.log("cleansince called");
                self.calculateCleanSince();
                self.updated = true;
            }
            if ( payload != 0 ) {
                self.updated = false;
            }
        }
    },

    calculateCleanSince: function() {
        var self = this;
        self.sinceDatum = moment(this.config.datum, 'DD.MM.YYYY');
        var today = moment();
        self.periodSince = today.diff(self.sinceDatum, 'days');
        self.costSince = self.periodSince * this.config.packetPerDay * this.config.pricePerPacket;
        self.updateDom();
    },
    getDom: function () {
        console.log(this.periodSince);
        var mainWrapper = document.createElement("div");
        if (this.periodSince) {
            var daysWrapper = document.createElement("div");
            var iconElement = document.createElement("span");
            iconElement.className = "fa fa-smoking-ban";
            iconElement.className += " dimmed";
            iconElement.className += " small";
            var periodElement = document.createElement("span");
            periodElement.className += " small";
            periodElement.innerHTML =  "  " + this.periodSince + " napja!";
            daysWrapper.appendChild(iconElement);
            daysWrapper.appendChild(periodElement);
            var costWrapper = document.createElement("div");
            var moneyElement = document.createElement("span");
            moneyElement.className = "fa fa-money-bill-wave";
            moneyElement.className += " dimmed";
            moneyElement.className += " small";
            var costElement = document.createElement("span");
            costElement.className += " small";
            costElement.innerHTML =  "  Megtakarítás: " + this.costSince + " Ft!";
            costWrapper.appendChild(moneyElement);
            costWrapper.appendChild(costElement);
            mainWrapper.appendChild(daysWrapper);
            mainWrapper.appendChild(costWrapper);
        }
        return mainWrapper;
    },
})
