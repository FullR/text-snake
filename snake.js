var _ = require("lodash");

var movement = {
    up: function(segment) {
        return [segment[0], segment[1] - 1];
    },
    down: function(segment) {
        return [segment[0], segment[1] + 1];
    },
    left: function(segment) {
        return [segment[0] - 1, segment[1]];
    },
    right: function(segment) {
        return [segment[0] + 1, segment[1]];
    }
};

function Snake(options) {
    _.extend(this, options);
    this.growingCount = 0;
    this.moving = false;
    this.readyForInput = true;
    this.theme = this.theme || require("./themes/basic").snake;
}

_.extend(Snake.prototype, {
    step: function(width, height) {
        var dir = this.direction;
        var segments = this.segments;
        var prevSeg = segments[0];
        var seg;
        if(!this.moving) return;
        
        segments[0] = movement[dir](segments[0]);
        
        if(this.loopEdges) {
            if(segments[0][0] < 0) {
                segments[0][0] = width + segments[0][0];
            }
            if(segments[0][1] < 0) {
                segments[0][1] = height + segments[0][1];
            }
            
            if(segments[0][0] >= width) {
                segments[0][0] = segments[0][0] - width;
            }
            if(segments[0][1] >= height) {
                segments[0][1] = segments[0][1] - height;
            }
        }

        for(var i = 1, length = segments.length; i < length; i++) {
            seg = segments[i];
            segments[i] = prevSeg;
            prevSeg = seg;
        }
        if(this.growingCount) {
            this.segments.push(prevSeg);
            this.growingCount--;
        }
        this.readyForInput = true;
        return this;
    },
    
    grow: function() {
        this.growingCount += 5;
        return this;
    },
    
    draw: function(canvas) {
        var theme = this.theme;
        this.segments.forEach(function(seg, index) {
            var x = seg[0];
            var y = seg[1];
            var tile;
            if(!index) {
                tile = theme.head[this.direction] || theme.head["up"];
            }
            else {
                tile = theme.body;
            }

            canvas.drawTile(x, y, [
                tile
            ]);
        }, this);
    },
    
    isInside: function(x, y, width, height) {
        return this.segments.every(function(segment) {
            return segment[0] >= x && segment[1] >= y &&
                segment[0] < (x + width) &&
                segment[1] < (y + height);
        });
    },
    
    move: function(x, y) {
        var dx = x - this.segments[0][0];
        var dy = y - this.segments[0][0];
        this.segments = this.segments.map(function(segment) {
            return [segment[0] + dx, segment[y] + dy];
        });
    },
    
    isSelfColliding: function() {
        return this.segments.some(function(segment) {
            return this.segments
                .filter(function(other) {
                    return other !== segment;
                }).some(function(other) {
                    return other[0] === segment[0] && other[1] === segment[1];
                });
        }, this);
    },

    setDirection: function(dir) {
        if(!this.readyForInput ||
           this.direction === "up" && dir === "down" ||
           this.direction === "down" && dir === "up" ||
           this.direction === "left" && dir === "right" ||
           this.direction === "right" && dir === "left") {
            return;
        }
        this.moving = true;
        this.direction = dir;
        this.readyForInput = false;
    },
    
    isEating: function(food) {
        return this.segments[0][0] === food.position[0] && this.segments[0][1] === food.position[1];
    }
});

module.exports = Snake;
