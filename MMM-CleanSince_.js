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
        Log.log("calculatesince called");
        self.sinceDatum = moment(this.config.datum, 'DD.MM.YYYY');
        Log.log("calculatesince", self.sinceDatum);
        var today = moment();
        Log.log("calculatesince", today);
        self.periodSince = today.diff(self.sinceDatum, 'days');
        Log.log("calculatesince", self.periodSince);
        self.updateDom();
    },
    getDom: function () {
        console.log(this.periodSince);
        var mainWrapper = document.createElement("div");
        if (this.periodSince) {
            var iconElement = document.createElement("span");
            iconElement.className = "fa fa-smoking-ban";
            iconElement.className += " dimmed";
            var periodElement = document.createElement("span");
            periodElement.className = "medium";
            periodElement.innerHTML =  "  " + this.periodSince + " napja!";
            mainWrapper.appendChild(iconElement);
            mainWrapper.appendChild(periodElement);
        }
        return mainWrapper;
    },
})
