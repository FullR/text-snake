var _ = require("lodash");

function Food(options) {
    _.extend(this, options);
}

_.extend(Food.prototype, {
    draw: function(canvas) {
        var x = this.position[0];
        var y = this.position[1];
        canvas.drawTile(x, y, [
            this.theme || require("./themes/basic").food
        ]);
    }
});

module.exports = Food;