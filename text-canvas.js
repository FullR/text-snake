var _ = require("lodash");

function TextCanvas(width, height, cellWidth, cellHeight, blank) {
    blank = blank || " ";

    this.width = width;
    this.height = height;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.buffer = _.range(height * cellHeight).map(function() {
        return _.range(width * cellWidth).map(function() {
            return blank;
        });
    });
}

_.extend(TextCanvas.prototype, {
    drawTile: function(x, y, tile) {
        var cx;
        var cy;
        var cellHeight = this.cellHeight;
        var cellWidth = this.cellWidth;
        for(cy = 0; cy < cellHeight; cy++) {
            for(cx = 0; cx < cellWidth; cx++) {
                this.buffer[(y * cellHeight) + cy][(x * cellWidth) + cx] = tile[cy][cx];
            }
        }
    },

    drawRaw: function(bx, by, str) {
        str.split("").forEach(function(c, i) {
            this.buffer[by][bx + i] = c;
        }, this);
    },
    
    toString: function() {
        return this.buffer.map(function(row) {
            return row.join("");
        }).join("\n");
    }
});

module.exports = TextCanvas;