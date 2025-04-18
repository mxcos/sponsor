// 动画配置
const ANIMATION_CONFIG = {
    duration: 5000,
    pointCount: 15,
    colorRange: 100,
    colorOffset: 150,
    alpha: 0.2
};

// 创建动画实例
new janvas.Canvas({
    container: "#app",
    methods: {
        init: function () {
            this.polys = [], this._rad = 0;
            var _this = this;
            this._anim = new janvas.Animation(this.$raf, 10000, 0,
                function () {
                    this._fromPoints = this._toPoints || _this._generatePoints();
                    this._toPoints = _this._generatePoints(this._fromPoints.length);
                    _this._appendPoints(this._fromPoints, this._toPoints.length);
                    var len = this._fromPoints.length;
                    this._points = _this._generatePoints(len);
                    _this._appendPolys(len -= 2);
                    this._fromColors = this._toColors ?
                        _this._appendColors(this._toColors, len) :
                        _this._assignColors(_this._generateColors(len));
                    this._toColors = _this._assignColors(_this._generateColors(len));
                    this._colors = _this._generateColors(len);
                },
                function (ratio) {
                    for (var i = 0; i < this._fromPoints.length; i++) {
                        this._points[i].copy(this._fromPoints[i])
                            .inline(this._toPoints[i], janvas.Utils.ease.inout.sine(ratio));
                    }
                    for (i = 0; i < this._fromColors.length; i++) {
                        janvas.Rgb.sRgbGammaMixing(this._fromColors[i], this._toColors[i],
                            janvas.Utils.ease.inout.expo(ratio), this._colors[i]);
                        this._colors[i].sRgbCompanding();
                    }
                    _this._updatePolys(this._points, this._colors);
                }
            ).start();
            this._anim.afterUpdate = janvas.Utils.nextTick(this._anim.start);
        },
        update: function (timestamp, interval) {
            this._anim.update(interval);
        },
        draw: function () {
            this.$clear();
            for (var i = 0; i < this.polys.length; i++) this.polys[i].fill();
        }
    },
    functions: {
        _generatePoints: function (len) {
            var w = this.$width, h = this.$height,
                b = new janvas.Point(0, h * 0.7 - h * 0.125),
                result = [new janvas.Point(0, h * 0.7 + h * 0.125), b];
            while (b.x < w + h * 0.125 || result.length < len) {
                result.push(b = this._nextPoint(b));
            }
            return result;
        },
        _nextPoint: function (b) {
            var y = -1, h = this.$height;
            while (y < 0 || y > h) y = b.y + (Math.random() - 0.55) * h * 0.25;
            return new janvas.Point(b.x + (Math.random() - 0.125) * h * 0.25, y);
        },
        _appendPoints: function (points, len) {
            while (points.length < len) {
                points.push(this._nextPoint(points[points.length - 1]));
            }
        },
        _generateColors: function (length) {
            var result = new Array(length);
            for (var i = 0; i < length; i++) result[i] = new janvas.Rgb();
            return result;
        },
        _assignColors: function (colors) {
            for (var i = 0; i < colors.length; i++) {
                this._rad += Math.PI / 25;
                colors[i].init(Math.round(Math.cos(this._rad) * 127) + 128,
                    Math.round(Math.cos(this._rad + Math.PI * 2 / 3) * 127) + 128,
                    Math.round(Math.cos(this._rad + Math.PI * 2 / 3 * 2) * 127) + 128
                ).sRgbInverseCompanding();
            }
            return colors;
        },
        _appendColors: function (colors, len) {
            while (colors.length < len) {
                colors.push(new janvas.Rgb(255, 255, 255).sRgbInverseCompanding());
            }
            return colors;
        },
        _appendPolys: function (length) {
            while (this.polys.length < length) {
                var poly = new janvas.Poly(this.$ctx, 0, 0, [], 6);
                poly.getStyle().setAlpha(0.3);
                this.polys.push(poly);
            }
        },
        _updatePolys: function (points, colors) {
            for (var i = 0; i < this.polys.length; i++) {
                var a = points[i], b = points[i + 1], c = points[i + 2];
                this.polys[i].update(0, a.x, a.y).update(1, b.x, b.y).update(2, c.x, c.y)
                    .getStyle().setFillStyle(colors[i].toRgbString());
            }
        }
    }
}); 