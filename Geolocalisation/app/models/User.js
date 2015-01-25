var Models;
(function (Models) {
    var user = (function () {
        function user(name, country) {
            this.name = name;
            this.country = country;
        }
        return user;
    })();
    Models.user = user;
})(Models || (Models = {}));
//# sourceMappingURL=User.js.map
